import { Router } from "express";
import sql from "mssql";
import { getPool } from "../configs/dbConfig.mjs";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/sym/v1/owners/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: "Owner ID parameter (id) is required and must be a number.",
    });
  }

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
});

router.post("/sym/v1/owners", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: "name, email, and password are required" });

  try {
    const hashedPass = await bcrypt.hash(password, 10);

    const pool = await getPool();
    const result = await pool
      .request()
      .input("name", sql.VarChar(250), name)
      .input("email", sql.VarChar(250), email)
      .input("password", sql.VarChar(250), hashedPass)
      .query(
        "INSERT INTO Owners (ownerName, email, pass) OUTPUT Inserted.ownerId VALUES (@name, @email, @password)"
      );

    const ownerId = result.recordset[0].ownerId;

    res.status(201).json({
      message: "Owner added successfully",
      ownerId: ownerId,
    });
  } catch (error) {
    console.error("Error creating new owner:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while creating a new owner" });
  }
});

router.delete("/sym/v1/owners/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: "Owner ID parameter (id) is required and must be a number.",
    });
  }

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
});

export default router;