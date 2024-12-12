import { db } from './firebaseConfig.js'; // Import Firestore instance
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

class CustomerManager {
  constructor(ticketPool, io) {
    this.ticketPool = ticketPool;
    this.io = io;
    this.customers = []; // Array to store customers
    this.isRunning = false;
    this.retrievalRate = 0;
  }

  // Configure the rate at which customers retrieve tickets
  configure(retrievalRate) {
    this.retrievalRate = retrievalRate;
  }

  // Add a customer to the customer pool
  async addCustomer(customer) {
    if (this.customers && Array.isArray(this.customers)) {
      this.customers.push(customer);
      console.log(`Customer ${customer.id} added successfully.`);

      // Save customer details to Firestore
      try {
        await setDoc(doc(db, 'customers', customer.id), {
          id: customer.id,
          priority: customer.priority,
          addedAt: serverTimestamp(), // Firestore server timestamp
        });

        console.log(`Customer ${customer.id} added to Firestore.`);
      } catch (error) {
        console.error(`Failed to add customer ${customer.id} to Firestore:`, error);
      }

      // Attempt to buy a ticket for the newly added customer
      this.purchaseTicketForCustomer(customer);
    } else {
      console.error('Customer array is not initialized properly.');
    }
  }

  // Remove a customer by ID
  async removeCustomer(customerId) {
    const index = this.customers.findIndex((customer) => customer.id === customerId);
    if (index !== -1) {
      const removedCustomer = this.customers.splice(index, 1)[0];
      console.log(`Customer ${customerId} removed successfully.`);

      // Remove customer from Firestore
      try {
        await deleteDoc(doc(db, 'customers', customerId));
        console.log(`Customer ${customerId} removed from Firestore.`);
      } catch (error) {
        console.error(`Failed to remove customer ${customerId} from Firestore:`, error);
      }

      this.io.emit('customerRemoved', { customerId });
      return removedCustomer;
    } else {
      console.log(`Customer with ID ${customerId} not found.`);
      return null;
    }
  }

  // Remove all customers
  async removeAllCustomers() {
    const removedCustomers = [...this.customers]; // Copy current list for logging
    this.customers = [];

    // Remove all customers from Firestore
    try {
      for (const customer of removedCustomers) {
        await deleteDoc(doc(db, 'customers', customer.id));
      }
      console.log(`All customers removed from Firestore.`);
    } catch (error) {
      console.error(`Failed to remove all customers from Firestore:`, error);
    }

    console.log(`All customers removed successfully.`);
    this.io.emit('allCustomersRemoved', { count: removedCustomers.length });
    return removedCustomers;
  }

  // Purchase a ticket for the customer (immediately when added)
  purchaseTicketForCustomer(customer) {
    const ticket = this.ticketPool.removeTicket();

    if (ticket) {
      console.log(`Customer ${customer.id} purchased ticket: ${ticket.id}`);
      this.io.emit('ticketPurchased', {
        customerId: customer.id,
        ticket,
        available: this.ticketPool.getAvailableCount(),
      });
    } else {
      console.log(`No tickets available for customer ${customer.id}`);
    }
  }

  // Start handling customer actions (e.g., retrieving tickets periodically)
  start() {
    this.isRunning = true;
    this.startCustomers();
  }

  stop() {
    this.isRunning = false;
  }

  startCustomers() {
    const customerInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(customerInterval);
        return;
      }

      for (let i = 0; i < this.retrievalRate; i++) {
        const ticket = this.ticketPool.removeTicket();
        if (ticket) {
          this.io.emit('ticketPurchased', {
            ticket,
            available: this.ticketPool.getAvailableCount(),
          });
        }
      }
    }, 1000);
  }
}

export { CustomerManager };
