import models from "../models/models.js";
const { Article, User } = models;

export const create = async (req, res) => {
  try {
    const article = await Article.create({
      title: req.body.title,
      description: req.body.description,
      photos: req.body?.photos,
      userId: req.userId,
    });
    res.json(article);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const getAll = async (req, res) => {
  let { userId } = req.query;
  let articles;
  try {
    if (userId) {
      articles = await Article.findAll({
        where: { userId: userId },
      });
    } else {
      articles = await Article.findAll({
        include: [
          {
            model: User,
            attributes: ["userId", "firstName", "lastName"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
    }
    res.json(articles);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findByPk(articleId, {
      include: [
        {
          model: User,
          attributes: ["firstName", "lastName", "userId"],
        },
      ],
    });
    res.json(article);
  } catch (error) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const userId = req.userId;
    const articleId = req.params.id;
    const deletedArticleCount = await Article.destroy({
      where: { articleId: articleId, userId: userId },
    });
    if (deletedArticleCount === 0) {
      return res.status(404).json({ message: "Не удалось удалить статью" });
    }
    res.json({ succsess: true });
  } catch (error) {}
};

export const update = async (req, res) => {
  try {
    const userId = req.userId;
    const articleId = req.params.id;

    const [updatedCount, updatedArticles] = await Article.update(
      { title: req.body?.title, description: req.body?.description },
      { where: { articleId: articleId, userId: userId }, returning: true }
    );
    if (updatedCount === 0) {
      return res.status(404).json({ message: "Статья не найдена" });
    }
    res.json({ message: "Статья успешно обновлена" });
  } catch (error) {
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};
