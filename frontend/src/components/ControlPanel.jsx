import React from 'react';
import axios from 'axios';

function ControlPanel({ isRunning, onToggle }) {
  const handleToggle = async () => {
    try {
      if (!isRunning) {
        await axios.post('http://localhost:3000/api/system/start');
        onToggle(true);
      } else {
        await axios.post('http://localhost:3000/api/system/stop');
        onToggle(false);
      }
    } catch (error) {
      alert('Error toggling system state');
    }
  };

  return (
    <div className="bg-[#FFEB8B] p-6 rounded-lg shadow-lg max-w-sm mx-auto border-4 border-[#FFD700]">
      <h2 className="text-3xl font-bold mb-6 text-[#FF6347] text-center font-[Comic Sans MS]">
         Control Panel 
      </h2>

      <button
        onClick={handleToggle}
        className={`w-full py-3 text-lg font-medium rounded-md transition-colors duration-300 shadow-lg hover:shadow-xl ${
          isRunning
            ? 'bg-[#FF4500] hover:bg-[#FF6347] text-white'
            : 'bg-[#1E90FF] hover:bg-[#4682B4] text-white'
        }`}
      >
        {isRunning ? ' Stop System' : ' Start System'}
      </button>
    </div>
  );
}

export default ControlPanel;
