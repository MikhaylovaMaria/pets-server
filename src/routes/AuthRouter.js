import express from "express";

const router = express.Router();

// app.get("/auth/me/:id?", checkAuth, userController.getMe);
router.post("/login", loginValid, userController.login);
router.post("/register", registerValid, userController.register);

export default router;
