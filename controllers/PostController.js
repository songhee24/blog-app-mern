import PostScheme from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostScheme.find().populate("user").exec();
    res.json(posts);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostScheme.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }

        res.json(doc);
      })
      .catch((err) => {
        if (err) {
          console.log(e);
          return res
            .status(500)
            .json({ message: "Не удалось получить статью" });
        }
      });
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
