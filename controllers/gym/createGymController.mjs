import sql from "mssql";
import { getPool } from "../../configs/dbConfig.mjs";
import { addOwnership } from "../../utils/gymUtils.mjs";

const createGym = async (req, res) => {
  const { userId: creatorId, role } = req.user;
  if (role != "owner") return res.sendStatus(403);

  const { gymName } = req.body;
  if (!gymName) return res.status(400).json({ error: "gymName is required" });

  try {
    const pool = await getPool();
    const createGymResult = await pool
      .request()
      .input("name", sql.VarChar(100), gymName)
      .input("expenses", sql.Int, 0)
      .input("creatorId", sql.Int, parseInt(creatorId, 10))
      .query(
        "INSERT INTO Gyms (gymName, expenses, creatorId) OUTPUT inserted.gymId VALUES (@name, @expenses, @creatorId)"
      );

    const gymId = await createGymResult.recordset[0].gymId;

    console.log("before");

    const addOwnershipRes = await addOwnership(pool, gymId, creatorId);

    console.log("after");

    res.status(201).json({
      message: "Gym created successfully!",
    });
  } catch (error) {
    console.error("Error creating new gym:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating a new gym." });
  }
};

export default createGym;
