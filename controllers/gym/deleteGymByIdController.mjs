import sql from "mssql";
import { getPool } from "../../configs/dbConfig.mjs";

const deleteGymById = async (req, res) => {
  const { userId: creatorId, role } = req.user;
  if (role != "owner") return res.sendStatus(403);

  const { gymId } = req.params;
  if (!gymId || isNaN(gymId)) {
    return res.status(400).json({
      error: "Gym ID Route parameter (gymId) is required and must be a number.",
    });
  }

  try {
    const pool = await getPool();
    const deleteGymRes = await pool
      .request()
      .input("gymId", sql.Int, parseInt(gymId, 10))
      .input("creatorId", sql.Int, parseInt(creatorId, 10))
      .query(
        `DELETE FROM Gyms WHERE gymId = @gymId AND creatorId = @creatorId`
      );
    console.log(deleteGymRes);

    if (deleteGymRes.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "Gym not found." });
    }

    res.status(200).json({ message: "Gym Deleted!" });
  } catch (error) {
    console.error("Error deleting Gym data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting Gym data" });
  }
};

export default deleteGymById;
