
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('Already connected to MongoDB');
      return;
    }

    const dbUri = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;
    
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected to ${process.env.NODE_ENV === 'test' ? 'Test' : 'Production'} Database`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
