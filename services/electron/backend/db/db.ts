import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { app } from "electron";
import { migrations } from "./migrations"

export let db: Database.Database | null = null;

type MetaRow = { value: string };

function getDatabasePath() {
  const userData = app.getPath("userData");
  if (!fs.existsSync(userData)) fs.mkdirSync(userData, { recursive: true });
  return path.join(userData, "medicare.db");
}

function getSchemaVersion(): number {
  const row = db?.prepare("SELECT value FROM meta WHERE key='schema_version'").get() as MetaRow | undefined;
  return row ? Number(row.value) : 0;
}

function setSchemaVersion(version: number) {
  db?.prepare(`
    INSERT INTO meta (key, value)
    VALUES ('schema_version', ?)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value
  `).run(version.toString());
}


export function initDatabase() {
  if (db) return;
  const dbPath = getDatabasePath();
  console.log("dbpath:",dbPath);
  db = new Database(dbPath);
  db.prepare(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `).run();

  const currentVersion = getSchemaVersion();
  for (const m of migrations) {
    if (m.version > currentVersion) {
      console.log(`[migration] Running v${m.version}...`);
      m.run(db);
      setSchemaVersion(m.version);
    }
  }
  console.log(`[DB] Initialized at ${dbPath} (schema v${getSchemaVersion()})`);
}
