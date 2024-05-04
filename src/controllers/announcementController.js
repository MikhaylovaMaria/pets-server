import { QueryTypes } from "sequelize";
import sequelize from "../../db.js";
import models from "../models/models.js";
const { Announcement } = models;

const formatToPointType = (coords) => {
  const point = {
    type: "Point",
    coordinates: [Number(coords[1]), Number(coords[0])],
  };
  return point;
};

export const create = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      announcementTypeId: req.body?.announcementTypeId,
      announcementTitle: req.body.announcementTitle,
      description: req.body.description,
      announcementLocation: formatToPointType(req.body.announcementLocation),
      photos: req.body?.photos,
      announcementStatusId: req.body?.announcementStatusId,
      userId: req.userId,
    });
    res.json({
      ...announcement.dataValues,
      announcementLocation: req.body.announcementLocation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать объявление",
    });
  }
};

export const getAllByCity = async (req, res) => {
  let { userId, southWest, northEast } = req.query;

  let announcements;
  try {
    if (userId) {
      announcements = await Announcement.findAll({ where: { userId: userId } });
    }

    if (southWest && northEast) {
      const cuurentSouthWest = formatToPointType(southWest);
      const currentNorthEast = formatToPointType(northEast);
      console.log("cuurentSouthWest", cuurentSouthWest);
      console.log("currentNorthEast", currentNorthEast);

      const sql = `
      SELECT * FROM "Announcements"
      WHERE ST_Contains(
        ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326),
        "announcementLocation"
      );
    `;
      announcements = await sequelize.query(sql, {
        replacements: {
          minLon: cuurentSouthWest.coordinates[0],
          minLat: cuurentSouthWest.coordinates[1],
          maxLon: currentNorthEast.coordinates[0],
          maxLat: currentNorthEast.coordinates[1],
        },
        type: QueryTypes.SELECT,
      });
    }
    const modifiedAnnouncements = announcements.map((announcement) => {
      const location = announcement.announcementLocation; // Получаем объект location
      const latitude = location.coordinates[1]; // Широта
      const longitude = location.coordinates[0]; // Долгота
      return {
        ...announcement,
        announcementLocation: [latitude, longitude], // Заменяем location на массив [широта, долгота]
      };
    });

    res.json(modifiedAnnouncements);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить объявления",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const announcementId = req.params.id;
    const announcement = await Announcement.findByPk(announcementId);
    res.json(announcement);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось получить объявление",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.userId;
    const announcementId = req.params.id;
    const deletedAnnouncementCount = await Announcement.destroy({
      where: { announcementId: announcementId, userId: userId },
    });
    if (deletedAnnouncementCount === 0) {
      return res.status(404).json({ message: "Не удалось удалить объявление" });
    }
    res.json({ succsess: true });
  } catch (error) {}
};

export const update = async (req, res) => {
  try {
    const userId = req.userId;
    const announcementId = req.params.id;

    const [updatedCount, updatedArticles] = await Announcement.update(
      { description: req.body?.description },
      {
        where: { announcementId: announcementId, userId: userId },
        returning: true,
      }
    );
    if (updatedCount === 0) {
      return res.status(404).json({ message: "Объявление не найдено" });
    }
    res.json({ message: "Объявление успешно обновлено" });
  } catch (error) {
    res.status(500).json({
      message: "Не удалось обновить объявление",
    });
  }
};
