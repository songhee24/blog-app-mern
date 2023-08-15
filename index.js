import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations.js";

import { UserController, PostController } from "./controllers/index.js";
import {
  checkAuth,
  checkAuthFromCookies,
  handleValidationErrors,
} from "./utils/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { credentials } from "./utils/credentials.js";
import { corsOptions } from "./config/corsOptions.js";

mongoose
  .connect(
    "mongodb+srv://azamat:123@cluster0.fxlagp4.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("mongodb successfully connected");
  })
  .catch(() => {
    console.log("mongodb got an error");
  });

const app = express();
app.use(credentials);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post("/auth/logout", UserController.logout);
app.get("/auth/me", checkAuthFromCookies, UserController.getMe);
// app.get("/auth/me", UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`,
  });
});

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server Running");
});
