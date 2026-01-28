import { Module } from "@nestjs/common";
import { OTPSerivice } from "./otp.service"
@Module({
    providers:[OTPSerivice],
    exports:[OTPSerivice]
})
export class OTPMOdule{

}