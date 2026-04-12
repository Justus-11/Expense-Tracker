const app = require("./app");
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// CONNECT DATABASE
connectDB();

const PORT = process.env.PORT || 8000;

// START SERVER
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// HANDLE UNHANDLED PROMISE ERRORS
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION ❌", err.message);

  server.close(() => {
    process.exit(1);
  });
});

// GRACEFUL SHUTDOWN (CTRL + C)
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");

    server.close(() => {
      console.log("Server stopped");
      process.exit(0);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
});