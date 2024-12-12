import React from 'react';
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="bg-blue-100 p-4 rounded-lg mb-8 shadow-lg border-2 border-blue-400">
      <ul className="flex justify-around text-xl">
        <li>
          <Link to="/configuration" className="text-blue-600 hover:text-blue-800">Configuration</Link>
        </li>
        <li>
          <Link to="/control" className="text-blue-600 hover:text-blue-800">Control Panel</Link>
        </li>

        <li>
          <Link to="/App" className="text-blue-600 hover:text-blue-800">Ticket Purches</Link>
        </li>

        <li>
          <Link to="/ticketDisplay" className="text-blue-600 hover:text-blue-800">Ticket Display</Link>
        </li>

        <li>
          <Link to="/Analytics" className="text-blue-600 hover:text-blue-800">Analytics</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
