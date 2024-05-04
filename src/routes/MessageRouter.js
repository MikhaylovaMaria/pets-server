import express from "express";
import { messageController } from "../controllers/index.js";

const router = express.Router();

router.post("/", messageController.addMessage);
router.get("/:chatId", messageController.getMessages);

export default router;
