import { getReceiverSocketId, io } from "../lib/socket.js";
import { validateMessage } from "../schema/message.js";



export const sendMessage = async (req, res) => {
    const validationError =validateMessage(req.body)
    if (validationError) {
        console.error(validationError)
        return res.status(400).json({ error: validationError });
    }
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user.user_id;

    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }


    const sql = "INSERT INTO messages (user, product_id, quantity) VALUES (?, ?, ?)";
    try {
        const result = await db.query(sql, [user, productId, quantity])
        res.status(201).json({ id: result.insertId, user, productId, quantity });
    } catch (error) {
        console.error('Database insertion error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

