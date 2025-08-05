/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import { envVariables } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

// Connecting to the server
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

(async () => {
  await connectServer();
  await seedSuperAdmin();
})();

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
  console.log("Uncaught Exception Error! Server Shutting Down!!!", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

// Signal Terminate Error
process.on("SIGTERM", () => {
  console.log("SIGTERM Signal Received! Server Shutting Down!!!");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
