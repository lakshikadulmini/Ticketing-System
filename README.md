Real-Time Event Ticketing System
Overview

This project is a Real-Time Event Ticketing System that implements a multi-threaded backend with a dynamic, interactive frontend. It supports features such as ticket management by vendors, priority access for VIP customers, real-time updates, and analytics dashboards.
Features

    Frontend: Built with Vite (React) for real-time data synchronization, interactive UI, and responsive design.
    Backend: Developed using Node.js for RESTful endpoints and multi-threaded Java backend for advanced synchronization and ticket pool management.
    Real-Time Updates: Implements WebSocket or periodic polling to display real-time ticket transactions.
    Bonus Features: VIP customer priority, dynamic vendor/customer management, analytics dashboard, and transaction persistence.

Prerequisites

Ensure you have the following installed:

    Node.js: v16+
    Java: JDK 11 or higher
    Vite: For React-based frontend
    FireBase: For transaction data persistence 
    Git: For version control

Setup Instructions
Clone the Repository

git clone <repository-url>
cd real-time-ticketing-system

Backend Setup

    Navigate to the backend directory:

cd backend

Install dependencies:

npm install

Start the backend server:

    npm start

    If using the Java backend:
        Compile the Java classes using your IDE or command line.
        Run the Main.java file to start the server.

Frontend Setup

    Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install

Start the development server:

    npm run dev

    Access the application in your browser at http://localhost:3000.

Usage Instructions

    Configuration:
        Use the ConfigurationForm on the frontend to set initial parameters (e.g., number of vendors/customers, ticket pool size).
        Start/stop ticketing processes using the control panel.

    Monitoring:
        View real-time ticket statuses in the TicketStatus section.
        Check transaction logs in the LogDisplay section.

    Dynamic Management:
        Add/remove vendors or customers during runtime via the GUI.

Testing
Manual Testing

    Use the GUI to simulate ticket buying/selling scenarios with multiple customers and vendors.
    Test edge cases such as exceeding ticket capacity or invalid configurations.

Automated Testing

    Backend test cases are included in the tests directory. Run with:

npm test
