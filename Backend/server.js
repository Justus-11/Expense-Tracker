const app = require("./app");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION ❌", err.message);
      server.close(() => process.exit(1));
    });

  } catch (err) {
    console.error("Server failed ❌", err.message);
    process.exit(1);
  }
};

startServer();