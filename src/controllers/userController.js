import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import models from "../models/models.js";
const { User, Subscription } = models;
import { Op } from "sequelize";
dotenv.config();
import dotenv from "dotenv";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const anotherUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (anotherUser) {
      return res.status(500).json({
        message: "Пользователь с таким email существует",
      });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthDate: req.body.birthDate,
      cityId: req.body?.cityId,
      sex: req.body?.sex,
      avatar: req.body?.avatar,
      typeUser: req.body?.typeUser,
      email: req.body.email,
      passwordHash: hash,
    });
    const token = jwt.sign(
      {
        id: user.userId,
      },
      process.env.SEKRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    const { passwordHash, ...userData } = user.dataValues;
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось зарегистрироваться" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      // Потом заменить "Неверный пользователь или пароль"
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );
    if (!isValidPass) {
      // Потом заменить "Неверный пользователь или пароль"
      return res.status(400).json({
        message: "Пароли не совпадают",
      });
    }
    const token = jwt.sign(
      {
        id: user.userId,
      },
      process.env.SEKRET_KEY,
      {
        expiresIn: "30d",
      }
    );
    const { passwordHash, ...userData } = user.dataValues;
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Не удалось авторизоваться" });
  }
};
export const getMe = async (req, res) => {
  try {
    let user;
    const { id } = req.params;

    if (id) {
      user = await User.findByPk(id);
    } else {
      user = await User.findByPk(req.userId);
    }
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден " });
    }
    const { passwordHash, ...userData } = user.dataValues;
    res.json(userData);
  } catch (error) {
    res.status(500).json("Нет доступа");
  }
};

export const getUser = async (req, res) => {
  try {
    let userData;
    const userId = req.params.id;
    if (userId) {
      userData = await User.findByPk(userId);
    } else {
      return res.status(500).json("НЕТ ID В запроса");
    }
    if (!userData) {
      return res.status(404).json({ message: "ПОЛЬЗОВАТЕЛЯ НЕТ" });
    }
    const { passwordHash, ...user } = userData.dataValues;
    res.json(user);
  } catch (error) {
    res.status(500).json("ОШИБКА ПОЛУЧЕНИЯ ПОЛЬЗОВАТЕЛЯ");
  }
};

export const getAllUsers = async (req, res) => {
  // приоритет пользователи по городу сделать!
  const userId = req.userId;

  try {
    const usersData = await User.findAll({
      where: { userId: { [Op.ne]: userId } },
      attributes: ["userId", "firstName", "lastName", "avatar"],
    });
    console.log(usersData);
    res.json(usersData);
  } catch (error) {
    res.status(500).json("ОШИБКА ПОЛУЧЕНИЯ Пользователей");
  }
};

export const createSubscription = async (req, res) => {
  const { userId, friendId } = req.params;
  console.log("userId", userId);
  console.log("friendId", friendId);
  try {
    const isSubscription = await Subscription.findOne({
      where: {
        [Op.and]: [{ subscriberId: userId, subscribedToId: friendId }],
      },
    });

    if (isSubscription) {
      return res.status(500).json("Подписка существует");
    }

    const newSub = await Subscription.create({
      subscriberId: userId,
      subscribedToId: friendId,
    });
    res.json(newSub);
  } catch (error) {
    console.log(error);
    res.status(500).json("ОШИБКА новой подписки");
  }
};

export const deleteSubscription = async (req, res) => {
  const { userId, friendId } = req.params;
  try {
    const deletedubscriptionCount = await Subscription.destroy({
      where: {
        [Op.and]: [{ subscriberId: userId, subscribedToId: friendId }],
      },
    });

    if (deletedubscriptionCount === 0) {
      return res.status(500).json("Не удалось удалить подписку");
    }

    res.json({ succsess: true });
  } catch (error) {
    console.log(error);
    res.status(500).json("ОШИБКА удаления подписки");
  }
};

export const getUserSubscription = async (req, res) => {
  const { userId } = req.params;

  try {
    const subscribedUsers = await Subscription.findAll({
      where: {
        subscriberId: userId,
      },
      include: {
        model: User,
        as: "subscribers",
        attributes: ["firstName", "lastName", "userId", "avatar"],
      },
      attributes: [],
    });
    const formattedResult = subscribedUsers.map((subscription) =>
      subscription.subscribers.toJSON()
    );
    res.json(formattedResult);
  } catch (error) {
    console.log(error);
    res.status(500).json("ОШИБКА получения подписок");
  }
};

// const subscribers = await Subscription.findAll({
//   where: {
//     subscriberId: userId,
//   },
// });
