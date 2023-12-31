import bcrypt from "bcrypt";
import UserScheme from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
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
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );
    // return res.json({ ...user._doc, token });
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 14 Day Age,
        domain: "localhost",
        sameSite: "none",
        secure: true,
      })
      .send({ authenticated: true, message: "Authentication Successful." });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Не удалось зарегистироваться",
    });
  }
};
export const login = async (req, res) => {
  try {
    const user = await UserScheme.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(403).json({
        message: "Невереный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );
    // return res.json({ ...user._doc, token });
    res
      .cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .send({ authenticated: true, message: "Authentication Successful." });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const logout = async (req, res) => {
  res
    .cookie("token", null, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 Day Age,
      domain: "localhost",
      sameSite: "Lax",
    })
    .send({
      authenticated: false,
      message: "Logout Successful.",
    });
};

export const getMe = async (req, res) => {
  try {
    const user = await UserScheme.findById(req.userId);
    console.log("user:", user._doc);
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    return res.json({ ...user._doc });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Отказано в доступе!",
    });
  }
};
