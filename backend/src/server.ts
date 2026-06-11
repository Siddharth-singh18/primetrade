import app from "./app";
import mongoose from "mongoose";
import { redisClient } from "./config/redis";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Starting server...");

    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB Connected");

    // await redisClient.connect();
    // console.log("Redis Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
