import {IsString,IsBoolean} from 'class-validator'
export class CreateJamalOPDto{

    @IsString()
    fullName: string;
    @IsString()
    age: string;
    @IsString()
    gender: string;
    @IsString()
    contact: string;
    @IsString()
    address: string;
    @IsString()
    bloodGroup: string;
    @IsString()
    assignDoctor:string;
    @IsString()
    weight:string;
    @IsString()
    height:string;
    @IsString()
    temperature:string;
    @IsString()
    pulse:string;
    @IsString()
    bloodPressureSystolic:string;
    @IsString()
    bloodPressureDiastolic:string;
    @IsString()
    respiratoryRate:string;
    @IsString()
    oxygenSaturation:string;
    @IsString()
    consultationFee:string;
    @IsString()
    paymentMode:string;
    @IsBoolean()
    paymentStatus:boolean;
    @IsString()
    totalAmount:string;
    


}