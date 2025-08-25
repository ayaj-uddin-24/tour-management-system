import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import "./app/config/passport";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";

const app = express();

// Middlewares
app.use(
  expressSession({
    secret: "my_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1", router);

// Get home route
app.get("/", (req: Request, res: Response) => {
  res.send("I'm home route");
});

// Error handler
app.use(globalErrorHandler);
app.use(notFound);

export default app;
