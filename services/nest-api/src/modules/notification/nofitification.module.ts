import { Module } from "@nestjs/common";
import type { EmailProviderInterface, SMSProviderInterface} from "./providers/interfaces"
import { EmailService } from "./providers/email.service";
import { NotificationManager } from "./notification.manager";
@Module({
    providers:[NotificationManager,EmailService],
    exports:[NotificationManager]

})
export class NotificationModule{

}