import sql from "mssql";
import { getPool } from "../../configs/dbConfig.mjs";
import bcrypt from "bcryptjs";

const handleSignup = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password)
    return res
      .status(400)
      .json({ error: "name, username, email and password are required." });

  try {
    const pool = await getPool();

    //check if the username or email is arleady taken
    const duplicationCheckResult = await pool
      .request()
      .input("username", sql.VarChar(50), username)
      .input("email", sql.VarChar(100), email).query(`
                SELECT 
                    CASE 
                        WHEN EXISTS (SELECT 1 FROM Accounts WHERE username = @username) THEN 'username is already taken'
                        WHEN EXISTS (SELECT 1 FROM Accounts WHERE email = @email) THEN 'email is already taken'
                        ELSE 'available'
                    END AS checkMessage;
            `);

    const { checkMessage } = duplicationCheckResult.recordset[0];
    if (checkMessage !== "available")
      return res.status(400).json({ error: checkMessage });

    //create owner tuble and return ownerId
    const createOwnerResult = await pool
      .request()
      .input("ownerName", sql.VarChar(100), name)
      .query(
        "INSERT INTO Owners (ownerName) OUTPUT Inserted.ownerId VALUES (@ownerName)"
      );

    const { ownerId } = createOwnerResult.recordset[0];

    //hash the password
    const hashedpwd = await bcrypt.hash(password, 10);

    //create owner account by ownerId and other credintals
    const createAccountResult = await pool
      .request()
      .input("username", sql.VarChar(50), username)
      .input("email", sql.VarChar(100), email)
      .input("hashedPwd", sql.VarChar(256), hashedpwd)
      .input("role", sql.VarChar(20), "owner")
      .input("ownerId", sql.Int, ownerId)
      .query(
        "INSERT INTO Accounts (username, email, pwd, role, ownerId) VALUES (@username, @email, @hashedPwd, @role, @ownerId)"
      );

    res.status(201).json({
      success: "Account created successfully",
    });
  } catch (error) {
    console.error("Error signing up:", error.message);
    res.status(500).json({ error: "An error occurred while signing up" });
  }
};

export default handleSignup;
