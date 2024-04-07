import { body } from "express-validator";

export const registerValid = [body("email", "Неверный формат почты").isEmail()];

export const loginValid = [body("email", "Неверный формат почты").isEmail()];

export const articleValid = [
//   body("description", "Неверный формат cодержания объявления").isString(),
];
export const announcementValid = [
    //   body("description", "Неверный формат cодержания объявления").isString(),
    ];
    

// const Article = sequelize.define("Article", {
//     articleId: { type: DataTypes.UUID, primaryKey: true, defaultValue: UUIDV4 },
//     description: { type: DataTypes.STRING(8000), allowNull: false },
//     articleStatusId: { type: DataTypes.UUID },
//     photos: { type: DataTypes.ARRAY(DataTypes.STRING) },
//   });
