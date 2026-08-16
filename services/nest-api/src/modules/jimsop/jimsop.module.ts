import { Module } from '@nestjs/common';
import { JimsOPController} from "./jimsop.controller"
import { JimsOPService} from "./jimsop.service"
import { DataStorageModule } from '../storage/storage.module';

@Module({
    imports:[DataStorageModule],
    controllers:[JimsOPController],
    providers:[JimsOPService]
})
export class JimsopModule {};
