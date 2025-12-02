import { google } from "googleapis";
import path from "path";
import fs from "fs";
import { error } from "console";

const SERVICE_ACCOUNT_PATH = path.join(__dirname, "../keys/google-service-account.json");

// ⚠️ Put your real spreadsheet ID here (from the sheet URL)
const SPREADSHEET_ID = "1IZBDdX_fOkFIyxt6te3cCr-Wmes0Jl0k89SZJy5N2vM";

console.log("service account path-",SERVICE_ACCOUNT_PATH);

export const getNextOPID = async(sheetName:"JamalConfig" | "JimsConfig")=>{

  //from config sheet get the last date;

  try {
    const credentials = getCredentials();
  const auth = new google.auth.GoogleAuth({credentials,scopes:["https://www.googleapis.com/auth/spreadsheets"]});
  const sheets = google.sheets({version:"v4",auth});
  const res  = await sheets.spreadsheets.values.get({
    spreadsheetId:SPREADSHEET_ID,
    range:`${sheetName}!A:B`
  })

  const rows = res.data.values;
  console.log("rows from config",rows);

  if(rows){
      const firstRow = rows[0];
      console.log("firstRow-",firstRow)
      const lastDate = firstRow[0];
      let sno = (parseInt(firstRow[1])+1).toString();
      console.log("sno-",sno,"sno.length-",sno.length);
      const limit = sno.length;
      for(let i =0; i < 4- limit;i++){
        sno = "0"+sno;
      }
      const seq_num = sno;
      console.log("new seq_no-",seq_num);
      const today =  new Intl.DateTimeFormat("en-GB").format(Date.now());
      console.log("lastdate",lastDate);
      console.log("today",today);
      if(today === lastDate){
    const updateRes=     await sheets.spreadsheets.values.update({
                                spreadsheetId: SPREADSHEET_ID,
                                range: `${sheetName}!A1:B1`,
                                valueInputOption: "RAW",
                                requestBody: {
                                  values: [[today, seq_num.toString()]],
                                },
                              });
      console.log("updateres-",updateRes.data);
        return { ok:true,data:seq_num.toString()};
      }else{
         const updateRes=     await sheets.spreadsheets.values.update({
                                spreadsheetId: SPREADSHEET_ID,
                                range: `${sheetName}!A1:B1`,
                                valueInputOption: "RAW",
                                requestBody: {
                                  values: [[today,1]],
                                },
                              });
      console.log("updateres-",updateRes);
        return { ok:true,data:1};
      }

  }

    
  } catch (error) {
    console.log("error from getConfig-",error);
    return {ok:false,data:-1}
    
  }
  


  
}

async function getRows(payload:any){

  try {
    const credentials = getCredentials();

    //authenticate
    const auth = new google.auth.GoogleAuth({credentials,scopes:["https://www.googleapis.com/auth/spreadsheets"]})
    const sheets = google.sheets({version:"v4",auth})
    console.log("row called for ",payload.sheetName)
   const res = await sheets.spreadsheets.values.get({
     spreadsheetId:SPREADSHEET_ID,
     range: `${payload.sheetName}!A2:F`})
    
     console.log(res.data.values)

     return res.data.values;
    
  } catch (error) {
    
  }

}

async function appendToSheets(payload:any){
  try {
    //get the credentials
    const credentials = getCredentials();

    //authenticate
    const auth = new google.auth.GoogleAuth({credentials,scopes:["https://www.googleapis.com/auth/spreadsheets"]})
    const sheets = google.sheets({version:"v4",auth})

   const res =  await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: payload.range, // your sheet name + range start
      valueInputOption: "USER_ENTERED",
      requestBody: { values:payload.values }
    });
    console.log(res.data);
    return { ok:true,data:res}

    
  } catch (error) {
    console.log(error);
    return { ok:false,data:error};
    
  }

}


function getCredentials(){
  return JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH,"utf-8"));

}

export async function getExpenses(){
  try {
    
     const res = await getRows({sheetName:"Expenses"})
      console.log(res," from getIncomes in googleConfig")
    const rows = res?.length;
    const data = res?.map((row,index)=>{return {type:"expense",id:index,date:row[0],description:row[2],amount:row[3],category:row[1]}});
   console.log(data,"length:",rows)
    return data;
   
  } catch (error) {
    console.log(error);
    
  }
}

export async function getIncomes(){
  try {
    const res = await getRows({sheetName:"Incomes"});
    //transform
    console.log(res," from getIncomes in googleConfig")
    const rows = res?.length;
    const data = res?.map((row,index)=>{return {type:"income",id:index,date:row[0],description:row[2],amount:row[3],category:row[1]}});
    return data;

  } catch (error) {
    
  }
}


//append OP to sheets dynamically based on the op name
export async function appendJamalOP(opPayload:any){

   const values = [
      [
        false,
        opPayload.id,
        opPayload.fullName,
        opPayload.age,
        opPayload.gender,
        opPayload.contact,
        opPayload.assignDoctor,
        opPayload.address || "",
        opPayload.registrationDate,
        opPayload.bloodGroup || "",
        opPayload.weight||"",
        opPayload.height||"",
        opPayload.temperature||"",
        opPayload.pulse||"",
        opPayload.bloodPresuureDiastolic||"",
        opPayload.bloodPressureSystolic,
        opPayload.respiratoryRate||"",
        opPayload.oxygenSaturation||""
      ]
    ];

    const res = await appendToSheets({values,range:"JamalOPs!A2"})
 

    return res;

   
}

export async function appendIncomeToSheets(income:any){
  const values = [[
      income.date,
      income.category,
      income.description,
      income.amount
  ]]

  await appendToSheets({values,range:"Incomes!A2"})

}

export async function appendExpenseTOSheet(expense:any){

  try {
    //get the credentials
    const credentials = getCredentials();

    //authenticate
    const auth = new google.auth.GoogleAuth({credentials,scopes:["https://www.googleapis.com/auth/spreadsheets"]})
    const sheets = google.sheets({version:"v4",auth})
    console.log(expense)
    const values = [[
      expense.date,
      expense.category,
      expense.description,
      expense.amount
    ]]
    console.log(values)
   const res =  await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Expenses!A2", // your sheet name + range start
      valueInputOption: "USER_ENTERED",
      requestBody: { values }
    });
    console.log(res);

    //append
  } catch (error) {
    console.log(error);
    
  }

}

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
        patient.assignDoctor,
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
