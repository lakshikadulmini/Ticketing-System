import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios'; // Import axios

const socket = io('http://localhost:3000'); // Connect to the backend server

function App() {
  const [customerId, setCustomerId] = useState('');
  const [priority, setPriority] = useState('2');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([]);
  const [isAddingRegularCustomers, setIsAddingRegularCustomers] = useState(false);
  const [regularCustomerId, setRegularCustomerId] = useState(1); // Counter for regular customer IDs
  const [intervalId, setIntervalId] = useState(null); // To store the interval ID for stopping it

  useEffect(() => {
    // Listen for real-time ticketPurchased events
    socket.on('ticketPurchased', (data) => {
      setTickets((prevTickets) => [data, ...prevTickets]); // Add new tickets to the top of the list
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  }, []);

  const handleAddPriorityCustomer = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: customerId, priority: parseInt(priority) }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage(`Priority Customer ${customerId} added successfully!`);
      } else {
        setMessage('Failed to add priority customer.');
      }
    } catch (error) {
      setMessage('Error connecting to the server.');
      console.error(error);
    }
  };

  const addRegularCustomer = async () => {
    const id = `regular-customer-${regularCustomerId}`;
    setRegularCustomerId((prevId) => prevId + 1);

    try {
      const response = await axios.post('http://localhost:3000/api/customers', {
        id,
        priority: 1, // Regular customers have priority 1
      });

      // Check if the response is successful
      if (response.data.success) {
        console.log(`Regular Customer ${id} added successfully.`);
      } else {
        console.error(`Failed to add Regular Customer ${id}: ${response.data.message}`);
      }
    } catch (error) {
      // Catch and log any errors
      console.error('Error adding regular customer:', error.response ? error.response.data : error.message);
    }
  };

  const handleToggleRegularCustomers = () => {
    setIsAddingRegularCustomers((prevState) => {
      const newState = !prevState; // Toggle the state
      if (newState) {
        // Start adding regular customers every 2 seconds
        const newIntervalId = setInterval(() => {
          addRegularCustomer();
        }, 1000);
        setIntervalId(newIntervalId); // Store the interval ID
      } else {
        clearInterval(intervalId); // Stop adding regular customers if toggled off
        setIntervalId(null); // Clear the stored interval ID
      }
      return newState; // Return the new state value
    });
  };

  return (
<div className="bg-white p-6 rounded-lg shadow-md mb-8">
  <h1 className="text-2xl font-bold mb-4 text-gray-800">Ticket System</h1>

 {/* Button to toggle regular customers */}
 <div className="mt-6">
    <button
      onClick={handleToggleRegularCustomers}
      className={`px-4 py-2 rounded-md text-white ${
        isAddingRegularCustomers
          ? 'bg-red-500 hover:bg-red-600'
          : 'bg-green-500 hover:bg-green-600'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isAddingRegularCustomers ? 'focus:ring-red-500' : 'focus:ring-green-500'
      }`}
    >
      {isAddingRegularCustomers
        ? 'Stop Adding Regular Customers'
        : 'Start Adding Regular Customers'}
    </button>
  </div>
  {/* Form to add a priority customer */}
  <form onSubmit={handleAddPriorityCustomer} className="space-y-4">
    <div className="flex flex-col">
      <label htmlFor="customerId" className="text-sm font-medium text-gray-600">
        Customer ID:
      </label>
      <input
        id="customerId"
        type="text"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        required
        className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

   

    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Add Priority Customer
    </button>
  </form>

  {message && (
    <p className="mt-4 text-green-600 font-medium">{message}</p>
  )}

 

  {/* Display ticket updates */}
  <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-700">
    Ticket Purchases
  </h2>
  <ul className="space-y-2">
    {tickets.map((ticket, index) => (
      <li
        key={index}
        className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-200"
      >
        <span className="block font-medium text-gray-700">
          Customer: {ticket.customerId}
        </span>
        <span className="block text-sm text-gray-600">
          Priority: {ticket.priority}, Ticket: {ticket.ticket}, Available: {ticket.available}
        </span>
      </li>
    ))}
  </ul>
</div>

  );
}

export default App;
