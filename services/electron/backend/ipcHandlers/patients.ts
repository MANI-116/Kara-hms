import { ipcMain } from "electron";
import { db, initDatabase } from "../db/db";
import { appendPatientToSheet } from "../../googleConfig";
import Ajv from "ajv";
import * as patientSchema from "../../../../shared/jamalOP.schema.json";
import { generatePatientId, getCurrentDayString } from "../utils/id";

interface PatientInput {
  fullName: string;
  age: number;
  gender: string;
  contact: string;
  address?: string;
  registrationDate?: string;
  bloodGroup?: string;
}

const ajv = new Ajv({ allErrors: true });
const validatePatient = ajv.compile(patientSchema);

ipcMain.handle("patient:register", async (_, payload) => {
  try {
    if (!validatePatient(payload)) {
      console.warn("[validation] failed:", validatePatient.errors);
      return { ok: false, error: "validation" };
    }
    const patient = payload as unknown as PatientInput;
    initDatabase();
    if (!db) throw new Error("DB not initialized");

    const id = generatePatientId();
    const dailyNumber = parseInt(id.slice(-4), 10);
    const registrationDate =
      patient.registrationDate || getCurrentDayString();

    db.prepare(`
      INSERT INTO patients (id, fullName, age, gender, contact, address, registrationDate, bloodGroup, dailyNumber)
      VALUES (@id, @fullName, @age, @gender, @contact, @address, @registrationDate, @bloodGroup, @dailyNumber)
    `).run({
      id,
      ...patient,
      registrationDate,
      dailyNumber
    });

    const saved = { id, ...patient, registrationDate, dailyNumber };
    appendPatientToSheet(saved).catch((err) => console.error("[google-sync]", err));
    return { ok: true, patient: saved };
  } catch (err: any) {
    console.error("[patient:register]", err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("patient:getAll", () => {
  initDatabase();
  const rows = db?.prepare(`SELECT * FROM patients ORDER BY registrationDate DESC`).all() || [];
  return { ok: true, patients: rows };
});

ipcMain.handle("patient:search", (_, term: string) => {
  initDatabase();
  const q = `%${term.toLowerCase()}%`;
  const rows =
    db?.prepare(
      `SELECT * FROM patients WHERE LOWER(fullName) LIKE @q OR LOWER(id) LIKE @q ORDER BY registrationDate DESC`
    ).all({ q }) || [];
  return { ok: true, patients: rows };
});
