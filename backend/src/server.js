import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { ENV } from "./config/env.js";
import { startServer } from "./config/startServer.js";

import authRoutes from "./routes/auth.route.js";
import petRoutes from "./routes/pet.route.js";
import incidentRoutes from "./routes/incident.route.js";
import storyRoutes from "./routes/story.route.js";
import managerRoutes from "./routes/manager.route.js";
import adminRoutes from "./routes/admin.route.js";
import profileRoutes from "./routes/profile.route.js";

const app = express();
const { FRONTEND_URL } = ENV;

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profiles", profileRoutes);

// start server
startServer(app);
