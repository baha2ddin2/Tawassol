import { v4 } from "uuid";
import { io } from "../lib/socket.js";
import db from "../lib/db.js";

const  MessageController = {
  sendMessage: async (req, res) => {
    const { groupId } = req.params;
    const { content } = req.body;
    const userId = req.user.user_id;

    if (!content && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    

    try {
      const [profileInfo] = await db.query(
        "SELECT * FROM profiles WHERE user_id = ?",
        [userId],
      );

      const [membership] = await db.query(
        "SELECT * FROM groupemembers WHERE user_id = ? and group_id = ?",
        [userId, groupId],
      );
      if (membership.length === 0)
        return res.status(403).json({ error: "Not a member of this group" });

      const messageId = v4();
      const insertSql = `INSERT INTO messages 
    (message_id, content, group_id, sender_id,created_at,updated_at) 
    VALUES (?, ?, ?, ? ,now(),now())`;
      await db.query(insertSql, [messageId, content, groupId, userId]);
      const [rows] = await db.query(
        "SELECT * FROM messages WHERE message_id = ?",
        [messageId],
      );
      const message = rows[0];

      let mediaData = [];
      const mediaSql = `INSERT INTO media 
    (media_id, url, type, size,mime_type,message_id) 
    VALUES (?, ?, ?, ? ,?,?)`;
      if (req.files && req.files.length > 0) {
        mediaData = await Promise.all(
          req.files.map(async (file) => {
            let mediaId = v4();
            await db.query(mediaSql, [
              mediaId,
              file.path,
              file.mimetype.startsWith("video") ? "video" : "picture",
              file.size,
              file.mimetype,
              messageId,
            ]);
            const [rowsMedia] = await db.query("SELECT * FROM media WHERE media_id = ?", [
              mediaId,
            ]);
            return rowsMedia[0];
          }),
        );
      }

      const fullMessage = { ...message, media: mediaData , display_name: profileInfo[0].display_name , avatar_url : profileInfo[0].avatar_url  };
      io.to(`group_${groupId}`).emit("newGroupMessage", fullMessage);
      const [groupMembers] = await db.query(
        `SELECT groupemembers.user_id ,display_name FROM groupemembers 
         inner join profiles on profiles.user_id = groupemembers.user_id 
          WHERE group_id = ?`,
        [groupId],
      );
      groupMembers.forEach(groupMember => {
        io.to(`notification_${groupMember.user_id}`)
        .emit('new_message',{
          'message':`new message from ${groupMember.display_name}`,
          'data':fullMessage
        })
      });
      

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
      if (!message || message.sender_id !== userId) {
        return res.status(403).json({ error: "Unauthorized or not found" });
      }

      await db.query("UPDATE messages SET content = ? WHERE message_id = ?", [
        content,
        messageId,
      ]);

      io.to(`group_${message.group_id}`).emit("messageUpdated", {
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
      if (!message || message.sender_id !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const groupId = message.group_id;
      await db.query("DELETE FROM messages WHERE message_id = ?", [messageId]);

      io.to(`group_${groupId}`).emit("messageDeleted", { messageId });

      res.json({ success: true,messageId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default MessageController