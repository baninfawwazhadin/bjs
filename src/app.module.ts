import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { HelperModule } from './shared/helpers/helper.module';
import { AdminModule } from './application/admin/admin.module';
import { PayloadEncryptionMiddleware } from './shared/middleware/payload-encryption.middleware';
import { AreaModule } from './application/area/area.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RequestTypeModule } from './application/request-type/request-type.module';
import { ProductModule } from './application/product/product.module';
import { CompanyModule } from './application/company/company.module';
import { CompanyPICModule } from './application/company-PIC/company-pic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        auth_pass: configService.get('REDIS_PASSWORD'),
        ttl: 30,
      }),
      isGlobal: true,
    }),
    ApplicationModule,
    HelperModule,
    AdminModule,
    AreaModule,
    RequestTypeModule,
    ProductModule,
    CompanyModule,
    CompanyPICModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PayloadEncryptionMiddleware).forRoutes('*');
  }
}
