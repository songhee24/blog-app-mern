import PostScheme from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostScheme.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Не удалось получить статьи" });
  }
};
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
          console.log(err);
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
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostScheme.findOneAndDelete({ _id: postId });
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Не удалось удалить статью" });
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

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostScheme.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
      }
    );
    res.json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Не удалось обновить статью" });
  }
};
