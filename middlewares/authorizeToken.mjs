import { verifyAccessToken } from "../utils/authUtils.mjs";

const authorizeUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  try {
    const user = await verifyAccessToken(token);
    console.log(user);

    req.user = user;
    next();
  } catch (error) {
    console.error(error);

    res.sendStatus(403);
  }
};

export default authorizeUser;
