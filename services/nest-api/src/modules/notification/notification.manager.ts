import { Injectable } from "@nestjs/common";
import { EmailService } from "./providers/email.service";
import { otpEmailTemplate } from "./templates/otpEmailTemplate";


@Injectable()
export class NotificationManager{

    constructor(private emailProvider:EmailService){
    }

    async sendOtpEmail(email:string,otp:string){
         this.emailProvider.send({
            to:email,
            subject:"Your Jamal Hospital OTP",
            html:otpEmailTemplate(otp)
         })
    }
}