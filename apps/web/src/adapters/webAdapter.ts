import { ApiClient } from "../../../../packages/apiClient/apiclient"

export class WebApiClient implements ApiClient{
    
private AWS_URL = "https://t2f8yampxe.execute-api.ap-south-1.amazonaws.com";
 async  registerPatient(payload: any) {
  
}

 async  getPatients() {
}



 async  searchPatients(term: string) {
 
}

//Accouunts
 async  addExpense(payload:any){
  try {
    console.log("add expense is invoked",payload);
 let formattedDate = payload.date;
 const arr = formattedDate.split('-');
 console.log("arr",arr);
  formattedDate="";
  for(let i =2;i>0;i--){
    formattedDate += arr[i]+"-";
  }
  formattedDate += arr[0];
  console.log("formated date",formattedDate);
  payload.date=formattedDate;
  console.log("patyload to backend",payload);
 const res = await fetch(`${this.AWS_URL}/accounts/addExpense`,{
  method:"POST",
  headers:{
    "content-type":"applicaction/json",
    "access-control-allow-origin":"*"},
  body:JSON.stringify(payload)}).then((res)=>res.json());
 console.log("rsponse from backend",res);
 return res;
    
  } catch (error) {
    console.log("error from backend",error);
    
    
  }
 
}


 async  addIncome(payload:any){
 console.log("addincome is invokd:",payload);
  let formattedDate = payload.date;
 const arr = formattedDate.split('-');
 console.log("arr",arr);
  formattedDate="";
  for(let i =2;i>0;i--){
    formattedDate += arr[i]+"-";
  }
  formattedDate += arr[0];
  payload.date=formattedDate;
  console.log("patyload to backend",payload);

  
 const data = await fetch(`${this.AWS_URL}/accounts/addIncome`,{
  method:"POST",
  headers:{
    "content-type":"application/json",
    "access-control-allow-origin":"*"
  },
  body: JSON.stringify(payload)
 }).then((res)=>res.json()); 
  return data;
}

 async  getIncomes(){
  console.log("get incomes invoked")
  const data = await fetch(`${this.AWS_URL}/accounts/getIncomes`).then((res)=>res.json());
  console.log("data from getIncomes",data)
  
  return data;
}

 async  getExpenses(){
  
  console.log("getExpenses invoked");
  const data = await fetch(`${this.AWS_URL}/accounts/getExpenses`).then((res)=>res.json());
  console.log("data from getexpenses-",data);
  return data;
}

//OP
 async  addJamalOP(payload:any){
  console.log("payload for addJMLop:",payload);

 const data =  await fetch(`${this.AWS_URL}/jamalop/new`,{
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

 async  addJimsOP(payload:any) {
  console.log("payload fromm jimsOP",payload);
  payload = {...payload,age:parseInt(payload?.age)};
  const res = await fetch(`${this.AWS_URL}/jimsop/new`,{
    method:"POST",
    headers:{
      "content-type":"application/json",
      'Access-Control-Allow-Origin':"*"
    },
    body:JSON.stringify(payload)
  }).then((res)=>res.json());
  console.log("response from addJmalfetch",res);


  return res;
  
}

}