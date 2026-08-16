import { ipcMain } from "electron"
import Ajv from "ajv";
import * as jamalOPSchema from "../../../../shared/jamalOP.schema.json"
import { appendJamalOP, getNextOPID} from "../../googleConfig"

ipcMain.handle("op:jamal",async (e,payload)=>{

    const ajv = new Ajv({allErrors:true});
    const validateJamalOP= ajv.compile(jamalOPSchema);
    
    if(!validateJamalOP(payload)){
        console.log("[op:jamal]-ve:", validateJamalOP.errors);
        return {ok:false,data:validateJamalOP.errors}
    }

    //sync to the google sheets:

    try {

        const nextIdRes = await getNextOPID("JamalConfig");
        console.log("new id from the getIDfunc",nextIdRes);
        let opId:any;
        const date = new Intl.DateTimeFormat("en-GB").format(Date.now());
        console.log("nextIdRes",nextIdRes)
        if(nextIdRes?.ok){
         
            opId = nextIdRes?.data;
               console.log("got the id -------------",opId)
          
            opId=`jam-${date}-${opId}`;
            console.log("the new formatted opID------------",opId)


        }
    const sheetsSyncRes = await appendJamalOP({...payload,id:opId}).then((res)=>res).catch((err)=>{throw new Error(err);});



    console.log("response from appendJamalOP-",sheetsSyncRes.data);

    return { ok:true,data:{...payload,id:opId}}
        
    } catch (error) {
        return {ok:false, data:error}
        
    }

})