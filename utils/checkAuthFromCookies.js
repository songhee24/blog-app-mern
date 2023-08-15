import jsonwebtoken from "jsonwebtoken";

export default (req, res, next) => {
  const { jwt } = req.cookies || {};
  if (jwt) {
    try {
      console.log("token:", jwt);
      const decoded = jsonwebtoken.verify(jwt, "secret123");
      console.log("decoded:", decoded);
      req.userId = decoded._id;
      next();
    } catch (e) {
      return res.status(403).json({
        message: "Нет доступа",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа",
    });
  }

  next();
};
