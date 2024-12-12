import React, { useState } from 'react';
import axios from 'axios';

function ConfigurationForm({ disabled }) {
  const [config, setConfig] = useState({
    totalTickets: 1000,
    ticketReleaseRate: 2,
    customerRetrievalRate: 3,
    maxTicketCapacity: 100,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/config', config);
      alert('Configuration saved successfully!');
    } catch (error) {
      alert('Error saving configuration');
    }
  };

  return (
    <div className="bg-[#E6F7FF] p-6 rounded-lg mb-8 shadow-lg max-w-md mx-auto border border-[#B0E0E6]">
      <h2 className="text-3xl font-bold mb-6 text-[#4682B4] text-center font-[Comic Sans MS]">
         System Configuration 
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#4169E1]">
              Total Tickets
            </label>
            <input
              type="number"
              value={config.totalTickets}
              onChange={(e) =>
                setConfig({ ...config, totalTickets: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-[#ADD8E6] shadow-sm focus:ring-[#4682B4] focus:border-[#4682B4] text-[#333333]"
              disabled={disabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4169E1]">
              Ticket Release Rate (per second)
            </label>
            <input
              type="number"
              value={config.ticketReleaseRate}
              onChange={(e) =>
                setConfig({
                  ...config,
                  ticketReleaseRate: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-[#ADD8E6] shadow-sm focus:ring-[#4682B4] focus:border-[#4682B4] text-[#333333]"
              disabled={disabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4169E1]">
              Customer Retrieval Rate (per second)
            </label>
            <input
              type="number"
              value={config.customerRetrievalRate}
              onChange={(e) =>
                setConfig({
                  ...config,
                  customerRetrievalRate: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-[#ADD8E6] shadow-sm focus:ring-[#4682B4] focus:border-[#4682B4] text-[#333333]"
              disabled={disabled}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4169E1]">
              Maximum Ticket Capacity
            </label>
            <input
              type="number"
              value={config.maxTicketCapacity}
              onChange={(e) =>
                setConfig({
                  ...config,
                  maxTicketCapacity: parseInt(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-[#ADD8E6] shadow-sm focus:ring-[#4682B4] focus:border-[#4682B4] text-[#333333]"
              disabled={disabled}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E90FF] text-white py-2 rounded-md shadow-sm hover:bg-[#4682B4] disabled:opacity-50"
            disabled={disabled}
          >
            Save Configuration
          </button>
        </div>
      </form>

      <div>
        
      </div>
    </div>
    
  );
}

export default ConfigurationForm;
