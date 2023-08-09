import express from "express";
import mongoose from "mongoose";

import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations.js";

import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
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
app.use(express.json());

app.post("/auth/register", registerValidation, UserController.register);
app.post("/auth/login", loginValidation, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);

// app.get('/posts', PostController.getAll)
// app.get('/posts/:id', PostController.getOne)
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
// app.delete('/posts', PostController.remove)
// app.patch('/posts', PostController.update)

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server Running");
});
