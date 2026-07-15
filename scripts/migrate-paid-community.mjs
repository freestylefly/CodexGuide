import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { neon } from "@neondatabase/serverless";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const migrationsUrl = new URL("../migrations/", import.meta.url);
const migrationsPath = fileURLToPath(migrationsUrl);
const migrationFiles = (await readdir(migrationsPath))
  .filter((file) => /^\d+.*\.sql$/u.test(file))
  .sort();
const hostname = new URL(databaseUrl).hostname;
const isLocal = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
const localSql = isLocal ? postgres(databaseUrl, { max: 1, prepare: false }) : null;
const neonSql = isLocal ? null : neon(databaseUrl);

try {
  for (const file of migrationFiles) {
    const migration = await readFile(new URL(file, migrationsUrl), "utf8");
    for (const statement of migration.split(/;\s*(?:\n|$)/u).map((value) => value.trim()).filter(Boolean)) {
      if (localSql) await localSql.unsafe(statement);
      else await neonSql.query(statement);
    }
  }
} finally {
  if (localSql) await localSql.end();
}
process.stdout.write(`Paid community database migrations completed: ${migrationFiles.join(", ")}\n`);
