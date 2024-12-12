import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

function App() {
  const [message, setMessage] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [priority, setPriority] = useState('2');
  const [vendors, setVendors] = useState([]); // State to store the list of vendors

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/vendors');
        if (response.data && response.data.length === 0) {
          setVendors([]); // Set to empty array if no vendors
        } else {
          setVendors(response.data); // Set vendors list if data is available
        }
      } catch (error) {
        console.log('Error fetching vendors');
        setVendors([]); // Ensure vendors is set to an empty array on error
      }
    };

    fetchVendors();
  }, []);

  const handleAddVendor = async () => {
    try {
      let newId;
      do {
        newId = `vendor${Math.floor(Math.random() * 1000) + 1}`;
      } while (vendors.some(vendor => vendor.id === newId));

      const newVendor = {
        id: newId,
        name: `Vendor ${vendors.length + 1}`,
      };

      const response = await axios.post('http://localhost:3000/api/vendors/add', newVendor);
      console.log('Vendor added:', response.data);
      setVendors([...vendors, response.data.vendor]);
    } catch (error) {
      console.error('Error adding vendor:', error.response?.data || error.message);
    }
  };

  const handleRemoveVendor = async (vendorId) => {
    try {
      const response = await axios.post('http://localhost:3000/api/vendors/remove', { id: vendorId });
      setMessage(response.data.message);
      setVendors(vendors.filter(vendor => vendor.id !== vendorId));
    } catch (error) {
      setMessage('Error removing vendor.');
      console.error(error);
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/customers/add', {
        id: customerId,
        priority: parseInt(priority),
      });
      setMessage(response.data.message);
      setCustomerId('');
    } catch (error) {
      setMessage('Error adding customer.');
      console.error(error);
    }
  };

  const handleRemoveCustomer = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/customers/remove', { id: customerId });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error removing customer.');
      console.error(error);
    }
  };

  return (
    <div className="bg-blue-100 text-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 text-center">Vendor/Customer Management</h1>
      {message && <p className="text-red-500 font-medium mb-4 text-center">{message}</p>}

      {/* Vendor Management */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow-md border-2 border-blue-300">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Vendors</h2>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleAddVendor}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
          >
            Add Vendor
          </button>
        </div>
        <ul>
          {vendors.length > 0 ? (
            vendors.map((vendor) => (
              <li key={vendor.id} className="mb-3 flex justify-between items-center">
                <span className="text-gray-700">{vendor.name} (ID: {vendor.id})</span>
                <button
                  onClick={() => handleRemoveVendor(vendor.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                >
                  Remove
                </button>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No vendors available.</li>
          )}
        </ul>
      </div>

      {/* Customer Management */}
      <div className="bg-white rounded-lg p-6 shadow-md border-2 border-blue-300">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700">Customers</h2>
        <form onSubmit={handleAddCustomer} className="space-y-6">
          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
              Customer ID
            </label>
            <input
              id="customerId"
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="border border-gray-300 bg-white text-gray-800 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border border-gray-300 bg-white text-gray-800 rounded-md p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
              <option value="1">Regular</option>
              <option value="2">VIP</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              Add Customer
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={handleRemoveCustomer}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            >
              Remove Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
