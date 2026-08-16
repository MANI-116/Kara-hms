import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { DataStorageModule } from "../storage/storage.module"
import { OTPModule } from "../otp/otp.module"
import { NotificationModule } from "../notification/nofitification.module"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { AuthorizationGuard } from "./guards/authorization.guard"


@Module({
    imports:[DataStorageModule,OTPModule,NotificationModule],
    providers:[AuthService,JwtAuthGuard,AuthorizationGuard],
    controllers:[AuthController],
    exports:[AuthService,JwtAuthGuard,AuthorizationGuard]
})
export class AuthModule{

}