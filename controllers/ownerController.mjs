import sql from "mssql";
import { getPool } from "../../configs/dbConfig.mjs";

const getOwnerData = async (req, res) => {
  const { userName: ownerName, userId: ownerId, role } = req.user;
  if (role != "owner") return res.sendStatus(403);

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(ownerId, 10))
      .query("SELECT email FROM Accounts WHERE ownerId = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Owner not found" });
    }

    res.status(200).json({
      name: ownerName,
      email: result.recordset[0].email,
    });
  } catch (error) {
    console.error("Error fetching owner data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving owner data" });
  }
};

// fix it later >> delete account based on role then based on useId >> new auth controller
const deleteOwner = async (req, res) => {
  const { userName: ownerName, userId: ownerId, role } = req.user;
  if (role != "owner") return res.sendStatus(403);

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(id, 10))
      .query("DELETE FROM Owners WHERE ownerId = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Owner not found" });
    }

    res.status(200).json({ message: "Owner Deleted!" });
  } catch (error) {
    console.error("Error deleting owner data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting owner data" });
  }
};

export { getOwnerData, deleteOwner };
