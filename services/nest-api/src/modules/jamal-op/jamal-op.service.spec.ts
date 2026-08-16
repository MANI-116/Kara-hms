import { Test, TestingModule} from "@nestjs/testing";
import { JamalOPService } from "./jamal-op.service";
import { DataStorage as Data_Storage_Token } from "../storage/storage.token";
import { DataStorage } from "../storage/storage.interface"

//Mock database

const dataStorageMock = {
    getOpId:jest.fn().mockResolvedValue({data:123}),
    appendToSheets:jest.fn().mockResolvedValue({
    opAppended:'Success',
    accountsAppend:'Success'
 })
  
}

describe("JamalOPService",()=>{
    let service:JamalOPService;
     beforeEach(async ()=>{

        const module:TestingModule = await Test.createTestingModule({
            providers:[JamalOPService,{
                provide:Data_Storage_Token,
                useValue:dataStorageMock
            }]
        }).compile();

        service = module.get<JamalOPService>(JamalOPService);
     })

     it("should create JamalOP and aooend data to the sheets",async ()=>{
        const opData = {
  "fullName": "Rohit Sharma",
  "age": "28",
  "gender": "Male",
  "contact": "9876543210",
  "address": "Sector 12, Hyderabad",
  "bloodGroup": "B+",
  "assignDoctor": "Dr. Ramesh",
  "weight": "72",
  "height": "175",
  "temperature": "98.6",
  "pulse": "80",
  "bloodPressureSystolic": "120",
  "bloodPressureDiastolic": "80",
  "respiratoryRate": "18",
  "oxygenSaturation": "98",
  "consultationFee": "500",
  "paymentMode": "Cash",
  "paymentStatus": true,
  "totalAmount": "500"
}
 const result = await service.createJamalOP(opData);
 expect(result).toEqual(   {
        opAppended: { opAppended: 'Success', accountsAppend: 'Success' },
        accountsAppended: { opAppended: 'Success', accountsAppend: 'Success' }       
      }
);
 expect(dataStorageMock.getOpId).toHaveBeenCalledWith('JamalConfig');
 expect(dataStorageMock.appendToSheets).toHaveBeenCalledTimes(2);

     })
  
});

