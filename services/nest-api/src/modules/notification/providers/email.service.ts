import * as nm from "nodemailer"
import { Injectable } from "@nestjs/common"
import type { EmailProviderInterface, EmailPayload } from "./interfaces"

@Injectable()
export class EmailService implements EmailProviderInterface{
    
    
    
 private transporter = nm.createTransport({
    service:"gmail",
    auth: {
        user: "111manikanta.v@gmail.com",
        pass:process.env.GOOGLE_APP_PASSCODE
    }
 })

 async send({to, subject, html}:EmailPayload){
    console.log("app-pass",process.env.GOOGLE_APP_PASSCODE)
    console.log("transporter",this.transporter)
    
     const info = await this.transporter.sendMail({
        from:"111manikanta.v@gmail.com",
        to,
        subject,
        html
     })
     console.log( "info form sendMail", info);
     return {ok:true,data:info}
 }
}

