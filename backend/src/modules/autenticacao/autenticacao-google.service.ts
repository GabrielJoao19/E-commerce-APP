import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AutenticacaoGoogleService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClient = new OAuth2Client(googleClientId);
  }

  async entrarComGoogle(tokenGoogle: string) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    let payload;

    // 1. Validação Criptográfica com os servidores do Google
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: tokenGoogle,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } catch (erro) {
      throw new UnauthorizedException('Token de autenticação do Google inválido ou expirado');
    }

    if (!payload || !payload.email) {
      throw new UnauthorizedException('Não foi possível obter o e-mail da conta do Google');
    }

    const { email, name } = payload;

    // 2. Consulta ou Criação do Usuário no Banco SQLite
    let usuario = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      usuario = await this.prisma.usuario.create({
        data: {
          nome: name || 'Usuário Google',
          email,
          senha: '', // Usuários do Google não utilizam senha local
          papel: 'CLIENTE',
        },
      });
    }

    // 3. Emissão do Token JWT próprio da nossa Loja
    const token = this.jwtService.sign({
      sub: usuario.id,
      email: usuario.email,
      papel: usuario.papel,
    });

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
      token,
    };
  }
}
