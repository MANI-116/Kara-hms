// src/lib/ipc.ts
export async function registerPatient(payload: any) {
  if (!window?.api?.registerPatient) throw new Error('IPC not available');
  return window.api.registerPatient(payload);
}

export async function getPatients() {
  if (!window?.api?.getPatients) throw new Error('IPC not available');
  return window.api.getPatients();
}

export async function searchPatients(term: string) {
  if (!window?.api?.searchPatients) throw new Error('IPC not available');
  return window.api.searchPatients(term);
}

export async function addExpense(payload:any){
  if(!window?.api?.addExpense) throw new Error("add expense is not available");
  console.log("adding expenseINcome")
  return window.api.addExpense(payload);
}


export async function addIncome(payload:any){
  if(!window?.api?.addIncome) throw new Error("add income is not found");
  console.log("sending req to ipc for income");
  return window.api.addIncome(payload);
}

export async function getIncomes(){
  console.log("get incomes invoked")
  if(!window?.api?.getIncomes) throw new Error("did not find hanlder for getIncomes");
  
  return window.api.getIncomes();
}

export async function getExpenses(){
  if(!window?.api?.getExpenses) throw new Error("did not find hanlder for getExpenses");

  return window.api.getExpenses();
}