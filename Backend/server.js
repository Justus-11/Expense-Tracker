require("dotenv").config();

const app = require("./app");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8000;

// START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    await connectDB(); // WAIT for DB first

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    // HANDLE UNHANDLED PROMISE ERRORS
    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION ❌", err.message);
      server.close(() => process.exit(1));
    });

    // GRACEFUL SHUTDOWN
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");

      server.close(() => {
        console.log("Server stopped");
        process.exit(0);
      });
    });

  } catch (err) {
    console.error("Server failed to start ❌", err.message);
    process.exit(1);
  }
};

startServer();