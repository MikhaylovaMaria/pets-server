import models from "../models/models.js";
import { AnnouncementStatusesAll } from "./values/AnnoumentStatus.js";
const { AnnouncementStatus } = models;
import sequelize from "../../db.js";

export const initializeStatusesAnnouncement = async () => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    // Получение всех существующих статусов
    const existingStatuses = await AnnouncementStatus.findAll({ transaction });
    // Имена существующих статусов
    const existingStatusNames = existingStatuses.map(
      (status) => status.announcementStatusName
    );

    // Статусы, которых нет в бд
    const statusesToAdd = AnnouncementStatusesAll.filter(
      (status) => !existingStatusNames.includes(status.announcementStatusName)
    );

    // Добавляем новые статусы в транзакции
    for (const status of statusesToAdd) {
      await AnnouncementStatus.create(status, { transaction });
    }
    await transaction.commit();
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Ошибка при инициализации статусов:", error);
  }
};
