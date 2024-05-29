import { where } from "sequelize";
import models from "../models/models.js";
const { Message } = models;

export const addMessage = async (req, res) => {
  try {
    const message = await Message.create({
      contentMessage: req.body.contentMessage,
      chatId: req.body.chatId,
      userId: req.body.userId,
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({
      message: "Не отправить сообщение",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    console.log("CHATID", chatId);
    const result = await Message.findAll({ where: { chatId: chatId } });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Не получить сообщения из чата",
    });
  }
};
