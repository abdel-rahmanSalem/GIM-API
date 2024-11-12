import sql from "mssql";
import { getPool } from "../configs/dbConfig.mjs";
import bcrypt from "bcryptjs";

const handleSignup = async (req, res) => {
  const { name, email, pwd } = req.body;

  if ((!name, !email || !pwd))
    return res
      .status(400)
      .json({ error: "name, email, and password are required." });

  try {
    const pool = await getPool();

    const emailCheckResult = await pool
      .request()
      .input("email", sql.VarChar(250), email)
      .query("SELECT ownerId FROM Owners WHERE email = @email");

    if (emailCheckResult.recordset.length > 0)
      return res.status(409).json({ error: "Email is already taken." });

    const hashedpwd = await bcrypt.hash(pwd, 10);

    const result = await pool
      .request()
      .input("name", sql.VarChar(250), name)
      .input("email", sql.VarChar(250), email)
      .input("hashedPwd", sql.VarChar(250), hashedpwd)
      .query(
        "INSERT INTO Owners (ownerName, email, pwd) OUTPUT Inserted.ownerId VALUES (@name, @email, @hashedPwd)"
      );

    res.status(201).json({
      success: "Owner created successfully",
    });
  } catch (error) {
    console.error("Error creating new owner:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while creating a new owner" });
  }
};

export default handleSignup;
