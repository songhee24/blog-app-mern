export default (req, res, next) => {
  const { token } = req.cookies?.token || {};
  if (token) {
    const _token = token.replace(/Bearer\s?/, "");
    console.log("_token:", _token);
  }
};
