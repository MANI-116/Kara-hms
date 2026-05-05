import  {IsEmail,IsNumber} from "class-validator"

export class VerifyOtpDto{
    @IsEmail()
    mailId:string

    @IsNumber()
    otp:number

} 