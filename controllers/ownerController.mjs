import sql from "mssql";
import { getPool } from "../configs/dbConfig.mjs";
import bcrypt from "bcryptjs";

const getOwnerData = async (req, res) => {
  const { id, role } = req.user;
  if (role != "owner") return res.sendStatus(403);

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(id, 10))
      .query("SELECT * FROM Owners WHERE ownerId = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Owner not found" });
    }

    res.status(200).json({ owner: result.recordset[0] });
  } catch (error) {
    console.error("Error fetching owner data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving owner data" });
  }
};

const deleteOwner = async (req, res) => {
  const { id, role } = req.params;
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
