import { Injectable,Inject } from "@nestjs/common";
import bcrypt from "bcrypt";
import { DataStorage as Data_Storage_Token } from "../storage/storage.token";
import type { DataStorage } from "../storage/storage.interface";

@Injectable()
export class OTPSerivice{

    constructor(@Inject(Data_Storage_Token)private dataStorage:DataStorage){}

    async generateOtp(email){
        //6- digit number
        
        const otp =Math.floor(100000+ Math.random() *900000).toString();

        const hash:string = await bcrypt.hash(otp,10);
        //store otp in the sheets:
        await this.dataStorage.storeOtp({email,hash});

        return { ok:true,data:{otpHash:hash}}
        

    }

    async verifyOtp(email:string,clientOtp){
        
        //get the otp from datastorage
        const hashedOtp = await this.dataStorage.getOtp(email);
        const result = await bcrypt.compare(clientOtp,hashedOtp);
        if(!result) return false;

        return true;

    }


}

class OTP {

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
    //4-digit string
   private code : string 

   //otp Issued date and time
   private issued: Date

   //validity of otp
  // private const valid = 30

   //number of times tried the otp
   private  tries = 3

   //if tries are completed we need to freeze the account for 3 hrs


   constructor(){

    //generates otp number 
    this.generateOTP();
    //set issued date
    this.issued = new Date();
   }

   generateOTP(){

    let otp = "";
    for( let i =0;i < 4;i++){
        otp += Math.floor(Math.random() *10);
    }
    this.code = otp;
 

   }


   verify(otp:string):boolean{
    //verfy the time limit 
     
    if(this.code === otp) return true;
    
    this.tries--;
    if( this.tries === 0 ){
        
    }
    return false;

   }


}