//registering patients
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

//Accouunts

export async function addExpense(payload:any){
 console.log("add expense is invoked",payload);
 let formattedDate = payload.date;
 const arr = formattedDate.split('-');
 console.log("arr",arr);
  formattedDate="";
  for(let i =2;i>=0;i++){
    formattedDate += arr[i];
  }
  payload.date=formattedDate;


 const res = await fetch("https://t2f8yampxe.execute-api.ap-south-1.amazonaws.com/accounts/addExpense",{
  method:"POST",
  headers:{
    "content-type":"applicaction/json"
  },
  body:JSON.stringify(payload)

 }).then((res)=>res.json());
 return res;
}


export async function addIncome(payload:any){
 console.log("addincome is invokd:",payload);
  let formattedDate = payload.date;
 const arr = formattedDate.split('-');
 console.log("arr",arr);
  formattedDate="";
  for(let i =2;i>=0;i++){
    formattedDate += arr[i];
  }
  payload.date=formattedDate;
 const data = await fetch("https://t2f8yampxe.execute-api.ap-south-1.amazonaws.com/accounts/addIncome",{
  method:"Post",
  headers:{
    "content-type":"application/json"
  },
  body: JSON.stringify(payload)
 }).then((res)=>res.json()); 
  return data;
}

export async function getIncomes(){
  console.log("get incomes invoked")
  const data = await fetch("https://t2f8yampxe.execute-api.ap-south-1.amazonaws.com/accounts/getIncomes").then((res)=>res.json());
  console.log("data from getIncomes",data)
  
  return data;
}

export async function getExpenses(){
  
  console.log("getExpenses invoked");
  const data = await fetch("https://t2f8yampxe.execute-api.ap-south-1.amazonaws.com/accounts/getExpenses").then((res)=>res.json());
  console.log("data from getexpenses-",data);
  return data;
}

//OP
export async function addJamalOP(payload:any){
  console.log("payload for addJMLop:",payload);

 const data =  await fetch("https://t2f8yampxe.execute-api.ap-south-1.amazonaws.com/jamalop/new",{
    method:"POST",
    headers:{
      "content-type":"application/json",
      "access-control-allow-origin":"*"
    },
    body:JSON.stringify(payload)
  }).then((res)=>res.json());

  console.log("data from the response from backend api",data);

  return data;
}