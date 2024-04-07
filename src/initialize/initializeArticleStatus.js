import models from "../models/models.js";
import { ArticlesStatusesAll } from "./values/ArticleStatus.js";
const { ArticleStatus } = models;
import sequelize from "../../db.js";

export const initializeStatusesArticle = async () => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    // Получение всех существующих статусов
    const existingStatuses = await ArticleStatus.findAll({ transaction });
    // Имена существующих статусов
    const existingStatusNames = existingStatuses.map(
      (status) => status.articleStatusName
    );

    // Статусы, которых нет в бд
    const statusesToAdd = ArticlesStatusesAll.filter(
      (status) => !existingStatusNames.includes(status.articleStatusName)
    );

    // Добавляем новые статусы в транзакции
    for (const status of statusesToAdd) {
      await ArticleStatus.create(status, { transaction });
    }
    await transaction.commit();
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Ошибка при инициализации статусов:", error);
  }
};
