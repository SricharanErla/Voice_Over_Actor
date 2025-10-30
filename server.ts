import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI!, {
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));