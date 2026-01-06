import { IsString, IsNumber, IsDateString } from "class-validator"

export class expenseDto {
    @IsDateString()
    date:Date;

    @IsString()
    category:string;

    @IsString()
    desscription:string;

    @IsNumber()
    amount:number;

}