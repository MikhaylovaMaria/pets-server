import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sequelize from "./db.js";
import checkAuth from "./src/utils/checkAuth.js";
import { exec } from "child_process";

import {
  initializeStatusesArticle,
  initializeStatusesAnnouncement,
  initializeAnnouncementType,
  initializeCity,
} from "./src/initialize/index.js";

import ArticleRoter from "./src/routes/ArticleRouter.js";
import AnnouncementRoter from "./src/routes/AnnouncementRouter.js";
import ChatRouter from "./src/routes/ChatRouter.js";
import MessageRouter from "./src/routes/MessageRouter.js";
import AuthRouter from "./src/routes/AuthRouter.js";
import UserRouter from "./src/routes/UserRouter.js";
import DefaultValuesRouter from "./src/routes/DefaultValuesRouter.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/articles", checkAuth, ArticleRoter);
app.use("/announcement", checkAuth, AnnouncementRoter);
app.use("/chat", checkAuth, ChatRouter);
app.use("/message", checkAuth, MessageRouter);
app.use("/auth", AuthRouter);
app.use("/users", checkAuth, UserRouter);
app.use("/", DefaultValuesRouter);

function initializeDatabase() {
  exec("./init_db.sh", (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка при выполнении init_db.sh: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Ошибка: ${stderr}`);
      return;
    }
    console.log(`Вывод: ${stdout}`);
  });
}

initializeDatabase();
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

// ПРОВЕРИТЬ ВЕЗДЕ НА АУНТИФИКАЦИЮ
// app.post("/articles", checkAuth, articleValid, articleController.create);
// app.get("/articles", checkAuth, articleController.getAll);
// app.get("/articles/:id", checkAuth, articleController.getOne);
// app.delete("/articles/:id", checkAuth, articleController.remove);
// app.patch("/articles/:id", checkAuth, articleController.update);

// app.post(
//   "/announcement",
//   checkAuth,
//   announcementValid,
//   announcementController.create
// );
// app.get("/announcement", checkAuth, announcementController.getAllByCity);
// app.get("/announcement/:id", checkAuth, announcementController.getOne);
// app.delete("/announcement/:id", checkAuth, announcementController.remove);
// app.patch("/announcement/:id", checkAuth, announcementController.update);

// Переделать на роуты
// app.get("/auth/me/:id?", checkAuth, userController.getMe);
// app.post("/login", loginValid, userController.login);
// app.post("/register", registerValid, userController.register);

// app.get("/users/:id", userController.getUser);
// app.get("/users", checkAuth, userController.getAllUsers);
// app.post("/users/:userId/friends/:friendId", userController.createSubscription);
// app.delete(
//   "/users/:userId/friends/:friendId",
//   userController.deleteSubscription
// );
// app.get("/users/:userId/friends", userController.getUserSubscription);

// app.get("/cities", defaultValueController.getAllCities);
// app.get("/types", defaultValueController.getTypes);
