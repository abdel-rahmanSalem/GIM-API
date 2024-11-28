import sql from "mssql";
import { getPool } from "../../configs/dbConfig.mjs";
import { verifyRefreshToken } from "../../utils/authUtils.mjs";

const handleToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const pool = await getPool();

    const result = await pool
      .request()
      .input("token", sql.VarChar(250), refreshToken)
      .query("SELECT token FROM RefreshTokens WHERE token = @token");

    if (result.recordset.length < 1) return res.sendStatus(403);

    console.log(result.recordset[0].token);

    const accessToken = await verifyRefreshToken(result.recordset[0].token);

    res.json({ accessToken });
  } catch (error) {
    res.sendStatus(403);
  }
};

export default handleToken;
