import { Inject, Injectable } from "@nestjs/common";
import { GoogleSheetsService,} from "../sheets/sheets.service";
import { DataStorage } from "./storage.interface";


@Injectable()
export class GoogleSheetsStorage implements DataStorage {
    
    constructor(@Inject(GoogleSheetsService) private readonly GoogleSheetsService:GoogleSheetsService){
        console.log("Googlesheets intaiantiated")

    }

    async appendToSheets(payload:{values:(string|boolean)[][], range:string}):Promise<{ok:boolean,data:any}>{
        return this.GoogleSheetsService.appendToSheets(payload);

    }
    async getOpId(sheetName: "JamalConfig" | "JimsConfig"): Promise<{ ok: boolean; data: string; }> {
        return this.GoogleSheetsService.getOpId(sheetName);
        
    }
    async getExpenses(): Promise<{ ok: boolean; data: any; }> {
        return this.GoogleSheetsService.getExpenses();
    }
    async getIncomes(): Promise<{ok:boolean; data:any}>{
        return this.GoogleSheetsService.getIncomes();
    }
    async addExpense(expense: any): Promise<{ ok: boolean; data: any; }> {
        return this.GoogleSheetsService.addExpense(expense);
    }
    async addIncome(income: any): Promise<{ ok: boolean; data: any; }> {
        return this.GoogleSheetsService.addIncome(income);
    }

    async findUserByEmail(mailId: string): Promise<{ ok: boolean; data: any; }> {
        
        return this.GoogleSheetsService.findUserByEmail(mailId);
    }
}