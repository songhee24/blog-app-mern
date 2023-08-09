import PostScheme from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostScheme.find();
    res.json(posts);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostScheme({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    return res.json(post);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Не удалось создать статью" });
  }
};
