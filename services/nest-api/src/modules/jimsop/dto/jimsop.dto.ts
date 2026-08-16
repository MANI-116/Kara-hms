import { IsString,IsNumber,IsBoolean } from "class-validator"


export class JimsOPDto{
    @IsString()
    fullName:string
    @IsNumber()
    age:number
    @IsString()
    gender:"male"|"female"
    @IsString()
    contact:string
    @IsString()
    assignDoctor:string
    @IsString()
    address:string
    @IsString()
    bloodGroup:string

}