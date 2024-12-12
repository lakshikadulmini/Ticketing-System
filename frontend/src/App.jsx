import React, { useState } from 'react';
import ConfigurationForm from './components/ConfigurationForm';
import TicketDisplay from './components/TicketDisplay';
import ControlPanel from './components/ControlPanel';
import Analytics from './components/Analytics';
import Customer from './components/Customer';
import AddAndRemove from './components/AddAndRemove';

function App() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 p-6">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-xl p-8 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-[#1E3A8A] font-sans">
            Ticket Management System
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Real-time management of ticketing, customer flow, and system configuration.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Configuration Section */}
          <div className="bg-[#F0F8FF] p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-[#1E40AF] mb-4"> System Configuration</h2>
            <ConfigurationForm disabled={isRunning} />
          </div>

          {/* Control Panel Section */}
          <div className="bg-[#FFF8E1] p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-[#FF6347] mb-4"> Control Panel</h2>
            <ControlPanel 
              isRunning={isRunning} 
              onToggle={(running) => setIsRunning(running)} 
            />
          </div>

          {/* Add/Remove Tickets Section */}
          <div className="bg-[#E6F7FF] p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-[#4682B4] mb-4"> Add & Remove Tickets</h2>
            <AddAndRemove />
          </div>

          {/* Ticket Display Section */}
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-[#2D3748] mb-4"> Ticket Overview</h2>
            <TicketDisplay />
          </div>

          {/* Analytics Section */}
          <div className="bg-[#E0FFFF] p-6 rounded-lg shadow-md lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#4682B4] mb-4"> Real-time Analytics</h2>
            <Analytics />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
