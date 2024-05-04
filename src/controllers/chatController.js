import sequelize from "../../db.js";
import models from "../models/models.js";
const { Chat, ChatParticipant, Message, User } = models;
import { Op } from "sequelize";
import Sequelize from "../../db.js";
import { QueryTypes } from "sequelize";

export const create = async (req, res) => {
  try {
    const authorId = req.body.authorId;
    const partnerId = req.body.partnerId;
    if (req.body.chatType === "private") {
      const anotherChat = await ChatParticipant.findAll({
        where: {
          userId: { [Op.in]: [authorId, partnerId] },
        },
        attributes: ["chatId"],
        group: ["chatId"],
        having: sequelize.where(
          sequelize.fn("count", sequelize.col("chatId")),
          "=",
          2
        ),
      });
      if (anotherChat.length > 0) {
        res.json(anotherChat);
      } else {
        const newChat = await Chat.create({
          chatName: req.body.chatName,
          chatType: req.body?.chatType,
        });
        await ChatParticipant.create({
          userId: authorId,
          chatId: newChat.dataValues.chatId,
          role: "creator",
        });
        await ChatParticipant.create({
          userId: partnerId,
          chatId: newChat.dataValues.chatId,
          role: "participant",
        });
        res.json(newChat);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать чат",
    });
  }
};

export const userChats = async (req, res) => {
  // потом не забыть проверить совпадает ли userId из токена и в req.params
  const userId = req.params.userId;
  try {
    const chatParticipants = await ChatParticipant.findAll({
      where: { userId: userId },
      attributes: ["chatId", "role"], // Получить только chatId
    });
    const chatIds = chatParticipants.map((participant) => participant.chatId);
    const userChats = await Chat.findAll({
      where: { chatId: chatIds }, // Найти чаты с указанными идентификаторами
      include: {
        model: ChatParticipant, // Соединить с таблицей участников чата
        attributes: ["userId"], // Получить только userId
      },
    });

    res.json(userChats);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не Получить чаты пользователя",
    });
  }
};

export const findChat = async (req, res) => {
  try {
    const userOne = req.params.firstId;
    const userSecond = req.params.secondId;

    const chatParticipant = await ChatParticipant.findOne({
      where: {
        [Op.or]: [{ userId: userOne }, { userId: userSecond }],
      },
      group: ["chatId"], // Группируем по chatId, чтобы получить только уникальные чаты
      attributes: ["chatId"],
      having: Sequelize.literal('COUNT(DISTINCT "userId") = 2'), // Убеждаемся, что оба пользователи участвуют в чате
    });

    if (!chatParticipant) {
      console.log(error);
      res.status(500).json({
        message: "Не Получить информацию о чате",
      });
    }

    const chatId = chatParticipant.chatId;
    const chat = await Chat.findByPk(chatId);

    res.json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не Получить информацию о чате",
    });
  }
};

// export const getOneChat = async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const chatId = req.body.chatId;
//     const currentChat = await ChatParticipant.findOne({
//       where: { chatId: chatId, userId: userId },
//     });
//     if (!currentChat) {
//       return res.status(404).json({
//         message: "Пользователь не состоит в этом чате",
//       });
//     }

//     const participants = await ChatParticipant.findAll({
//       where: { chatId: chatId },
//       include: [
//         {
//           model: User,
//           attributes: ["userId", "firstName", "lastName", "avatar"],
//         },
//       ],
//     });
//     const chatParticipants = participants.map((participant) => {
//       return {
//         userId: participant.User.userId,
//         firstName: participant.User.firstName,
//         lastName: participant.User.lastName,
//         avatar: participant.User.avatar,
//       };
//     });

//     const messages = await Message.findAll({
//       where: { chatId: chatId },
//       attributes: ["messageId", "userId", "contentMessage", "createdAt"],
//       order: [["createdAt", "DESC"]],
//     });
//     res.json({ Participants: chatParticipants, messages: messages });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не удалось получить чат ",
//     });
//   }
// };

// export const getAllChats = async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     // const allChat = await ChatParticipant.findAll({
//     //   where: { userId: userId },
//     //   attributes: ["role", "lastSeen", "chatId"],
//     //   include: [
//     //     {
//     //       model: Chat,
//     //       attributes: ["chatName"],
//     //       // include: [
//     //       //   {
//     //       //     model: Message,
//     //       //     attributes: ["messageId", "contentMessage", "createdAt"],
//     //       //     limit: 1,
//     //       //     order: [["createdAt", "DESC"]],
//     //       //   },
//     //       // ],
//     //     },
//     //   ],
//     // });

//     const query = `
//     SELECT
//         cp."userId",
//         cp.role,
//         cp."chatId",
//         c."chatName",
//         m."messageId" AS lastMessageId,
//         m."contentMessage" AS lastMessageContent,
//         m."createdAt" AS lastMessageCreatedAt,
//         u."firstName",
//         u."lastName",
//         u.avatar
//     FROM
//         "ChatParticipants" AS cp
//     LEFT JOIN
//         "Chats" AS c ON cp."chatId" = c."chatId"
//     LEFT JOIN
//         "Users" AS u ON cp."userId" = u."userId"
//     LEFT JOIN LATERAL (
//         SELECT
//             "messageId",
//             "contentMessage",
//             "createdAt"
//         FROM
//             "Messages"
//         WHERE
//             "chatId" = cp."chatId"
//         ORDER BY
//             "createdAt" DESC
//         LIMIT
//             1
//     ) AS m ON TRUE
//     WHERE
//         cp."userId" = :userId;
// `;
//     const allChat = await sequelize.query(query, {
//       replacements: { userId },
//       type: QueryTypes.SELECT,
//     });

//     res.json(allChat);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не удалось получить все чаты",
//     });
//   }
// };
