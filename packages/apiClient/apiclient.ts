export interface ApiClient{
    registerPatient(payload:any):Promise<any>
    getPatients():Promise<any>
    searchPatients(term:string):Promise<any>
    addExpense(payload:any):Promise<any>
    addIncome(payload:any):Promise<any>
    getIncomes():Promise<any>
    getExpenses():Promise<any>
    addJamalOP(payload:any):Promise<any>
    addJimsOP(payload:any):Promise<any>

}


