import { IsEmail } from "class-validator"

export class LoginDto{
    @IsEmail()
    mailId:string;
}