import express from "express";
import { userController } from "../controllers";

const router = express.Router();

router.get("/:id", userController.getUser);
router.get("/", userController.getAllUsers);
router.post("/:userId/friends/:friendId", userController.createSubscription);
router.delete("/:userId/friends/:friendId", userController.deleteSubscription);
router.get("/:userId/friends", userController.getUserSubscription);

export default router;
