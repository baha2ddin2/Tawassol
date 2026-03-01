import express from "express";
import {
  sendMessage,
} from "../controllers/message.controller.js";
import expressAsyncHandler from "express-async-handler";

const router = express.Router();

router.post("/send/:id", expressAsyncHandler(sendMessage));

export default router;
