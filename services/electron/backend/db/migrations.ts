import {db} from "./db"
import Database from "better-sqlite3";

export const migrations = [
  {
    version: 1,
    run: (db: Database.Database) => {
      db.prepare(`
        CREATE TABLE IF NOT EXISTS patients (
          id TEXT PRIMARY KEY,
          fullName TEXT NOT NULL,
          age INTEGER NOT NULL,
          gender TEXT NOT NULL,
          contact TEXT NOT NULL,
          address TEXT,
          registrationDate TEXT NOT NULL,
          bloodGroup TEXT
        )
      `).run();
    }
  },
  {
    version: 2,
    run: (db:any) => {
      const cols = db.prepare("PRAGMA table_info(patients)").all();
      const hasDailyNumber = cols.some((c: any) => c.name === "dailyNumber");
      if (!hasDailyNumber)
        db.prepare("ALTER TABLE patients ADD COLUMN dailyNumber INTEGER DEFAULT 0").run();
    }
  },
  {
    version: 3,
    run: (db:any) => db.prepare("DROP TABLE IF EXISTS daily_counters").run()
  },
  {
    version: 4,
    run: (db:any) => {
      db.prepare(`
        CREATE TABLE IF NOT EXISTS ip_patients (
          ipId TEXT PRIMARY KEY,
          opId TEXT NOT NULL,
          admissionDate TEXT NOT NULL,
          visitDate TEXT,
          visitTime TEXT,
          reasonForVisit TEXT,
          chiefComplaint TEXT,
          currentMedications TEXT,
          validUntil TEXT,
          priority TEXT,
          referredBy TEXT,
          department TEXT,
          vitals TEXT,
          ipNumber TEXT,
          status TEXT DEFAULT 'Active'
        )
      `).run();
    }
  },
  {
    version: 5,
    run: (db:any) => {
      const existingCols = db.prepare("PRAGMA table_info(ip_patients)").all();
      const hasVisitDate = existingCols.some((c: any) => c.name === "visitDate");
      if (!hasVisitDate) {
        db.transaction(() => {
          const oldRows: any = db.prepare("SELECT * FROM ip_patients").all();
          db.prepare("DROP TABLE IF EXISTS ip_patients").run();
          db.prepare(`
            CREATE TABLE ip_patients (
              ipId TEXT PRIMARY KEY,
              opId TEXT NOT NULL,
              ipNumber TEXT,
              admissionDate TEXT NOT NULL,
              visitDate TEXT,
              visitTime TEXT,
              reasonForVisit TEXT,
              chiefComplaint TEXT,
              currentMedications TEXT,
              validUntil TEXT,
              priority TEXT,
              referredBy TEXT,
              department TEXT,
              vitals TEXT,
              status TEXT DEFAULT 'Active'
            )
          `).run();
          for (const row of oldRows)
            db.prepare(`
              INSERT INTO ip_patients (ipId, opId, admissionDate, status)
              VALUES (@ipId, @opId, @admissionDate, @status)
            `).run({
              ipId: row.ipId,
              opId: row.opId,
              admissionDate: row.admissionDate,
              status: row.status || "Active"
            });
        })();
      }
    }
  }
];
