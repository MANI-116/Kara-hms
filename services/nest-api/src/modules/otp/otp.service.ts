import { Injectable,Inject,OnModuleInit } from "@nestjs/common";
import bcrypt from "bcrypt";
import { DataStorage as Data_Storage_Token } from "../storage/storage.token";
import type { DataStorage } from "../storage/storage.interface";


/*
    storage:
        -otp is connected to client-id
        -login we use jwt which is also related to the client ID
        -client Id - latest otp and latest jwt and last otp request and last jwt 
        -split sheets to otp sheet and jwt sheet
            -we have fixed number of rows = equlavalent to the staff sheet rows
    login try with credentials
    otp sent to user
    case 1: user received the otp
        -enter the otp and verify
        -number of tries limited max 3
        -time limit till 30 min for the otp

    */

@Injectable()
export class OTPService implements OnModuleInit{
    private cache = new Map<string,any>();
    constructor(@Inject(Data_Storage_Token)private dataStorage:DataStorage){
        
    }
    async onModuleInit() {
        const rows = await this.dataStorage.getOtpSheetDetails();
        console.log("loading otp cache")

        for(const row of rows){
            const otp = JSON.stringify(row[1]);
            const email = row[0];
            this.cache.set(email,otp);
        }
        console.log(`otp cache loaded with ${this.cache.size}`)
        
    }

    async generateOtp(email){
        //6- digit number
        
        const otpNumber = Math.floor(100000+ Math.random() *900000).toString();

        const otpHash:string = await bcrypt.hash(otpNumber,10);
        //store otp in the sheets:
        const otp = new OTP(email,
            otpHash,
            Date.now(),
            3,
            0,
            "active")
        await this.dataStorage.storeOtp(otp);
        this.cache.set(email,otp);

        return { ok:true,data:{otpNumber}}
        

    }

    async verifyOtp(email:string,clientOtp){

        try {
             //get the otp from datastorage
        const res = await this.dataStorage.getOtp({email});
        const otp = JSON.parse(res.data)
        console.log(otp);
        const hashedOtp = otp.otpHash;

        console.log("hshed otp fethed",hashedOtp);
        const result = await bcrypt.compare(clientOtp.toString(),hashedOtp);
        console.log("is matched otps-",result)
        if(!result) return {ok:false,error:"otp does not match"};

        return {ok:true, data:"otp matched succesfully"};
        } catch (error) {
            console.log(error);
            return {ok:false,error}
            
        }
        
       

    }


}



class OTP {
  
   constructor(public email:string,
    public otpHash:string,
    public issuedAt:number,
    public attemptsLeft:number,
    public lastRequested:number,
    public status:string){
    
   }

}