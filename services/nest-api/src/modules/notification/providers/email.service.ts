import * as nm from "nodemailer"
import { Injectable } from "@nestjs/common"
import type { EmailProviderInterface, EmailPayload } from "./interfaces"

@Injectable()
export class EmailService implements EmailProviderInterface{
    
 private transporter = nm.createTransport({
    service:"gmail",
    auth: {
        user: "111manikanta.v@gmail.com",
        pass:process.env.GMAIL_APP_PASSWORD
    }
 })

 async send({to, subject, html}:EmailPayload){
     const info = await this.transporter.sendEmail({
        from:"111manikanta.v@gmail.com",
        to,
        subject,
        html
     })
     console.log( "info form sendMail", info);
     return {ok:true,data:info}
 }
}

