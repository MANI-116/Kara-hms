import { google } from "googleapis";
import path from "path";
import fs from "fs";

const SERVICE_ACCOUNT_PATH = path.join(__dirname, "../google-service-account.json");

// ⚠️ Put your real spreadsheet ID here (from the sheet URL)
const SPREADSHEET_ID = "1IZBDdX_fOkFIyxt6te3cCr-Wmes0Jl0k89SZJy5N2vM";

export async function appendPatientToSheet(patient: any) {
  try {
    const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    const sheets = google.sheets({ version: "v4", auth });

    const values = [
      [
        patient.id,
        patient.fullName,
        patient.age,
        patient.gender,
        patient.contact,
        patient.address || "",
        patient.registrationDate,
        patient.bloodGroup || ""
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
