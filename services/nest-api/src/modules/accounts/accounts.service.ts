import { Injectable,Inject, Body, Get,Post } from "@nestjs/common"
import type { DataStorage } from "../storage/storage.interface"
import { DataStorage as Data_Storage_Token } from "../storage/storage.token"


@Injectable()
export class AccountsService{
    constructor(
        @Inject(Data_Storage_Token) private dataStorage:DataStorage){

        }
    
    getIncomes(){
        console.log("service getincomes",this.dataStorage);
        return this.dataStorage.getIncomes();

    }
    getExpenses(){
        return this.dataStorage.getExpenses();
    }

    addIncome(income:any){
        return this.dataStorage.addIncome(income);
    }

    addExpense(expense:any){
        return this.dataStorage.addExpense(expense);
    }
}