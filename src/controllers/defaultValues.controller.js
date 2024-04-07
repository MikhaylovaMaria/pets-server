import models from "../models/models.js";
const { City } = models;

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
