import { Module } from "@nestjs/common";
import { GoogleSheetsService } from "./sheets.service";
import { ConfigModule } from "@nestjs/config";
@Module({
    
    providers:[GoogleSheetsService],
    exports:[GoogleSheetsService]
})
export class GoogleSheetsModule{}