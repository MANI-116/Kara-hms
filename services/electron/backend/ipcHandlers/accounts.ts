import { ipcMain }  from "electron"
import { appendExpenseTOSheet, appendIncomeToSheets, getExpenses, getIncomes } from "../../googleConfig"



ipcMain.handle("accounts:addExpense",async (_,args)=>{

    try {
    console.log("add expense is invoked");
    console.log(args);
  
   
    const response = await appendExpenseTOSheet(args)
    return { status:"success",data:"svaed succesfully"}
        
    } catch (error) {
        return { status:"error",error}
        
    }

})

ipcMain.handle("accounts:addIncome",async(event,payload:any)=>{
    try {
        console.log("add income is invoked")
        const res = await appendIncomeToSheets(payload);
        return { status:"SUCCESS",data:"appended"}
    } catch (error) {
        console.log(error);
        return { status:"ERROR",error};
        
    }

})


ipcMain.handle("accounts:getIncomes",async()=>{
    try {
        console.log("getIncome Invoked")
        const res = await getIncomes();
        console.log("output from accounts:getincomes",res)

        return { status:"SUCCESS", data:res};
    } catch (error) {
        console.log(error);
        return { status:"ERROR", error};
        
    }
});


ipcMain.handle("accounts:getExpenses", async ()=>{

    try {
        const res = await getExpenses();
          console.log("output from accounts:getExpenses",res)
        return {status:"SUCCESS",data:res}
    } catch (error) {
        console.log(error);
        return { status:"ERROR", error};
        
    }
})
