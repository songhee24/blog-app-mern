export default (req, res, next) => {
  const { jwt } = req.cookies || {};
  console.log("token:", req.headers.cookie);
  if (jwt) {
    const token = jwt.replace(/Bearer\s?/, "");
    console.log("_token:", token);
  }

  next();
};
