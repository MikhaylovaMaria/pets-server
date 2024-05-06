import sequelize from "../../db.js";
import { DataTypes, UUIDV4, Deferrable } from "sequelize";

const User = sequelize.define("User", {
  userId: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4 },
  firstName: { type: DataTypes.STRING(50), allowNull: false },
  lastName: { type: DataTypes.STRING(100), allowNull: false },
  birthDate: { type: DataTypes.DATE, allowNull: false },
  sex: {
    type: DataTypes.ENUM,
    values: ["male", "female"],
    defaultValue: "female",
  },
  avatar: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  typeUser: {
    type: DataTypes.ENUM,
    values: ["admin", "regular"],
    defaultValue: "regular",
  },
  cityId: { type: DataTypes.INTEGER, allowNull: true },
});

const City = sequelize.define("City", {
  cityId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cityName: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  cityCenter: { type: DataTypes.ARRAY(DataTypes.FLOAT) },
});

const Article = sequelize.define("Article", {
  articleId: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4 },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.STRING(8000), allowNull: false },
  articleStatusId: { type: DataTypes.INTEGER },
  photos: { type: DataTypes.ARRAY(DataTypes.STRING) },
});

const ArticleStatus = sequelize.define("ArticleStatus", {
  articleStatusId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  articleStatusName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
});

const Announcement = sequelize.define("Announcement", {
  announcementId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  announcementTypeId: { type: DataTypes.INTEGER },
  announcementTitle: { type: DataTypes.STRING(2000), allowNull: false },
  description: { type: DataTypes.STRING(2000) },
  announcementLocation: { type: DataTypes.GEOMETRY("POINT") },
  photos: { type: DataTypes.ARRAY(DataTypes.STRING) },
  announcementStatusId: { type: DataTypes.INTEGER },
});

const AnnouncementType = sequelize.define("AnnouncementType", {
  announcementTypeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  announcementTypeName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
});

const AnnouncementStatus = sequelize.define("AnnouncementStatus", {
  announcementStatusId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  announcementStatusName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
});

// const Subscription = sequelize.define("Subscription", {
//   subscriptionId: {
//     type: DataTypes.UUID,
//     primaryKey: true,
//     defaultValue: UUIDV4,
//   },
//   subscriberId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: {
//       model: "User",
//       key: "userId",
//     },
//   },
//   subscribedToId: {
//     type: DataTypes.UUID,
//     allowNull: false,
//     references: {
//       model: "User",
//       key: "userId",
//     },
//   },
// });

const RelationShip = sequelize.define("RelationShip", {
  RelationShipId: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  destinationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  typeShip: {
    type: DataTypes.ENUM,
    values: ["subscription", "friend", "blocked"],
    defaultValue: "subscription",
  },
});

// // const MessageStatus = sequelize.define("RMessageStatus", {
// //   messageStatusId: { type: DataTypes.UUID, primaryKey: true },
// //   messageStatusName: {
// //     type: DataTypes.STRING(50),
// //     allowNull: false,
// //     unique: true,
// //   },
// // });

const Chat = sequelize.define("Chat", {
  chatId: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4 },
  chatName: { type: DataTypes.STRING(50) },
  chatType: {
    type: DataTypes.ENUM,
    values: ["group", "private"],
    defaultValue: "private",
  },
});

const ChatParticipant = sequelize.define("ChatParticipant", {
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "userId",
    },
  },
  chatId: {
    type: DataTypes.UUID,
    references: {
      model: Chat,
      key: "chatId",
    },
  },

  role: {
    type: DataTypes.ENUM,
    values: ["creator", "participant"],
    defaultValue: "participant",
  },
  lastSeen: { type: DataTypes.DATE },
});

const Message = sequelize.define("Message", {
  messageId: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4 },
  contentMessage: { type: DataTypes.STRING(4000) },
  messageStatusId: { type: DataTypes.UUID },
});

// Пользователь - город (один город принадлежит многим пользователям)
City.hasMany(User, { foreignKey: "cityId" });
User.belongsTo(City, { foreignKey: "cityId" });

// Статус статьи- статья (один статус принадлежит многим статьям)
ArticleStatus.hasMany(Article, { foreignKey: "articleStatusId" });
Article.belongsTo(ArticleStatus);

// Пользователь - статьи (один пользователь может иметь много статей)
User.hasMany(Article, { foreignKey: "userId" });
Article.belongsTo(User, { foreignKey: "userId" });

// //Статус объявления - объявление (один статус принадлежит многим объявлениям)
AnnouncementStatus.hasMany(Announcement, {
  foreignKey: "announcementStatusId",
});
Announcement.belongsTo(AnnouncementStatus);

// // //Тип объявления - объявление (один тип принадлежит многим объявлениям)
AnnouncementType.hasMany(Announcement, {
  foreignKey: "announcementTypeId",
});
Announcement.belongsTo(AnnouncementType);

//Пользователь - объявление (один пользователь может иметь много объявлений)
User.hasMany(Announcement, { foreignKey: "userId" });
Announcement.belongsTo(User, { foreignKey: "userId" });

// // Пользователь - подписка:
// User.belongsToMany(User, {
//   through: Subscription,
//   as: "subscribers", // пользователи, которые подписаны на этого пользователя
//   foreignKey: "subscribedToId",
// });

// User.belongsToMany(User, {
//   through: Subscription,
//   as: "subscriptions", // пользователи, на которых подписан этот пользователь
//   foreignKey: "subscriberId",
// });

User.hasMany(RelationShip, { foreignKey: "authorId", as: "subscriptions" });
User.hasMany(RelationShip, { foreignKey: "destinationId", as: "subscribers" });

RelationShip.belongsTo(User, {
  foreignKey: "authorId",
  as: "subscriptions",
});
RelationShip.belongsTo(User, {
  foreignKey: "destinationId",
  as: "subscribers",
});

// // //Сообщение - статус сообщения (один статус принадлежит многим сообщениям)
// // MessageStatus.hasMany(Message, {
// //   foreignKey: "messageStatusId",
// // });
// // Message.belongsTo(MessageStatus);

// // //Сообщение - чат (чат может содержать много сообщений, но сообщение всегда принадлежит одному чату)
Chat.hasMany(Message, {
  foreignKey: "chatId",
});
Message.belongsTo(Chat, { foreignKey: "chatId" });

// // Cвязь чата и пользователя (один пользователь может состоять во многих чатах)
User.belongsToMany(Chat, { through: ChatParticipant, foreignKey: "userId" });
Chat.belongsToMany(User, { through: ChatParticipant, foreignKey: "chatId" });

User.hasMany(ChatParticipant, { foreignKey: "userId" });
ChatParticipant.belongsTo(User, { foreignKey: "userId" });

Chat.hasMany(ChatParticipant, { foreignKey: "chatId" });
ChatParticipant.belongsTo(Chat, { foreignKey: "chatId" });

// // //Пользователь - сообщение:

User.hasMany(Message, { foreignKey: "userId" });
Message.belongsTo(User, { foreignKey: "userId" });

export default {
  User,
  City,
  Article,
  ArticleStatus,
  AnnouncementType,
  AnnouncementStatus,
  Announcement,
  Message,
  ChatParticipant,
  Chat,
  RelationShip,
};
