import { Module } from "@nestjs/common";
import { JamalOPController } from "./jamal-op.controller";
import { JamalOPService } from "./jamal-op.service";
import { DataStorageModule } from "../storage/storage.module";

@Module({
    imports:[DataStorageModule],
    providers:[ JamalOPService],
    controllers:[ JamalOPController]
})
export class JamalOPModule{};