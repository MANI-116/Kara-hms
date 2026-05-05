import { Module } from "@nestjs/common";
import { OTPService } from "./otp.service"
import { DataStorageModule } from "../storage/storage.module";
@Module({
    imports:[DataStorageModule],
    providers:[OTPService],
    exports:[OTPService]
})
export class OTPModule{

}