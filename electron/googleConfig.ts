import { google } from "googleapis";
import path from "path";
import fs from "fs";

const SERVICE_ACCOUNT_PATH = path.join(__dirname, "../keys/google-service-account.json");

// ⚠️ Put your real spreadsheet ID here (from the sheet URL)
const SPREADSHEET_ID = "1IZBDdX_fOkFIyxt6te3cCr-Wmes0Jl0k89SZJy5N2vM";

console.log("service account path-",SERVICE_ACCOUNT_PATH)

export async function appendPatientToSheet(patient: any) {
  try {
    const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));
    console.log("credentials:",credentials);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    console.log("auth",auth);
    const sheets = google.sheets({ version: "v4", auth });

    const values = [
      [
        false,
        patient.id,
        patient.fullName,
        patient.age,
        patient.gender,
        patient.contact,
        patient.address || "",
        patient.registrationDate,
        patient.bloodGroup || "",
        patient.weight||"",
        patient.height||"",
        patient.temperature||"",
        patient.pulse||"",
        patient.bloodPresuureDiastolic||"",
        patient.bloodPressureSystolic,
        patient.respiratoryRate||"",
        patient.oxygenSaturation||""
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Patients!A2", // your sheet name + range start
      valueInputOption: "USER_ENTERED",
      requestBody: { values }
    });

    console.log("[google] Patient synced to Google Sheets:", patient.id);
  } catch (err) {
    console.error("[google] Failed to sync patient:", err);
  }
}
export async function appendIPToSheet(ip: any) {
  try {
    const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
    const sheets = google.sheets({ version: "v4", auth });

    const vitals = ip.vitalSigns || {};

    const values = [[
      ip.ipId || "",
      ip.ipNumber || "",
      ip.opId || "",
      ip.visitDate || "",
      ip.visitTime || "",
      ip.reasonForVisit || "",
      ip.chiefComplaint || "",
      ip.currentMedications || "",
      ip.priority || "",
      ip.department || "",
      ip.referredBy || "",
      ip.validUntil || "",
      ip.status || "",
      vitals.weight ?? "",
      vitals.height ?? "",
      vitals.temperature ?? "",
      vitals.bloodPressureSystolic ?? "",
      vitals.bloodPressureDiastolic ?? "",
      vitals.pulse ?? "",
      vitals.respiratoryRate ?? "",
      vitals.oxygenSaturation ?? ""
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "IP!A2",
      valueInputOption: "USER_ENTERED",
      requestBody: { values }
    });

    console.log("[google-sync-IP] Synced IP record:", ip.ipId);
  } catch (err) {
    console.error("[google-sync-IP] Failed to sync IP:", err);
  }
}
