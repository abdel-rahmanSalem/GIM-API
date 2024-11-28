import sql from "mssql";
import { getPool } from "../../configs/dbConfig.mjs";
const getOwnership = async (req, res) => {
  const { role } = req.user;
  if (role != "owner") return res.sendStatus(403);

  const { gymId } = req.params;
  if (!gymId || isNaN(gymId)) {
    return res.status(400).json({
      error: "Gym ID Route parameter (gymId) is required and must be a number.",
    });
  }

  try {
    const pool = await getPool();
    const getGymOwnershipRes = await pool
      .request()
      .input("gymId", sql.Int, parseInt(gymId, 10))
      .query(`SELECT FROM OwnGym WHERE gymId = @gymId`);

    if (getGymOwnershipRes.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "No Ownership found." });
    }

    res.status(200).json(getGymOwnershipRes.recordset);
  } catch (error) {
    console.error("Error fetching Gym Ownership data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching Gym Ownership data" });
  }
};

export default getOwnership;
