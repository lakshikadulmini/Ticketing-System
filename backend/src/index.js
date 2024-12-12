import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import logger from './logger.js'; // Logger module
import { TicketPool } from './ticketPool.js';
import { VendorManager } from './vendorManager.js';
import { CustomerManager } from './customerManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

let ticketPool, vendorManager, customerManager;

(async () => {
  try {
    logger.info("Initializing system components...");

   
    ticketPool = new TicketPool();
    vendorManager = new VendorManager(ticketPool, io);
    customerManager = new CustomerManager(ticketPool, io);

    logger.info("System components initialized.");
  } catch (error) {
    logger.error("Error during system initialization: ", error);
    process.exit(1); // Exit if initialization fails
  }
})();

// Configuration endpoint
app.post('/api/config', (req, res) => {
  try {
    const { totalTickets, ticketReleaseRate, customerRetrievalRate, maxTicketCapacity } = req.body;

    ticketPool.configure(totalTickets, maxTicketCapacity);
    vendorManager.configure(ticketReleaseRate);
    customerManager.configure(customerRetrievalRate);

    logger.info("System configured successfully.", req.body);
    res.json({ success: true });
  } catch (error) {
    logger.error("Error during configuration: ", error);
    res.status(500).json({ success: false, message: "Configuration failed. Please check your inputs." });
  }
});




app.post('/api/vendors/add', (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
      return res.status(400).json({ error: 'Vendor ID and name are required' });
  }

  // Example logic for adding a vendor
  try {
      const newVendor = { id, name }; // Add other vendor properties as needed
      vendorManager.addVendor(newVendor); // Ensure vendorManager is properly instantiated
      res.status(201).json({ message: 'Vendor added successfully', vendor: newVendor });
  } catch (error) {
      console.error('Error adding vendor:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Remove a vendor dynamically
app.post('/api/vendors/remove', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Vendor ID is required' });
  }

  try {
    const updatedVendors = vendorManager.removeVendor(id); // Remove vendor and stop their ticket release
    if (updatedVendors) {
      res.json({
        success: true,
        message: `Vendor ${id} removed successfully.`,
        vendors: updatedVendors, // Send the updated list of vendors
      });
    } else {
      res.status(404).json({ error: `Vendor ${id} not found.` });
    }
  } catch (error) {
    console.error("Error removing vendor:", error);
    res.status(500).json({ success: false, message: "Failed to remove vendor." });
  }
});

// Add a customer dynamically
app.post('/api/customers/add', (req, res) => {
  try {
    const { id, priority } = req.body;

    if (!id || !priority) {
      logger.error("Missing id or priority in request.");
      return res.status(400).json({ success: false, message: "Missing id or priority." });
    }

    customerManager.addCustomer({ id, priority });
    logger.info(`Customer ${id} added successfully.`);
    res.json({ success: true, message: "Customer added successfully." });
  } catch (error) {
    logger.error("Error adding customer: ", error);
    res.status(500).json({ success: false, message: "Failed to add customer." });
  }
});

// Remove a customer dynamically
app.post('/api/customers/remove', (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      logger.error("Missing id in request.");
      return res.status(400).json({ success: false, message: "Missing customer id." });
    }

    customerManager.removeCustomer(id);
    logger.info(`Customer ${id} removed successfully.`);
    res.json({ success: true, message: "Customer removed successfully." });
  } catch (error) {
    logger.error("Error removing customer: ", error);
    res.status(500).json({ success: false, message: "Failed to remove customer." });
  }
});




// Start system endpoint
app.post('/api/system/start', (req, res) => {
  try {
    vendorManager.start();
    //customerManager.start();
    logger.info("System started successfully.");
    res.json({ success: true });
  } catch (error) {
    logger.error("Error starting the system: ", error);
    res.status(500).json({ success: false, message: "Failed to start the system." });
  }
});

// Stop system endpoint
app.post('/api/system/stop', (req, res) => {
  try {
    vendorManager.stop();
    customerManager.stop();
    logger.info("System stopped successfully.");
    res.json({ success: true });
  } catch (error) {
    logger.error("Error stopping the system: ", error);
    res.status(500).json({ success: false, message: "Failed to stop the system." });
  }
});

app.post('/api/customers', (req, res) => {
  try {
    const { id, priority } = req.body;

    // Validate the request body
    if (!id || !priority) {
      console.error('Missing id or priority in the request body.');
      return res.status(400).json({ success: false, message: 'Missing id or priority' });
    }

    // Create a new customer object
    const newCustomer = { id, priority };

    // Add the customer to the customer manager and immediately buy a ticket for them
    customerManager.addCustomer(newCustomer);

    return res.status(200).json({ success: true, message: 'Customer added and ticket purchased successfully' });
  } catch (error) {
    console.error('Error adding customer:', error); // Log the error details
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});





// WebSocket events for real-time updates
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
