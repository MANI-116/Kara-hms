import { Injectable,Inject } from "@nestjs/common";
import { DataStorage as Data_Storage_Token } from "../storage/storage.token";
import type { DataStorage } from "../storage/storage.interface";

@Injectable()
export class JimsOPService{
    constructor(@Inject(Data_Storage_Token)private dataStorage:DataStorage){

    }

    async addJimsOP(opdata){

        try {
             
        const paymentStatus = opdata.paymentStatus ? "paid":"not paid"
        let id = await this.dataStorage.getOpId("JimsConfig");
        console.log("id",id);

        const opData = [[
        false,
        id.data,
        opdata.fullName,
        opdata.age,
        opdata.gender,
        opdata.contact,
        opdata.assignDoctor,
        opdata.address || "",
        opdata.bloodGroup || "",
        opdata.totalAmount||"",
        paymentStatus,
        ]]

        const incomevalues=[[
       new Intl.DateTimeFormat("us-GB").format(Date.now()),
        "JimsOP",
      `${opdata.fullName}-jimsOP`,
       opdata.totalAmount
        ]]

        const opRes = await this.dataStorage.appendToSheets({values:opData,range:"JimsOPs!A2"});
        const accountsRes = await this.dataStorage.appendToSheets({values:incomevalues,range:"Incomes!A2"})

       console.log("opres",opRes,"accountsRes:",accountsRes);

       return { ok:true,data:{id:id.data},accountsRes,opRes}

            
        } catch (error) {

            console.log("error inn add jimsop service",error);
            return { ok:false, error};
            
        }
       

    }

}