import sql from "mssql";
import { getPool } from "../configs/dbConfig.mjs";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/authUtils.mjs";

const handleLogin = async (req, res) => {
  const { email, pwd, role } = req.body;

  if (!email || !pwd)
    return res.status(400).json({ error: "email, and password are required." });

  try {
    const pool = await getPool();

    const emailCheckResult = await pool
      .request()
      .input("email", sql.VarChar(250), email)
      .query("SELECT ownerId FROM Owners WHERE email = @email");

    if (emailCheckResult.recordset.length < 1)
      res.status(400).json({ error: "Wrong email." });

    const result = await pool
      .request()
      .input("email", sql.VarChar(50), email)
      .query("SELECT pwd, ownerId FROM Owners WHERE email = @email");

    const authed = await bcrypt.compare(pwd, result.recordset[0].pwd);
    if (!authed) res.status(401).json({ error: "Wrong Password." });

    //NOTE THAT ROLE IS HARD CODED
    const userPayload = { id: result.recordset[0].ownerId, role: "owner" };

    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    const tempResult = await pool
      .request()
      .input("token", sql.VarChar(250), refreshToken)
      .query("INSERT INTO RefreshTokens (token) VALUES (@token)");

    return res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    res.status(500).json({ error: `An error occurred: ${error}` });
  }
};

export default handleLogin;
