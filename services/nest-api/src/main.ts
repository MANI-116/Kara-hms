import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';

import express from 'express';
import { logger } from './logger/logger';
import {LoggerInterceptor } from "./logger/logger.interceptor"



async function bootstrapServer() {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useLogger({
    log:(msg)=>logger.info(msg),
    error:(msg,trace)=>logger.error({trace},msg),
    warn:(msg)=>logger.trace(msg),
    verbose:(msg)=>logger.trace(msg),
    debug:(msg)=>logger.debug(msg)
  })

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalInterceptors(new LoggerInterceptor());
  await app.listen(3000,()=>console.log(`app is running on 5127`))
  
}
bootstrapServer();
