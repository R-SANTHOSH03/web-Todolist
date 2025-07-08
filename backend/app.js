import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";
import "./reminderScheduler.js";

import { serveSwagger, setupSwagger } from "./swagger.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Swagger route
app.use("/api-docs", serveSwagger, setupSwagger);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));