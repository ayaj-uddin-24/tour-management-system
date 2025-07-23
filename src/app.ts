import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("I'm home route");
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found Error
app.use(notFound);

export default app;
