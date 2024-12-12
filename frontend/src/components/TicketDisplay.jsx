import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function TicketDisplay() {
  const [availableTickets, setAvailableTickets] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    // When new tickets are added
    socket.on('ticketsAdded', (data) => {
      setAvailableTickets(data.available);
      setTransactions(prev => [{
        type: 'added',
        count: data.count,
        timestamp: new Date()
      }, ...prev].slice(0, 10));
    });

    // When tickets are purchased
    socket.on('ticketPurchased', (data) => {
      setAvailableTickets(data.available);
      setTransactions(prev => [{
        type: 'purchased',
        ticket: data.ticket,
        timestamp: new Date()
      }, ...prev].slice(0, 10));
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="bg-[#FAFAD2] p-6 mb-8 rounded-lg shadow-xl">
      <h2 className="text-4xl font-bold text-[#FF6347] mb-6 text-center"> Ticket Updates </h2>
      
      <div className="mb-8">
        <div className="text-7xl font-bold text-[#32CD32]">
          {availableTickets}
        </div>
        <div className="text-xl text-[#4682B4] font-semibold">Tickets Left!</div>
      </div>
      
      <div>
        <h3 className="text-2xl font-sans mb-4 text-[#8B4513]">Latest Events (Recent Updates)</h3>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-2 ${
                transaction.type === 'added' 
                  ? 'border-[#FFD700] bg-[#FFEB8B]'  // yellow background for added
                  : 'border-[#20B2AA] bg-[#B0E0E6]'  // light blue background for purchased
              }`}
              style={{ marginBottom: '15px', fontSize: '16px', fontFamily: 'Comic Sans MS' }}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <span className="text-3xl"></span>
                </div>
                {transaction.type === 'added' 
                  ? `Whoa! ${transaction.count} tickets added!`
                  : `Yay! TICKET ${transaction.ticket.id || '??'} BOUGHT!`}
              </div>
              <div className="text-xs text-gray-800 mt-2">
                {new Date(transaction.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TicketDisplay;
