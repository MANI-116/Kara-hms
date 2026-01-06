import { Module} from "@nestjs/common"
import { DataStorage } from "./storage.token"
import { GoogleSheetsModule } from "../sheets/googlesheets.module"
import { GoogleSheetsStorage } from "./google-sheets.storage"
import { AccountsModule } from "../accounts/accounts.module"

@Module({
    imports:[GoogleSheetsModule],
    providers:[{
        provide:DataStorage,
        useClass:GoogleSheetsStorage
    }],
    exports:[DataStorage],

})
export class DataStorageModule{

}