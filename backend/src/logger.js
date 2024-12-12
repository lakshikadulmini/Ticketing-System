import winston from 'winston';
import { db } from './firebaseConfig.js'; // Import Firestore instance
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Define a custom transport for Firebase
class FirebaseTransport extends winston.Transport {
  log(info, callback) {
    // Save log entry to Firestore
    addDoc(collection(db, 'logs'), {
      level: info.level,
      message: info.message,
      timestamp: serverTimestamp(), // Firestore server timestamp
    })
      .then(() => {
        console.log('Log entry saved to Firestore:', info);
      })
      .catch((error) => {
        console.error('Failed to save log entry to Firestore:', error);
      });

    callback();
  }
}

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' }), // Logs to file
    new FirebaseTransport(), // Logs to Firestore
  ],
});

export default logger;
