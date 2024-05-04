import express from "express";

import { chatController } from "../controllers/index.js";

const router = express.Router();

router.post("/", chatController.create);
router.get("/:userId", chatController.userChats);
router.get("/find/:firstId/:secondId", chatController.findChat);

export default router;
