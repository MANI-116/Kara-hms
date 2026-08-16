import { AuthValidationPipe } from "./validationPipes/authValidation.pipe"
import { LoginDto } from "./dto/login.dto"
import { Controller,Post,Body, Res, Get,Req, UseGuards } from "@nestjs/common"
import { Public } from "./decorators/public.decorator"
import type { Response} from "express"
import { AuthService } from "./auth.service"
import { VerifyOtpValidationPipe } from "./validationPipes/verifyOtpValidation.pipe"
import { VerifyOtpDto } from "./dto/verifyOtp.dto"
import { AuthorizationGuard } from "./guards/authorization.guard"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"

@UseGuards(JwtAuthGuard,AuthorizationGuard)
@Controller("auth")
export class AuthController{
    constructor(private authService:AuthService){

    }
    @Public()
    @Post("login")
    login(@Body(new AuthValidationPipe()) payload:LoginDto){
        const mailId = payload.mailId;
        return this.authService.login(mailId);
    }

    @Get("me")
    async getMe(@Req() req){
        const user = req.user;
        console.log("/me route invoked",user);
        return {ok:true,data:user}

    }
    @Public()
    @Post("verifyOtp")
    async verifyOtp(@Body(new VerifyOtpValidationPipe())payload:VerifyOtpDto, @Res({passthrough:true}) response:Response){
        console.log("verify otp-",payload);
        const res = await this.authService.verifyOtp({email:payload.mailId,otpNumber:payload.otp});
        response.cookie("access-token",res?.token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
            maxAge: 2 * 24 * 60 * 60 * 1000,
        }) 
        console.log(res)

        return res;


    }
}