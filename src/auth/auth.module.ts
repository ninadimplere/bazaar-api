import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@auth/jwt.strategy';
import { JwtRefreshStrategy } from '@auth/jwt-refresh.strategy';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}), // We configure in service
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
