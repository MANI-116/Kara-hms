import { Module } from '@nestjs/common';
import { DataStorageModule } from '../storage/storage.module';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports:[DataStorageModule,AuthModule],
    controllers:[AccountsController],
    providers:[AccountsService]
})
export class AccountsModule {

}
