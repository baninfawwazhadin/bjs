import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { HelperModule } from './shared/helpers/helper.module';
import { EmailModule } from './application/email/email.module';
import { PayloadEncryptionMiddleware } from './shared/middleware/payload-encryption.middleware';
import { AreaModule } from './application/area/area.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApplicationModule,
    HelperModule,
    EmailModule,
    AreaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PayloadEncryptionMiddleware).forRoutes('*');
  }
}
