import { Injectable, NestInterceptor, ExecutionContext, CallHandler} from "@nestjs/common"
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { logger } from "./logger";


@Injectable()
export class LoggerInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const start = Date.now();
        const request  = context.switchToHttp().getRequest();
        const { method,url}=request;
      

        return next.handle().pipe(tap(()=>{ const duration= Date.now()-start;logger.info({method,url,duration},'Request completed')}))
    }
}