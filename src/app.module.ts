import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { HelperModule } from './shared/helpers/helper.module';
import { PayloadEncryptionMiddleware } from './shared/middleware/payload-encryption.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'globalVariables.env',
    }),
    ApplicationModule,
    HelperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PayloadEncryptionMiddleware).forRoutes('*');
  }
}
