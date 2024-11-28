import sql from "mssql";
import { getPool } from "../../configs/dbConfig.mjs";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/authUtils.mjs";

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lZ2F0cm9uIiwidXNlcklkIjozLCJyb2xlIjoib3duZXIiLCJpYXQiOjE3MzI1MzY4NTh9.umpXOyHuMutFjiM1l6NXxmy8lvbjfiA-wDqnmLUmmBA

const handleLogin = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password)
    return res
      .status(400)
      .json({ error: "identifier and password are required." });

  try {
    const pool = await getPool();

    const identifierResult = await pool
      .request()
      .input("identifier", sql.NVarChar(100), identifier)
      .query(
        `SELECT username, pwd, role, ownerId, empId FROM Accounts
         WHERE username = @identifier OR email = @identifier`
      );

    if (identifierResult.recordset.length < 1)
      return res.status(400).json({ error: "Wrong identifer." });

    const {
      username,
      pwd: hashedPwd,
      role,
      ownerId,
      empId,
    } = identifierResult.recordset[0];

    // const result = await pool
    //   .request()
    //   .input("email", sql.VarChar(50), email)
    //   .query("SELECT pwd, ownerId FROM Owners WHERE email = @email");

    const isPasswordValid = await bcrypt.compare(password, hashedPwd);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Wrong Password." });

    const userId = ownerId ?? empId;

    const userPayload = { username, userId, role };

    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    const tempResult = await pool
      .request()
      .input("token", sql.VarChar(250), refreshToken)
      .query("INSERT INTO RefreshTokens (token) VALUES (@token)");

    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    res.status(500).json({ error: `An error occurred: ${error}` });
  }
};

export default handleLogin;
