import express from "express";
import expressAsyncHandler from "express-async-handler";
import { protectRoute } from "../middleware/auth.middleware.js";
import messageGroupeController from "../controllers/messageGroupe.controller.js";
import upload from '../middleware/multer.middleware.js'
import validate from "../middleware/validate.middleware.js";
import message from "../schema/message.js";

const router = express.Router();
router.use(protectRoute)
router.post("/send/:groupId", upload , validate(message.send) ,expressAsyncHandler(messageGroupeController.sendMessage));
router.put("/update/:messageId",validate(message.update), expressAsyncHandler(messageGroupeController.updateMessage))
router.delete("/delete/messageId",expressAsyncHandler(messageGroupeController.deleteMessage))

export default router;
