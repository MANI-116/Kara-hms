import { ApiClient } from "../../../../packages/apiClient/apiclient"

export class WebApiClient implements ApiClient{
  private BACKEND_URL = "http://localhost:3000"
    
//private AWS_URL = "https://t2f8yampxe.execute-api.ap-south-1.amazonaws.com";
private AWS_URL="http://localhost:3000"
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
   credentials:"include",
  headers:{
    "content-type":"applicaction/json",
    "access-control-allow-origin":"*"
   
  },
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
  credentials:"include",
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
  const data = await fetch(`${this.AWS_URL}/accounts/getIncomes`,{credentials:"include"}).then((res)=>res.json());
  console.log("data from getIncomes",data)
  
  return data;
}

 async  getExpenses(){
  
  console.log("getExpenses invoked");
  const data = await fetch(`${this.AWS_URL}/accounts/getExpenses`,{credentials:"include"}).then((res)=>res.json());
  console.log("data from getexpenses-",data);
  return data;
}

//OP
 async  addJamalOP(payload:any){
  console.log("payload for addJMLop:",payload);

 const data =  await fetch(`${this.AWS_URL}/jamalop/new`,{
    method:"POST",
    credentials:"include",
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
    credentials:"include",
    headers:{
      "content-type":"application/json",
      'Access-Control-Allow-Origin':"*",
    },
    body:JSON.stringify(payload)
  }).then((res)=>res.json());
  console.log("response from addJmalfetch",res);


  return res;
  
}

async login({ mailId }: { mailId: any; }): Promise<any> {
  try {
        
  const response = await fetch(`${this.BACKEND_URL}/auth/login`,{
    method:"POST",
    credentials:"include",
    headers:{
      "content-type":"application/json",
      'Access-Control-Allow-Origin':"*",
    },
    body:JSON.stringify({mailId})
  }).then((res)=>res.json());
  console.log("response from login",response);

  if(response.ok) return  true;

  return false;    
  } catch (error) {
    console.log("error in login",error);
    
  }

  
}
async getMe(){

  try {
    
    const response = await fetch(`${this.BACKEND_URL}/auth/me`,
      { method:"GET",
        credentials:"include",
        headers:{
       'Access-Control-Allow-Origin':"*"}}).then((res)=>res.json());
    console.log("respone from getMe adapter",response);
    if(response.error){
      throw new Error(response.error);
    }
    if(response.ok){
      console.log("response from the me",response.data);
      return {ok:true,data:response.data};
    }
  } catch (error) {
    console.log("error in me", error);
    return { ok:false,error:"unable to fetch"}
    
  }
}



async verifyOtp({ mailId, otp }: { mailId: any; otp: any; }): Promise<any> {

  try {
    const response = await fetch(`${this.BACKEND_URL}/auth/verifyOtp`,{
      method:"POST",
      credentials:"include",
      headers:{
        "content-type":"application/json",
        "Access-Control-Allow-Origin":"*",
      },
      body:JSON.stringify({mailId,otp}),
    }).then((res)=>res.json());

    console.log("response from verify otp",response);
    if(response.ok) return true;
     return false;
  } catch (error) {
    console.log("error in verifying otp",error);
    return false;
    
  }

  
  
}

}