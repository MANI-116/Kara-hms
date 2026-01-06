import { Module } from '@nestjs/common';
import { DataStorageModule } from '../storage/storage.module';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
    imports:[DataStorageModule],
    controllers:[AccountsController],
    providers:[AccountsService]
})
export class AccountsModule {

}
