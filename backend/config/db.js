const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = (process.env.MONGODB_URI || process.env.MONGO_URI || '').trim();

  if (!mongoUri) {
    const errorMsg = '❌ Critical: MONGODB_URI (or MONGO_URI) is not defined in environment variables. A persistent MongoDB Atlas connection is required.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log(`🎉 MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return { isInMemory: false, connection: conn };
  } catch (err) {
    console.error(`❌ Critical Database Error: Failed to connect to MongoDB Atlas (${err.message})`);
    throw err;
  }
};

module.exports = connectDB;

