export default (req, res, next) => {
  // const { token } = req.cookies?.token || {};
  console.log("token:", req.headers.cookie);
  // if (token) {
  //   const _token = token.replace(/Bearer\s?/, "");
  //   console.log("_token:", _token);
  // }

  next();
};
