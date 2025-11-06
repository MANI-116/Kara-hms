import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';
import Ajv, { JSONSchemaType } from 'ajv';
import * as patientSchema from "../shared/patient.schema.json"
import { appendPatientToSheet } from "./googleConfig";


const isDev = process.env.NODE_ENV === 'development' || process.env.VITE_DEV_SERVER === 'true';

console.log(" working on dev mode",isDev)
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173/');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build-render/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  initDatabase();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/* ---------- SQLite DB init ---------- */

let db: Database.Database | null = null;

function getDatabasePath() {
  const userData = app.getPath('userData');
  if (!fs.existsSync(userData)) fs.mkdirSync(userData, { recursive: true });
  return path.join(userData, 'medicare.db');
}

function initDatabase() {
  if (db) return;
  const dbPath = getDatabasePath();
  db = new Database(dbPath);

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

  console.log('[main] SQLite initialized at', dbPath);
}

/* ---------- JSON Schema + Ajv ---------- */

interface PatientInput {
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  address?: string;
  registrationDate?: string; // YYYY-MM-DD
  bloodGroup?: string;
}


const ajv = new Ajv({ allErrors: true });
const validatePatient = ajv.compile(patientSchema);

/* ---------- Helper functions ---------- */

function generatePatientId(): string {
  const dt = new Date();
  const datePart = dt.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `P${datePart}${rand}`;
}

function getCurrentDayString(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ---------- IPC handlers ---------- */

ipcMain.handle('patient:register', (_, payload: any) => {
  try {
    if (!validatePatient(payload)) {
      console.warn('[main] Validation errors:', validatePatient.errors);
      return { ok: false, error: 'validation', details: validatePatient.errors };
    }

    const patient = payload as unknown as PatientInput;

    initDatabase();
    if (!db) throw new Error('Database not initialized');

    const id = generatePatientId();
    const registrationDate =
      patient.registrationDate && /^\d{4}-\d{2}-\d{2}$/.test(patient.registrationDate)
        ? patient.registrationDate
        : getCurrentDayString();

    const insert = db.prepare(`
      INSERT INTO patients (
        id, fullName, age, gender, contact, address, registrationDate, bloodGroup
      ) VALUES (
        @id, @fullName, @age, @gender, @contact, @address, @registrationDate, @bloodGroup
      )
    `);

    insert.run({
      id,
      fullName: patient.fullName,
      age: patient.age,
      gender: patient.gender,
      contact: patient.contact,
      address: patient.address || null,
      registrationDate,
      bloodGroup: patient.bloodGroup || null
    });
    // ✅ Sync to Google Sheets (non-blocking)
appendPatientToSheet({
  id,
  fullName: patient.fullName,
  age: patient.age,
  gender: patient.gender,
  contact: patient.contact,
  address: patient.address || "",
  registrationDate,
  bloodGroup: patient.bloodGroup || ""
}).catch(err => console.error("[google-sync] Error:", err));


    const saved = {
      id,
      ...patient,
      registrationDate
    };

    console.log('[main] patient saved', saved);
    return { ok: true, patient: saved };
  } catch (err: any) {
    console.error('[main] patient registration error', err);
    return { ok: false, error: 'internal', message: err.message || String(err) };
  }
});

ipcMain.handle('patient:getAll', () => {
  try {
    initDatabase();
    if (!db) throw new Error('Database not initialized');

    const rows = db
      .prepare(`SELECT * FROM patients ORDER BY registrationDate DESC, id DESC`)
      .all();

    return { ok: true, patients: rows };
  } catch (err: any) {
    console.error('[main] fetch patients error', err);
    return { ok: false, error: 'internal', message: err.message || String(err) };
  }
});

ipcMain.handle('patient:search', (_, searchTerm: string) => {
  try {
    initDatabase();
    if (!db) throw new Error('Database not initialized');

    const q = `%${String(searchTerm).trim().toLowerCase()}%`;
    const rows = db
      .prepare(
        `SELECT * FROM patients WHERE LOWER(fullName) LIKE @q OR LOWER(id) LIKE @q ORDER BY registrationDate DESC LIMIT 200`
      )
      .all({ q });

    return { ok: true, patients: rows };
  } catch (err: any) {
    console.error('[main] search patients error', err);
    return { ok: false, error: 'internal', message: err.message || String(err) };
  }
});
