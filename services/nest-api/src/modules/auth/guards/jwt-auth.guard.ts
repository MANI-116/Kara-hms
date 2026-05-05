import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthService} from "../auth.service"
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Reflector } from "@nestjs/core";

@Injectable()
export class JwtAuthGuard implements CanActivate{

    constructor(private authService:AuthService,private reflector:Reflector){

    }
    async canActivate(context: ExecutionContext):  Promise<boolean>  {
         const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (isPublic) return true;
        
        const request = context.switchToHttp().getRequest();
        const token = request.cookies["access-token"];
        if(!token) throw new UnauthorizedException("access-token not found");

        const response = await this.authService.verifyToken(token);
        if(response.ok) {
         request.user = response.data;
        return true;
        }

        return false;

    }


}