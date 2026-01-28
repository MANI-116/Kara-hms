import { AuthValidationPipe } from "./authValidation.pipe"
import { LoginDto } from "./dto/login.dto"
import { Controller,Post,Body } from "@nestjs/common"
import { AuthService } from "./auth.service"


@Controller("auth")
export class AuthController{
    constructor(private authService:AuthService){

    }

    @Post("login")
    login(@Body(new AuthValidationPipe()) payload:LoginDto){

        const mailId = payload.mailId;
        /*
        get the mailid from the sheets 
            -success
                -chekck valid role selected
            -failed:
                -no account found
        check the selected role have permisions
            valid:    
                -true: proceed login
            not valid:  
                -false:return with no permission 
        generate OTP
        send email to the user
        get rows from the otp and set the otp details against userID
        store otp details in the sheets using storageService
        return message                     
         */

        return this.authService.login(mailId);
    }
}