import { Controller,Post, Body, Injectable, Inject } from "@nestjs/common";
import { JamalOPService} from "./jamal-op.service";
import { CreateJamalOPDto} from "./dto/jamal-op.dto";
import { ValidationJamalOP } from "./validation.pipe";
import { logger } from "../../logger/logger";

@Controller("jamalop")
@Injectable()
export class JamalOPController{
  constructor(@Inject(JamalOPService) private readonly opService: JamalOPService) {
      logger.info({initated:"jamalOPController",serviceInitiated:opService!=undefined})
  }

    @Post("new")
    async createJamalOP(@Body(new ValidationJamalOP()) body:CreateJamalOPDto):Promise<any>{
      const res = await this.opService.createJamalOP(body)
      return  res;
  }

}