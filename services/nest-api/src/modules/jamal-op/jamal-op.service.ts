import { Injectable,Inject } from "@nestjs/common";
import { CreateJamalOPDto} from "./dto/jamal-op.dto"
import { DataStorage as Data_Storage_Token} from "../storage/storage.token";
import type { DataStorage } from "../storage/storage.interface";
import { logger } from "../../logger/logger";

@Injectable()
export class JamalOPService{
    constructor(
      @Inject(Data_Storage_Token) private  dataStorage:DataStorage){
        console.log("initalized jamalOpservice");
        console.log("data storage token:",Data_Storage_Token);
            
        }
     
   async createJamalOP(opdata:CreateJamalOPDto){
    try {
      
        //logic to create op
        const paymentStatus= opdata.paymentStatus?"paid":"not paid";
        const id = await this.dataStorage.getOpId("JamalConfig");
        logger.info({loc:"jamalOPService",msg:`newId-${id}`})
        //transform data
        const values = [
      [
        false,
        id.data,
        opdata.fullName,
        opdata.age,
        opdata.gender,
        opdata.contact,
        opdata.assignDoctor,
        opdata.address || "",
        opdata.bloodGroup || "",
        opdata.weight||"",
        opdata.height||"",
        opdata.temperature||"",
        opdata.pulse||"",
        opdata.bloodPressureDiastolic||"",
        opdata.bloodPressureSystolic,
        opdata.respiratoryRate||"",
        opdata.oxygenSaturation||"",
        opdata.totalAmount||"",
        paymentStatus||"not paid"
       
      ]
     ];
    
     const valuesForIncome=[[
       new Intl.DateTimeFormat("us-GB").format(Date.now()),
        "jamalOP",
      `${opdata.fullName}-jamalOP`,
      opdata.totalAmount]]

     //append op data
      const appendOPdataRes = await this.dataStorage.appendToSheets({values:values,range:"JamalOPs!A2"

            })
            
            logger.info({loc:"jamalopService",msg:appendOPdataRes})

            //append accounts data
            const accountsRes = await this.dataStorage.appendToSheets({values:valuesForIncome,range:"Incomes!A2"});
            logger.info({loc:"jamlaopService",msg:accountsRes})
            if(!appendOPdataRes.ok || !accountsRes.ok){
              throw new Error(JSON.stringify({ok:false, error:"db error"}));
            }

            return { ok:true,opAppended:appendOPdataRes,accountsAppended:accountsRes,data:{id:id.data}};
    }catch (error) {
      logger.error({loc:"jamalopService",msg:error})
       throw error;
      
    }
    


}}