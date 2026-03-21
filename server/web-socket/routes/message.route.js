import express from "express";
import expressAsyncHandler from "express-async-handler";
import { protectRoute } from "../middleware/auth.middleware.js";
import messageController from "../controllers/message.controller.js";
import upload from '../middleware/multer.middleware.js'
import validate from "../middleware/validate.middleware.js";
import message from "../schema/message.js";

const router = express.Router();
router.use(protectRoute)
router.post("/send/:recipientId",upload,validate(message.send),expressAsyncHandler(messageController.sendMessage));
router.put("/update/:messageId",validate(message.update),expressAsyncHandler(messageController.updateMessage))
router.put("/seen/:messageId",expressAsyncHandler(messageController.messageSeen))
router.delete("/delete/:messageId",expressAsyncHandler(messageController.deleteMessage))

export default router;