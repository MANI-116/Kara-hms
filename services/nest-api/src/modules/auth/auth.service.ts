import { Injectable, Inject} from "@nestjs/common"
import  { DataStorage as Data_Storage_Token } from "../storage/storage.token"
import type { DataStorage } from "../storage/storage.interface"
import { UnauthorizedException } from "@nestjs/common";
import { NotificationManager } from "../notification/notification.manager";
import { OTPService } from "../otp/otp.service";
import * as jwt from "jsonwebtoken"

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

    private JWT_SECRET;
    constructor( 
       @Inject(Data_Storage_Token) private dataStorage:DataStorage,
        private otpservice:OTPService,
        private notifier:NotificationManager){
            this.JWT_SECRET = process.env.JWT_SECRET;

    }

    async login(email:string){
        try {
        const res = await this.dataStorage.findUserByEmail(email);
        if(!res.ok) new UnauthorizedException({error:"user not found"});

        const otp = await this.otpservice.generateOtp(email);
        
        await this.notifier.sendOtpEmail(email,otp.data.otpNumber);
            return { ok:true,data:"OTP send Successfully"};
        } catch (error) {

            console.log(error)
            
        }
    
         
    }

    async verifyOtp({email,otpNumber}:{email:string,otpNumber:number}){
        try {

        const response = await this.otpservice.verifyOtp(email,otpNumber);
        if(!response.ok) return { ok:false, data:response.data}
        const user = await this.dataStorage.findUserByEmail(email);
        if(!user) return {ok:false,data:"user not found"}

        //create jwt
        console.log("useDataINVeriy:",user)
        const token = await this.createJwt({email,permissions:user.data.permissions,role:user.data.role});

        if(!token.ok) return { ok:false, error:token.error}
        console.log("otp service response",response);

        return {ok:true, data:user.data.permissions, token:token.data};
            
        } catch (error) {
            console.error("verifyOtp:",error);
            return {ok:false,error};
            
        }

        
    }

    async createJwt({email,role,permissions}:{email:string,permissions:string[],role:string}){

        const token = jwt.sign({email,permissions,role},this.JWT_SECRET,{algorithm:'HS256',expiresIn:"2 days"});
        if(!token) return { ok:false, error:"unable to create token"};

        return{ok:true, data:token};
    }

    async verifyToken(token:string){

        try {
            const result = jwt.verify(token,this.JWT_SECRET);
            return { ok:true, data:result}
        } catch (error) {
            console.log("verifyTOken:",error);
            return { ok :false,error};
            
        }
    }




}