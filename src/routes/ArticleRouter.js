import express from "express";
const router = express.Router();

import { articleValid } from "../validations/valids.js";
import { articleController } from "../controllers/index.js";

router.post("/", articleValid, articleController.create);
router.get("/", articleController.getAll);
router.get("/:id", articleController.getOne);
router.delete("/:id", articleController.remove);
router.patch("/:id", articleController.update);

export default router;
