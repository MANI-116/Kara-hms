import { validate } from "class-validator"
import { plainToInstance } from "class-transformer"
import { Injectable, PipeTransform, ArgumentMetadata, UnauthorizedException } from "@nestjs/common"
import { LoginDto } from "../dto/login.dto";


@Injectable()
export class AuthValidationPipe implements PipeTransform{

    async transform(value: any, metadata: ArgumentMetadata) {
        //some checks
        if( !metadata.metatype || !this.validateBaseTypes(value) || metadata.type != "body")
            return value;

        const object = plainToInstance(LoginDto,value);
        console.log(object);

        const errors = await validate(object);

        if(errors.length > 0 ){
            new UnauthorizedException({errors});
            
        }

        return value;

    }

    validateBaseTypes(payload:any):Boolean{

     const types = [ String, Function, Boolean, Object, Array];

     return types.includes(payload);


    }
}