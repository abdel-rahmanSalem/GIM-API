import sql from "mssql";

export async function addOwnership(pool, gymId, ownerId) {
  const res = await pool
    .request()
    .input("gymId", sql.Int, parseInt(gymId, 10))
    .input("ownerId", sql.Int, parseInt(ownerId, 10))
    .query("INSERT INTO OwnGym (gymId, ownerId) VALUES (@gymId, @ownerId)");

  console.log("ownnnnnnnn");

  return res;
}
