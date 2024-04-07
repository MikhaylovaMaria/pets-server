import models from "../models/models.js";
const { City } = models;
import sequelize from "../../db.js";
import { CityAll } from "./values/Сity.js";

export const initializeCity = async () => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    // Получение всех существующих статусов
    const existingStatuses = await City.findAll({ transaction });
    // Имена существующих статусов
    const existingStatusNames = existingStatuses.map(
      (city) => city.cityName
    );

    // Статусы, которых нет в бд
    const statusesToAdd = CityAll.filter(
      (city) => !existingStatusNames.includes(city.cityName)
    );

    // Добавляем новые статусы в транзакции
    for (const status of statusesToAdd) {
      await City.create(status, { transaction });
    }
    await transaction.commit();
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Ошибка при инициализации статусов:", error);
  }
};
