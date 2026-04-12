const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let DB = process.env.MONGODB_URI;

    // Only replace if password exists
    if (process.env.DATABASE_PASSWORD) {
      DB = DB.replace(
        "<PASSWORD>",
        encodeURIComponent(process.env.DATABASE_PASSWORD)
      );
    }

    const conn = await mongoose.connect(DB);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection Error ❌", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;