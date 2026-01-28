import { Injectable} from "@nestjs/common"
import  { DataStorage as Data_Storage_Token } from "../storage/storage.token"
import type { DataStorage } from "../storage/storage.interface"
import { UnauthorizedException } from "@nestjs/common";
import { NotificationManager } from "../notification/notification.manager";
import { OTPSerivice } from "../otp/otp.service";

    /*
        get the mailid from the sheets 
            -success
                -chekck valid role selected
            -failed:
                -no account found
       
        generate OTP
        send email to the user
        get rows from the otp and set the otp details against userID
        store otp details in the sheets using storageService
        return message                     
         */
@Injectable()
export class AuthService{
    constructor( 
        private dataStorage:DataStorage,
        private otpservice:OTPSerivice,
        private notifier:NotificationManager){

    }

    async login(email:string){
        try {
        const res = await this.dataStorage.findUserByEmail(email);
        if(!res.ok) new UnauthorizedException({error:"user not found"});
        /*
        create otp
        store otp 
        send otp
        */ 

        const otp = await this.otpservice.generateOtp();
        //sotre it in sheets

        await this.notifier.sendOtpEmail(email,otp.data.otpHash);
            
        } catch (error) {
            
        }
    
         
    }


}