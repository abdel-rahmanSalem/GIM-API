import sql from "mssql";
import { getPool } from "../configs/dbConfig.mjs";

const getGymsData = async (req, res) => {
  const { id, role } = req.user;
  if (role != "owner") return res.sendStatus(403);

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(id, 10))
      .query("SELECT * FROM Gyms WHERE ownerId = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "No gyms are found" });
    }

    res.status(200).json({ gyms: result.recordset });
  } catch (error) {
    console.error("Error fetching gyms data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving gyms data" });
  }
};

const addGym = async (req, res) => {
  const { id: ownerId, role } = req.user;
  if (role != "owner") return res.sendStatus(403);

  const { gymName } = req.body;
  if (!gymName) return res.status(400).json({ error: "gymName is required" });

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("name", sql.VarChar(250), gymName)
      .input("ownerId", sql.Int, parseInt(ownerId, 10))
      .query(
        "INSERT INTO Gyms (gymName, ownerId) OUTPUT Inserted.ownerId VALUES (@name, @ownerid)"
      );

    const gymId = result.recordset[0].gymId;

    res.status(201).json({
      message: "Gym added successfully",
      gymId: gymId,
    });
  } catch (error) {
    console.error("Error creating new gym:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating a new gym" });
  }
};

const deleteGym = async (req, res) => {
  const { id, role } = req.user;
  if (role != "owner") return res.sendStatus(403);

  const { gymId } = req.query;
  if (!gymId || isNaN(gymId)) {
    return res.status(400).json({
      error: "Gym ID query parameter (gymId) is required and must be a number.",
    });
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(gymId, 10))
      .query("DELETE FROM Gyms WHERE gymId = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Gym not found" });
    }

    res.status(200).json({ message: "Gym Deleted!" });
  } catch (error) {
    console.error("Error deleting Gym data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting Gym data" });
  }
};

export { getGymsData, addGym, deleteGym };
