import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ChatService } from './chat/chat.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.URL_DEV_PRODUCTION, process.env.URL_DEV_LOCALHOST],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });

  const chatService = app.get(ChatService);

  // Gửi chat mỗi 10 giây
  setInterval(() => {
    chatService.autoChat();
  }, 15000);

  const configService = app.get(ConfigService);
  const port  = configService.get('INTERNAL_APP_PORT')
  
  app.setGlobalPrefix('api');
  await app.listen(port);
}
bootstrap();
