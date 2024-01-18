import { Pool } from 'pg';
import fs from "fs"

const connectionString = process.env["DATABASE_CONNECTION_STRING"];
const models = fs.readFileSync("./models/index.sql").toString();
console.log(models)

if (!connectionString) throw new Error("DATABASE_CONNECTION_STRING NOT FOUND");

const pool = new Pool({ connectionString });

await pool.query('SELECT * FROM User');
await pool.query(models)
await pool.end()
