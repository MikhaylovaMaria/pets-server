import sequelize from "../../db.js";
import models from "../models/models.js";
const { AnnouncementType } = models;
import { AnnouncementTypes } from "./values/AnnoumenTypes.js";

export const initializeAnnouncementType = async () => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    // Получение всех существующих статусов
    const existingStatuses = await AnnouncementType.findAll({ transaction });
    // Имена существующих статусов
    const existingStatusNames = existingStatuses.map(
      (status) => status.announcementTypeName
    );

    // Статусы, которых нет в бд
    const statusesToAdd = AnnouncementTypes.filter(
      (status) => !existingStatusNames.includes(status.announcementTypeName)
    );

    // Добавляем новые статусы в транзакции
    for (const status of statusesToAdd) {
      await AnnouncementType.create(status, { transaction });
    }
    await transaction.commit();
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Ошибка при инициализации статусов:", error);
  }
};
