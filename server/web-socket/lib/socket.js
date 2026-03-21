import { Server } from "socket.io";
import http from "http";
import express from "express";
import db from "./db.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import { createPrivateRoom } from "../helpers/utils.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:3000", "http://localhost:3001"],
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

io.on("connection", async (socket) => {
  console.log("A user connected", socket.user.user_id);
  const sql = `UPDATE users set is_active = 1 WHERE user_id = ?`;
  await db.query(sql, [socket.user.user_id]);
  io.emit("user-status-changed", { userId: socket.user.user_id, status: "online" });
  const userId = socket.userId;

  socket.on("joinPrivateRoom", ({ otherUserId }) => {
    if (!userId || !otherUserId) return;
    const roomName = createPrivateRoom(userId, otherUserId);
    socket.join(roomName);
    console.log(`User ${userId} joined private room ${roomName}`);

    io.to(roomName).emit("joinedPrivateRoom", {
      room: roomName,
      userId: userId,
    });
  });

  socket.on("joinGroupRoom", ({ groupId }) => {
    if (!groupId) return;
    const roomName = `group_${groupId}`;
    socket.join(roomName);
    socket.emit("joinedGroupRoom", {
      groupId,
      room: roomName,
    });
    console.log(`Joined group ${roomName}`);
  });

  socket.on("joinNotificationRoom", () => {
    if (!userId) return;
    const roomName = `notification_${userId}`;
    socket.join(roomName);
    socket.emit("joinedNotificationRoom", {
      userId,
      room: roomName,
    });
    console.log(`joined Notifaction ${roomName} `);
  });

  socket.on("disconnect", async () => {
    console.log("A user disconnected", socket.user.user_id);
    const sql = `UPDATE users set is_active = 0 WHERE user_id = ?`;
    await db.query(sql, [socket.user.user_id]);
    io.emit("user-status-changed", { userId: socket.user.user_id, status: "offline" });
  });
});

export { io, app, server };
