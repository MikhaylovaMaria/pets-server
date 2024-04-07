import models from "../models/models.js";
const { Announcement } = models;

export const create = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      announcementTypeId: req.body?.announcementTypeId,
      description: req.body.description,
      announcementLocation: req.body.announcementLocation,
      photos: req.body?.photos,
      announcementStatusId: req.body?.announcementStatusId,
      userId: req.userId,
    });
    res.json(announcement);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать объявление",
    });
  }
};

export const getAllByCity = async (req, res) => {
  try {
    // Добавить проверку по полигонам!!!
    const announcements = await Announcement.findAll();
    res.json(announcements);
  } catch (error) {
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
