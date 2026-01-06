import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException} from "@nestjs/common"
import { validate } from "class-validator"
import { plainToInstance } from "class-transformer"


@Injectable()
export class InputValidationPipe implements PipeTransform{

    async transform(value: any, metadata: ArgumentMetadata) {
        console.log("validating addincome-",value,"metadata",metadata)
        if(metadata.type !== "body" || !metadata.metatype || !this.toValidate(metadata.metatype) ) return value;
        
        if(value === null){
            throw new BadRequestException("Request body is required");
        }
            const instance = plainToInstance(metadata.metatype,value);

            const errors =  await validate(instance,{
                whitelist:true,
                forbidNonwhitelisted:true,
                forbidUnknowValues:false
            });
            console.log("errors",errors);

            if(errors.length > 0){
                throw new BadRequestException(errors)
            }

            return instance;

        

    }

     private toValidate(metatype:Function):boolean{
            const types:Function[] = [String,Boolean, Number,Array,Object];
            return !types.includes(metatype);
        }
}