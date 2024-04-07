import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import models from "../models/models.js";
const { User } = models;
import dotenv from "dotenv";
dotenv.config();

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
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден " });
    }
    const { passwordHash, ...userData } = user.dataValues;
    res.json(userData);
  } catch (error) {
    res.status(500).json("Нет доступа");
  }
};

// Получение всех пользователей по городу....
