import express from "express";
import { registerValid, loginValid } from "../validations/valids.js";
import { userController } from "../controllers/index.js";

const router = express.Router();

// app.get("/auth/me/:id?", checkAuth, userController.getMe);
router.post("/login", loginValid, userController.login);
router.post("/register", registerValid, userController.register);

export default router;
