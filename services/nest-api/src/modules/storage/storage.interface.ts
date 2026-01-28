export interface DataStorage{
    appendToSheets(payload:{values:(string|boolean)[][],range:string}):Promise<{ok:boolean;data:any}>;
    getOpId(sheetName:"JamalConfig"|"JimsConfig"):Promise<{ok:boolean;data:string}>;
    getExpenses():Promise<{ok:boolean;data:any}>;
    getIncomes():Promise<{ok:boolean;data:any}>;
    addExpense(expense:any):Promise<{ok:boolean;data:any}>;
    addIncome(income:any):Promise<{ok:boolean;data:any}>;
    findUserByEmail(mailId:string):Promise<{ok:boolean;data:any}>
    storeOtp(payload):Promise<{ok:boolean;data:any}>
    getOtp(payload):Promise<{ok:boolean;data:any}>
}