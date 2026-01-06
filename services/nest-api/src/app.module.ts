import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config"
import { JamalOPModule} from "./modules/jamal-op/jamal-op.module"
import { AccountsModule } from './modules/accounts/accounts.module';
import { JimsopModule } from "./modules/jimsop/jimsop.module"

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true, envFilePath:['.env','.env.google','.env.dev']}),
    JamalOPModule,
    AccountsModule,
    JimsopModule
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
