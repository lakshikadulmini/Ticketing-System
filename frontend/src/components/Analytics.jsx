import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    let timePoints = [];

    const addDataPoint = (available) => {
      const now = new Date();
      timePoints.push({
        time: now.toLocaleTimeString(),
        available
      });

      // Keep last 20 points
      if (timePoints.length > 20) {
        timePoints = timePoints.slice(-20);
      }

      setData([...timePoints]);
    };

    socket.on('ticketsAdded', (data) => addDataPoint(data.available));
    socket.on('ticketPurchased', (data) => addDataPoint(data.available));

    return () => socket.disconnect();
  }, []);

  return (
    <div className="bg-blue-100 p-12 rounded-lg text-gray-700 border-4 border-blue-400">
      <h2 className="text-4xl font-semibold text-center text-black mb-8 tracking-widest">
         REAL-TIME TICKET ANALYTICS 
      </h2>

      <div className="flex justify-center items-center mb-6">
        <p className="text-xl text-blue-600 font-bold">Watch Ticket Trends in Real-Time!</p>
      </div>

      <div className="w-full h-[500px]">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 30, right: 60, left: 30, bottom: 30 }}>
            <CartesianGrid strokeDasharray="5 5" stroke="#B0C4DE" />
            <XAxis dataKey="time" stroke="#4682B4" tick={{ fontSize: 12, fontWeight: 'bold' }} />
            <YAxis stroke="#4682B4" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#B0E0E6',
                border: '2px solid #4682B4',
                borderRadius: '5px',
              }}
              labelStyle={{ color: '#000000', fontWeight: 'bold' }}
              itemStyle={{ color: '#4682B4' }}
            />
            <Line
              type="monotone"
              dataKey="available"
              stroke="#4682B4"
              strokeWidth={4}
              dot={{ r: 6, strokeWidth: 2, stroke: '#4682B4', fill: '#B0E0E6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
