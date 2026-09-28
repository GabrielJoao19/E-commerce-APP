import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AutenticacaoService } from './autenticacao.service';
import { AutenticacaoGoogleService } from './autenticacao-google.service';
import { AutenticacaoController } from './autenticacao.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'chave_secreta_ecommerce_desenvolvimento'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
    }),
  ],
  controllers: [AutenticacaoController],
  providers: [AutenticacaoService, AutenticacaoGoogleService],
  exports: [AutenticacaoService, AutenticacaoGoogleService, JwtModule],
})
export class AutenticacaoModule {}
