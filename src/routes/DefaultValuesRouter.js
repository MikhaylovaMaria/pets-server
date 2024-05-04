import express from "express";
import { defaultValueController } from "../controllers/index.js";

const router = express.Router();

router.get("/cities", defaultValueController.getAllCities);
router.get("/types", defaultValueController.getTypes);

export default router;
