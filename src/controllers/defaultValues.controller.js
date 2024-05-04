import models from "../models/models.js";
const { City, AnnouncementType } = models;

export const getAllCities = async (req, res) => {
  try {
    const cities = await City.findAll({
      attributes: ["cityId", "cityName", "cityCenter"],
    });
    res.json(cities);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось получить города",
    });
  }
};

export const getTypes = async (req, res) => {
  try {
    const types = await AnnouncementType.findAll({
      attributes: ["announcementTypeId", "announcementTypeName"],
    });
    res.json(types);
  } catch (error) {
    res.status(500).json({
      message: "Не получить типы",
    });
  }
};
