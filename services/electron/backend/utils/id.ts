import { db } from "../db/db";

export function getCurrentDayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function generatePatientId(): string {
  if (!db) throw new Error("Database not initialized");
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `P${today}`;
  const row = db
    ?.prepare(`SELECT id FROM patients WHERE id LIKE ? ORDER BY id DESC LIMIT 1`)
    .get(`${prefix}%`) as { id: string } | undefined;
  let nextNumber = 1;
  if (row?.id) {
    const lastSeq = parseInt(row.id.slice(-4), 10);
    if (!isNaN(lastSeq)) nextNumber = lastSeq + 1;
  }
  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
}
