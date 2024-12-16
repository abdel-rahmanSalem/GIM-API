import sql from "mssql";
import { getPool } from "../../configs/dbConfig.mjs";

const getGymById = async (req, res) => {
  const { gymId } = req.params;
  if (!gymId || isNaN(gymId)) {
    return res.status(400).json({
      error: "Gym ID Route parameter (gymId) is required and must be a number.",
    });
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("gymId", sql.Int, parseInt(gymId, 10))
      .query("SELECT gymId, gymName, expenses FROM Gyms WHERE gymId = @gymId");

    if (result.rowsAffected[0] === 0)
      return res.status(404).json({ error: "Gym not found." });

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching Gym data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching Gym data" });
  }
};

export default getGymById;
