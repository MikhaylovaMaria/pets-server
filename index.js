import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import models from "./src/models/models.js";
import {
  registerValid,
  loginValid,
  articleValid,
  announcementValid,
} from "./src/validations/valids.js";
import checkAuth from "./src/utils/checkAuth.js";

import {
  userController,
  articleController,
  announcementController,
  defaultValueController,
  chatController,
  messageController,
} from "./src/controllers/index.js";
import {
  initializeStatusesArticle,
  initializeStatusesAnnouncement,
  initializeAnnouncementType,
  initializeCity,
} from "./src/initialize/index.js";

const { User } = models;

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.get("/auth/me", checkAuth, userController.getMe);
app.post("/login", loginValid, userController.login);
app.post("/register", registerValid, userController.register);

// ПРОВЕРИТЬ ВЕЗДЕ НА АУНТИФИКАЦИЮ
app.post("/articles", checkAuth, articleValid, articleController.create);
app.get("/articles", checkAuth, articleController.getAll);
app.get("/articles/:id", checkAuth, articleController.getOne);
app.delete("/articles/:id", checkAuth, articleController.remove);
app.patch("/articles/:id", checkAuth, articleController.update);

app.post(
  "/announcement",
  checkAuth,
  announcementValid,
  announcementController.create
);
app.get("/announcement", checkAuth, announcementController.getAllByCity);
app.get("/announcement/:id", checkAuth, announcementController.getOne);
app.delete("/announcement/:id", checkAuth, announcementController.remove);
app.patch("/announcement/:id", checkAuth, announcementController.update);

app.get("/cities", defaultValueController.getAllCities);

app.post("/chats", chatController.create);
app.get("/chats", chatController.getOneChat);
app.get("/chats/all", chatController.getAllChats);

app.post("/message", messageController.create);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    await Promise.all([
      initializeStatusesArticle(),
      initializeStatusesAnnouncement(),
      initializeAnnouncementType(),
      initializeCity(),
    ]);

    app.listen(PORT, console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
