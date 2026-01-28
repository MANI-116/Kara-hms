import { ipcMain } from "electron";
import { db, initDatabase } from "../db/db";
import { appendIPToSheet } from "../../googleConfig";
import { getCurrentDayString } from "../utils/id";

ipcMain.handle("ip:create", async (_, ipData) => {
  try {
    initDatabase();
    const timestamp = Date.now();
    const ipId = `IP${timestamp}`;
    const ipNumber = `IP${timestamp.toString().slice(-6)}`;
    const admissionDate = ipData.visitDate || getCurrentDayString();
    const vitalsJson = JSON.stringify(ipData.vitalSigns || {});

    db?.prepare(`
      INSERT INTO ip_patients (
        ipId, opId, ipNumber, admissionDate, visitDate, visitTime,
        reasonForVisit, chiefComplaint, currentMedications, validUntil,
        priority, referredBy, department, vitals, status
      )
      VALUES (@ipId, @opId, @ipNumber, @admissionDate, @visitDate, @visitTime,
        @reasonForVisit, @chiefComplaint, @currentMedications, @validUntil,
        @priority, @referredBy, @department, @vitals, 'Active')
    `).run({
      ipId,
      opId: ipData.opId,
      ipNumber,
      admissionDate,
      visitDate: ipData.visitDate,
      visitTime: ipData.visitTime,
      reasonForVisit: ipData.reasonForVisit,
      chiefComplaint: ipData.chiefComplaint,
      currentMedications: ipData.currentMedications,
      validUntil: ipData.validUntil,
      priority: ipData.priority,
      referredBy: ipData.referredBy,
      department: ipData.department,
      vitals: vitalsJson
    });

    const saved = { ipId, ipNumber, ...ipData, admissionDate, status: "Active" };
    appendIPToSheet(saved).catch((err) => console.error("[google-sync-IP]", err));
    return { ok: true, ip: saved };
  } catch (err: any) {
    console.error("[ip:create]", err);
    return { ok: false, error: err.message };
  }
});

ipcMain.handle("ip:getAll", () => {
  initDatabase();
  const rows =
    db?.prepare(`SELECT * FROM ip_patients ORDER BY admissionDate DESC`).all() || [];
  const parsed = rows.map((r: any) => ({
    ...r,
    vitals: r.vitals ? JSON.parse(r.vitals) : {}
  }));
  return { ok: true, ipPatients: parsed };
});
