import express from "express";
import mongoose from "mongoose";

import { registerValidation } from "./validations/auth.js";
import { validationResult } from "express-validator";
import UserScheme from "./models/User.js";
import bcrypt from "bcrypt";

mongoose
  .connect(
    "mongodb+srv://azamat:123@cluster0.fxlagp4.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("mongodb successfully connected");
  })
  .catch(() => {
    console.log("mongodb got an error");
  });

const app = express();
app.use(express.json());

app.post("/auth/register", registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const doc = new UserScheme({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    passwordHash: passwordHash,
  });

  const user = await doc.save();

  return res.json(user);
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server Running");
});
