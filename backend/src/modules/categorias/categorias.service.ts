import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async listarTodas() {
    return this.prisma.categoria.findMany({
      include: {
        _count: {
          select: { produtos: true },
        },
      },
      orderBy: { nome: 'asc' },
    });
  }

  async buscarPorId(id: string) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
      include: { produtos: true },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria com ID ${id} não foi encontrada`);
    }

    return categoria;
  }

  async criar(dto: CriarCategoriaDto) {
    const existente = await this.prisma.categoria.findUnique({
      where: { slug: dto.slug },
    });

    if (existente) {
      throw new ConflictException('Já existe uma categoria cadastrada com este slug');
    }

    return this.prisma.categoria.create({
      data: dto,
    });
  }
}
