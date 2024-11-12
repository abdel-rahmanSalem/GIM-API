import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const pool = new sql.ConnectionPool(config, (err) => {
  console.log(`Error With DB Connection Pool: ${err}`);
});

const poolConnect = pool
  .connect()
  .then(() => {
    console.log("Connected to SQL Server");
  })
  .catch((err) => {
    console.error("Database Connection Failed! Bad Config: ", err);
    process.exit(1);
  });

export async function getPool() {
  await poolConnect;
  return pool;
}

process.on("SIGINT", async () => {
  try {
    await pool.close();
    console.log("Database connection pool closed");
    process.exit(0);
  } catch (error) {
    console.error("Error closing database connection:", error);
    process.exit(1);
  }
});
