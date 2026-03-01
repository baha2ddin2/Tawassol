import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import messageRoutes from "./routes/message.route.js";

import { app, server } from "./lib/socket.js";
import "dotenv/config";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json({ limit: "5mb" })); // req.body
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
});
