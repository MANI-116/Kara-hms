import { IsNumber,IsString,Matches } from "class-validator"

export class IncomeDto{

    @Matches(/^(0[1-9]|[12][0-9]|3[12])-(0[1-9]|1[0-2])-\d{4}$/,
        {message:"date shuld bbe in dd-mm-yyyy format"}
    )
    date:string;

    @IsString()
    description:string;

    @IsString()
    category:string;

    @IsNumber()
    amount:number;
}