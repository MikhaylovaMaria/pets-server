import express from "express";
const router = express.Router();

import { announcementValid } from "../validations/valids.js";
import { announcementController } from "../controllers/index.js";

router.post("/", announcementValid, announcementController.create);
router.get("/", announcementController.getAllByCity);

router.get("/:id", announcementController.getOne);
router.delete("/:id", announcementController.remove);
router.patch("/:id", announcementController.update);

export default router;
