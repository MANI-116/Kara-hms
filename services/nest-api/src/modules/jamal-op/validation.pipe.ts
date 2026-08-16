import { ArgumentMetadata, PipeTransform, Injectable, BadRequestException} from "@nestjs/common"
import { validate} from "class-validator"
import { plainToInstance } from "class-transformer"
import { logger } from "../../logger/logger";

@Injectable()
export class ValidationJamalOP implements PipeTransform{
        async transform(value: any, arguementMetadata: ArgumentMetadata) {
            const {metatype} = arguementMetadata;
            console.log("arguement metadata",arguementMetadata);
            console.log("metatype",metatype);
            console.log("value",value)
           
            try{

                if(!metatype || !this.toValidate(metatype)){
                return value;
                }

                const object = plainToInstance(metatype,value);
                console.log("object insgtance-",object);
                const errors = await validate(object);
                if(errors.length > 0){
                    throw new BadRequestException(errors);
                }
                
                return value;
            }catch(e){
               logger.error({loc:"jamalOPValidationPIpe",msg:e});
               throw e;

            }
            
        }

        private toValidate(metatype:Function):boolean{
            const types:Function[] = [String,Boolean, Number,Array,Object];
            return !types.includes(metatype);
        }

}