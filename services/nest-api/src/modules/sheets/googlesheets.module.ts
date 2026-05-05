import { Module } from "@nestjs/common";
import { GoogleSheetsService } from "./sheets.service";

@Module({
    
    providers:[GoogleSheetsService],
    exports:[GoogleSheetsService]
})
export class GoogleSheetsModule{}