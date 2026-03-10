import { v4 } from "uuid";
import db from "../lib/db.js";
import { io } from "../lib/socket.js";
import { createPrivateRoom } from "../helpers/utils.js";

const PrivateMessageController = {
  sendMessage: async (req, res) => {
    const { recipientId } = req.params;
    const { content } = req.body;
    const senderId = req.user.user_id;

    if (!content && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    if (!recipientId)
      return res.status(400).json({ error: "Recipient required" });

    if (recipientId === senderId)
      return res.status(400).json({ error: "Cannot message yourself" });

    try {
      const [userRows] = await db.query(
        "SELECT user_id , display_name FROM profiles  WHERE user_id = ?",
        [recipientId],
      );
      const user = userRows[0]

      if (userRows.length === 0)
        return res.status(404).json({ error: "User not found" });
      const messageId = v4();

      await db.query(
        `INSERT INTO messages
        (message_id, content, sender_id, recipient_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [messageId, content, senderId, recipientId],
      );

      const [rows] = await db.query(
        "SELECT * FROM messages WHERE message_id = ?",
        [messageId],
      );

      const message = rows[0];
      let mediaData = [];
      if (req.files && req.files.length > 0) {
        mediaData = await Promise.all(
          req.files.map(async (file) => {
            const mediaId = v4();

            await db.query(
              `INSERT INTO media
              (media_id, url, type, size, mime_type, message_id, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
              [
                mediaId,
                file.path,
                file.mimetype.startsWith("video") ? "video" : "picture",
                file.size,
                file.mimetype,
                messageId,
              ],
            );

            const [mediaRows] = await db.query(
              "SELECT * FROM media WHERE media_id = ?",
              [mediaId],
            );

            return mediaRows[0];
          }),
        );
      }

      const fullMessage = { ...message, media: mediaData};
      const room = createPrivateRoom(senderId, recipientId);
      io.to(room).emit("newPrivateMessage", fullMessage);
      io.to(`notification_${recipientId.user_id}`)
        .emit('new_message',{
          'message':`new message from ${user.display_name}`,
          'data':fullMessage
        })
      res.status(201).json(fullMessage);

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateMessage: async (req, res) => {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.user_id;

    try {
      const [rows] = await db.query(
        "SELECT * FROM messages WHERE message_id = ?",
        [messageId],
      );

      const message = rows[0];

      if (!message) return res.status(404).json({ error: "Message not found" });

      if (message.sender_id !== userId)
        return res.status(403).json({ error: "Unauthorized" });

      await db.query(
        "UPDATE messages SET content = ?, updated_at = NOW() WHERE message_id = ?",
        [content, messageId],
      );

      const room = createPrivateRoom(message.sender_id, message.recipient_id);

      io.to(room).emit("privateMessageUpdated", {
        messageId,
        content,
      });
      

      res.json({ ...message, content });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteMessage: async (req, res) => {
    const { messageId } = req.params;
    const userId = req.user.user_id;

    try {
      const [rows] = await db.query(
        "SELECT * FROM messages WHERE message_id = ?",
        [messageId],
      );

      const message = rows[0];

      if (!message) return res.status(404).json({ error: "Message not found" });

      if (message.sender_id !== userId)
        return res.status(403).json({ error: "Unauthorized" });

      await db.query("DELETE FROM messages WHERE message_id = ?", [messageId]);

      const room = createPrivateRoom(message.sender_id, message.recipient_id);

      io.to(room).emit("privateMessageDeleted", { messageId });

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
export default PrivateMessageController;
