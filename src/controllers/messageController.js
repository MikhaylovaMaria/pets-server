import models from "../models/models.js";
const { Message } = models;

export const create = async (req, res) => {
  try {
    console.log(req.body);
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
