import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicAuthStrategy } from './strategies/basic.strategy';
import { DatabaseModule } from '~/database/database.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'secretBJS'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRY', '1h') },
      }),
    }),
    DatabaseModule,
  ],
  providers: [AuthService, JwtStrategy, BasicAuthStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
