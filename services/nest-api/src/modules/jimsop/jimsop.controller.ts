import { Injectable, Inject, Controller,Post,Body } from "@nestjs/common";
import { JimsOPService } from "./jimsop.service";
import { JimsOPDto } from "./dto/jimsop.dto";
import { ValidateJimsOP } from "./validation.pipe";


@Controller("jimsop")
@Injectable()
export class JimsOPController{
    constructor( @Inject(JimsOPService)private readonly jimsService:JimsOPService){

    }

    @Post("new")
    addJimsOP(@Body(new ValidateJimsOP()) data:JimsOPDto){

        return this.jimsService.addJimsOP(data);

    }

}