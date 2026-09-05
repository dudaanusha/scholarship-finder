const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  let isInMemory = false;
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.trim() === '') {
    try {
      console.log('⚡ No MONGODB_URI found. Initializing MongoDB Memory Server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      mongoUri = mongoMemoryServer.getUri();
      isInMemory = true;
      console.log(`✅ In-memory MongoDB Server initialized at: ${mongoUri}`);
    } catch (memErr) {
      console.warn('⚠️ In-memory MongoDB initialization warning:', memErr.message);
      mongoUri = 'mongodb://127.0.0.1:27017/scholarship_finder';
    }
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`🎉 MongoDB Connected: ${conn.connection.host} [${isInMemory ? 'IN-MEMORY' : 'EXTERNAL'}]`);
    return { isInMemory, connection: conn };
  } catch (err) {
    if (!isInMemory) {
      console.warn(`⚠️ External MongoDB connection failed (${err.message}). Falling back to In-Memory MongoDB...`);
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        mongoUri = mongoMemoryServer.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(`🎉 In-memory MongoDB Connected fallback: ${conn.connection.host}`);
        return { isInMemory: true, connection: conn };
      } catch (fallbackErr) {
        console.error(`❌ Critical Database Error: ${fallbackErr.message}`);
        process.exit(1);
      }
    } else {
      console.error(`❌ Critical Database Error: ${err.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
