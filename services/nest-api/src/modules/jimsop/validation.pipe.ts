import { validate } from "class-validator"
import { plainToInstance} from "class-transformer"
import { PipeTransform,Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common"
import { JimsOPDto } from "./dto/jimsop.dto";


@Injectable()
export class ValidateJimsOP implements PipeTransform{
    async transform(value: any, metadata: ArgumentMetadata) {
        if(metadata.type !== "body") return value;

        if(!metadata.metatype || !this.validateBaseType(metadata.metatype)) return value;

        const object = plainToInstance(JimsOPDto,value);
        const errors = await validate(object);

        if(errors.length > 0){
            throw new BadRequestException(errors);
            
        }

        return value;
    }

    validateBaseType(metatype:Function){
        const types:Function[]= [Boolean,String,Number,Array,Object]
        return !types.includes(metatype)
    }

}