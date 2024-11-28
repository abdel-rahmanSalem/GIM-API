import sql from "mssql";
import { getPool } from "../../configs/dbConfig.mjs";
const getGyms = async (req, res) => {
  const { userId: ownerId, role } = req.user;
  if (role != "owner") return res.sendStatus(403);

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("ownerId", sql.Int, parseInt(ownerId, 10))
      .query(
        ` SELECT Gyms.gymId, Gyms.gymName, Gyms.expenses FROM Gyms
          INNER JOIN OwnGym
          ON Gyms.gymId = OwnGym.gymId
          WHERE ownerId = @ownerId `
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "No gyms are found" });
    }

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching gyms data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving gyms data" });
  }
};

export default getGyms;
