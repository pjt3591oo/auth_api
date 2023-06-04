import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Interceptor } from './common/interceptor';
import { MiddleExceptionFilter } from './common/filter/middle.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new MiddleExceptionFilter());
  app.useGlobalInterceptors(new Interceptor());
  await app.listen(3000);
}
bootstrap();
