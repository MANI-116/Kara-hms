import { Injectable } from "@nestjs/common";
import { google } from "googleapis";
import { DataStorage, OTP } from "../storage/storage.interface";
import { logger } from "../../logger/logger";
import { permission } from "process";

@Injectable()
export class GoogleSheetsService implements DataStorage{
  private  auth;
  private  SPREADSHEET_ID ;
  private sheets;

  constructor(){
       this.auth ={
                  "type": process.env.GOOGLE_TYPE,
                  "project_id": process.env.GOOGLE_PROJECT_ID,
                  "private_key": process.env.GOOGLE_PRIVATE_KEY,
                  "client_email": process.env.GOOGLE_CLIENT_EMAIL
                  }
        this.SPREADSHEET_ID=process.env.GOOGLE_SPREADSHEET_ID;   
        console.log("environment varibles-",this.SPREADSHEET_ID);
        
        //authenticate
        const credentials = this.auth;
        const auth = new google.auth.GoogleAuth({credentials,scopes:["https://www.googleapis.com/auth/spreadsheets"]})
        this.sheets = google.sheets({version:"v4",auth});
        logger.info({loc:"googlesheetsService",msg:`${this.SPREADSHEET_ID === undefined ? "auth loaded not correctly":"auth load succesfully"}`})
         
    }

  async appendToSheets(payload:{values:(string|boolean)[][],range:string}){
    try {
    const res =  await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.SPREADSHEET_ID,
        range: payload.range, // your sheet name + range start
        valueInputOption: "USER_ENTERED",
        requestBody: { values:payload.values }
      });
      
      logger.info({loc:"gs-service-appendTOSheets",msg:res},"appening to sheets")
      return { ok:true,data:res}

      
    } catch (error) {
       logger.error({loc:"gs-service-appendTOSheets",msg:error})
      return { ok:false,data:error};
      
    }

  }

async findUserByEmail(mailId: string): Promise<{ ok: boolean; data: any; }> {
  try {

  const rows:string[][] = await this.getRows({sheetName:"Employees"});
  const userRow = rows.filter((row:string[])=>row[2]===mailId);
  if(userRow.length === 0) return {ok:false,data:"user not Found"};
  console.log("userRow:",userRow);
  const userData = {
    id:userRow[0][0]+1,
    name:userRow[0][1],
    permissions:userRow[0][3].slice(1,-1).split(","),
    role:userRow[0][4]
  }

  return { ok:true, data:userData};
    
  } catch (error) {

    throw new Error(JSON.stringify(Error));
    
  }
  

}  
async  getRows(payload:any){

  try {
    console.log("row called for ",payload.sheetName)
   const res = await this.sheets.spreadsheets.values.get({
     spreadsheetId:this.SPREADSHEET_ID,
     range: `${payload.sheetName}!A2:F`})
    
     console.log(res.data.values)

     return res.data.values;
    
  } catch (error) {
    logger.error({ok:false,error});
    throw new Error(JSON.stringify({description:"failed in getRows",error}))
    
  }

}


   
    async getOpId(sheetName:"JamalConfig" | "JimsConfig"):Promise<{ok:boolean,data:string}>{
         
      try {
        
           
            const res  = await this.sheets.spreadsheets.values.get({
              spreadsheetId:this.SPREADSHEET_ID,
              range:`${sheetName}!A:B`
            })
            console.log("response-",res);
            logger.info(`{loc:"gs-service-getopID",msg:res},"responsefrom get id"`);
            console.log("response-",res)

            const rows = res.data.values;
            if(rows){
                const firstRow = rows[0];
                const lastDate = firstRow[0];
                let sno = parseInt(firstRow[1]);
                const today =  new Intl.DateTimeFormat("en-GB").format(Date.now());
           
                 let idCount = today === lastDate ? (sno+1).toString(): "1" ;

                 const updateRes = await this.sheets.spreadsheets.values.update({
                                          spreadsheetId: this.SPREADSHEET_ID,
                                          range: `${sheetName}!A1:B1`,
                                          valueInputOption: "RAW",
                                          requestBody: {
                                            values: [[today, idCount]],
                                          },
                                        });
                logger.info({loc:"gs-service-getopID",msg:updateRes});
                for(let i = idCount.length; i < 4; i++){
                  idCount = "0"+idCount;
                }
                const recordId = `${sheetName.replace("Config","")+"OP-"+today+"-"+idCount}`;
                  return { ok:true,data:recordId};

            }   
      } catch (error) {
        console.log("error from getopid",error);
        logger.error({loc:"gs-service-getopID",msg:error})
 
        return {ok:false,data:"0000"}     
      }
      
    return { ok:false,data:"0000"}
  }

  
async getExpenses(){
  try {
    
     const res = await this.getRows({sheetName:"Expenses"})
      console.log(res," from getIncomes in googleConfig")
    const rows = res?.length;
    let fData:any[]=[];
    for(let i =rows-1;i>=0;i--){
      const row = res[i];
      const object = {type:"expense",id:i,date:row[0],description:row[2],amount:row[3],category:row[1]}
      fData.push(object);
    }
   console.log(fData,"length:",rows)
    return { ok:true,data:fData}
   
  } catch (error) {
    logger.error({ok:false,error});
    throw new Error(JSON.stringify({description:"error in getExpenses",error}))
    
  }
}

async  getIncomes(){
  try {
    const res = await this.getRows({sheetName:"Incomes"});
    //transform
    console.log(res," from getIncomes in googleConfig")
    const rows = res?.length;
    let data:any[] = [];
    for( let index = rows-1;index >=0 ;index--){
      const row = res[index];
      const object = {type:"income",id:index,date:row[0],description:row[2],amount:row[3],category:row[1]};
      data.push(object);
    }
   
    return {ok:true,data};

  } catch (error) {
    logger.error({ok:false,error});
    throw new Error(JSON.stringify({desc:"error in getIncomes",error}));
    
  }
}


 async  addExpense(expense:any){

  try {
    console.log(expense)
    const values = [[
      expense.date,
      expense.category,
      expense.description,
      expense.amount
    ]]
   
   const res =  await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.SPREADSHEET_ID,
      range: "Expenses!A2", 
      valueInputOption: "USER_ENTERED",
      requestBody: { values }
    });
    logger.debug("response from appendExpense",res);
    return {ok:true,data:res};

    
  } catch (error) {
    logger.error(JSON.stringify({desc:"error in appendExpense",error}));
    throw error;
    
  }

}

async addIncome(income:any){

  try {
      const values = [[
      income.date,
      income.category,
      income.description,
      income.amount
  ]]

  const res = await this.appendToSheets({values,range:"Incomes!A2"});
  return { ok:true,data:"success",res}
    
  } catch (error) {
    logger.error(JSON.stringify({desc:"error in appendIncome",error}));
    throw error;
    
  }


}

async getOtpSheetDetails(){

  try {
    const response = await this.getRows({sheetName:"LoginDetails"})
    console.log("response from the getotpdetails",response);
    return response;
  } catch (error) {
    console.log(error);
    
  }
}

async getOtp(payload: any): Promise<{ ok: boolean; data: any; }> {
   let otp ="";
  const rows = await this.getOtpSheetDetails();
 
  for (let row=0;row < rows.length;row++){
    console.log("row-",row,"row-values",rows[row],"email-",payload.email)
    
    if(rows[row][0] === payload.email){
      otp = rows[row][1];
      break;

    }

  }
  console.log(otp);
console.log("returning otp from sheets-",otp)
  
  return {ok:true,data:otp}
}

async updateCell(cell:string,value){

  try{
    console.log("values in sheets......",this.sheets.spreadsheets.values.update);

    const result = await this.sheets.spreadsheets.values.update({
    range:cell,
    spreadsheetId:this.SPREADSHEET_ID,
    valueInputOption:"USER_ENTERED",
    requestBody:{
      values:[[value]]
    }
  })

}catch(error){
  console.log("error while updating",error);
}
  return false;
}

async storeOtp(payload: OTP): Promise<{ ok: boolean; data: any; }> {
 //get the row and column number:

 //assuming the email must be present
 const cellDetails = await this.getOtpDetailsByEmail(payload.email);
console.log("storing otp to sheets-",payload)
 const result = await this.updateCell(cellDetails,JSON.stringify(payload));

console.log("result:",result);
  
  return {ok:true,data:"stored successfully"}
}
async getOtpDetailsByEmail(email:string){

  //cached

  //not cached
  return "LoginDetails!B2:B2"
}
      
}
