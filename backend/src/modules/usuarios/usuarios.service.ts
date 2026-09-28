import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async buscarPorId(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        papel: true,
        criadoEm: true,
        enderecos: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não foi encontrado`);
    }

    return usuario;
  }
}
