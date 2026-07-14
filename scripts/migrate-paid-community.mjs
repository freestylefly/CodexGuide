import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const migrationUrl = new URL("../migrations/001-paid-community.sql", import.meta.url);
const migration = await readFile(fileURLToPath(migrationUrl), "utf8");
const sql = neon(databaseUrl);

for (const statement of migration.split(/;\s*(?:\n|$)/u).map((value) => value.trim()).filter(Boolean)) {
  await sql.query(statement);
}
process.stdout.write("Paid community database migration completed.\n");
