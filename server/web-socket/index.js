import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import groupeMessageRoutes from "./routes/groupemessage.route.js";
import { app, server } from "./lib/socket.js";
import "dotenv/config";
import messageRoute from './routes/message.route.js'
import { fileURLToPath } from "url";
import { join,dirname } from "path";


const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.json({ limit: "5mb" })); // req.body
app.use(cors({ origin: "http://127.0.0.1:3000", credentials: true }));
app.use(cookieParser());
app.use("/uploads",express.static(path.join(__dirname,'uploads')))

app.use("/api/group-messages", groupeMessageRoutes);
app.use("/api/messages",messageRoute)

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
});
