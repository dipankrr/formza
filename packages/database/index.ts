import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import { env } from "./env";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres.ikewnmvsfsulkragmslk:Crashtuber43@gmail.com@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.query("select 1")
  .then(res => console.log("POOL OK:", res.rows))
  .catch(err => console.error("POOL ERROR:", err));

export const db = drizzle(pool);

export * from "drizzle-orm";
export default db;
