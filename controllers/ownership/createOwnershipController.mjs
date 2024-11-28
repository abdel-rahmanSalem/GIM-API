import sql from "mssql";
import { getPool } from "../configs/dbConfig.mjs";
import { addOwnership } from "../utils/gymUtils.mjs";

const createOwnership = async (req, res) => {
  const { userId: creatorId, role } = req.user;
  if (role != "owner") return res.sendStatus(403);

  const { gymId } = req.params;
  if (!gymId || isNaN(gymId)) {
    return res.status(400).json({
      error: "Gym ID Route parameter (gymId) is required and must be a number.",
    });
  }

  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "username is required" });

  try {
    const pool = getPool();

    const checkCreatorRes = await pool
      .request()
      .input("gymId", sql.Int, parseInt(gymId, 10))
      .query(`SELECT creatorId FROM Gyms WHERE gymId = @gymId`);

    if (checkCreatorRes.rowsAffected[0] === 0)
      return res.status(404).json({ error: "Gym not found." });

    if (checkCreatorRes.recordset[0].creatorId != creatorId)
      return res.sendStatus(403);

    const getOwnerIdByUsernameRes = await pool
      .request()
      .input("usename", sql.NVarChar(50), username)
      .query(`SELECT ownerId FROM ACCOUNTS WHERE username = @username`);

    if (getOwnerIdByUsernameRes.rowsAffected[0] === 0)
      return res.sendStatus(404);

    if (getOwnerIdByUsernameRes.recordset[0].ownerId === null)
      return res
        .status(403)
        .json({ error: "User must have an owner account." });

    const addOwnershipRes = await addOwnership(
      pool,
      gymId,
      getOwnerIdByUsernameRes.recordset[0].ownerId
    );

    res.status(201).json({
      message: "Ownership added successfully!",
    });
  } catch (error) {
    console.error("Error adding new owner:", error);
    res.status(500).json({ error: "An error occurred while adding new owner" });
  }
};

export default createOwnership;
