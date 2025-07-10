/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import { envVariables } from "./app/config/env";

let server: Server;

const connectServer = async () => {
  try {
    await mongoose.connect(envVariables.DB_URL);
    console.log("DB is connected!!");

    server = app.listen(5000, () => {
      console.log("Server is running");
    });
  } catch (error) {
    console.log(error);
  }
};

connectServer();

// Unhandled Rejection Error
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection Error! Server Shutting Down!!!", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// Uncaught Rejection Error
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exeption Error! Server Shutting Down!!!", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// Signal Terminat Error
process.on("SIGTERM", () => {
  console.log("SIGTERM Signal Received! Server Shutting Down!!!");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
