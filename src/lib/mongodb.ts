import mongoose from 'mongoose';

interface MongoDBConnection {
  isConnected: boolean;
}

const connection: MongoDBConnection = {
  isConnected: false,
};

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/voice_over_db';

export const connectToMongoDB = async (): Promise<void> => {
  try {
    if (connection.isConnected) {
      console.log('Already connected to MongoDB');
      return;
    }

    if (mongoose.connections.length > 0) {
      connection.isConnected = mongoose.connections[0].readyState === 1;
      if (connection.isConnected) {
        console.log('Using previous connection');
        return;
      }
      await mongoose.disconnect();
    }

    await mongoose.connect(MONGODB_URI);
    connection.isConnected = mongoose.connections[0].readyState === 1;
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    connection.isConnected = false;
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export const disconnectFromMongoDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    connection.isConnected = false;
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
};

export const getConnectionStatus = (): boolean => connection.isConnected;

console.log('Server: Connected to MongoDB');
console.log('Server: Listening on port 4000');