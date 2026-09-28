import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CriarProdutoDto } from './dto/criar-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  private formatarProduto(p: any) {
    let imagensArray: string[] = [];
    if (typeof p.imagens === 'string') {
      try {
        imagensArray = JSON.parse(p.imagens);
      } catch {
        imagensArray = [];
      }
    } else if (Array.isArray(p.imagens)) {
      imagensArray = p.imagens;
    }

    if (imagensArray.length === 0 && p.imagemUrl) {
      imagensArray = [p.imagemUrl];
    }

    return {
      ...p,
      imagens: imagensArray,
    };
  }

  async listarTodos(parametros?: { categoriaId?: string; busca?: string }) {
    const { categoriaId, busca } = parametros || {};

    const produtos = await this.prisma.produto.findMany({
      where: {
        ativo: true,
        ...(categoriaId ? { categoriaId } : {}),
        ...(busca
          ? {
              OR: [
                { nome: { contains: busca } },
                { descricao: { contains: busca } },
              ],
            }
          : {}),
      },
      include: {
        categoria: {
          select: { id: true, nome: true, slug: true },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });

    return produtos.map((p) => this.formatarProduto(p));
  }

  async buscarPorId(id: string) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: true,
        avaliacoes: {
          include: {
            usuario: { select: { id: true, nome: true } },
          },
          orderBy: { criadoEm: 'desc' },
        },
      },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não foi encontrado`);
    }

    return this.formatarProduto(produto);
  }

  async criar(dto: CriarProdutoDto) {
    const existente = await this.prisma.produto.findUnique({
      where: { slug: dto.slug },
    });

    if (existente) {
      throw new ConflictException('Já existe um produto cadastrado com este slug');
    }

    const imagensSerializadas = JSON.stringify(dto.imagens || []);

    const produto = await this.prisma.produto.create({
      data: {
        nome: dto.nome,
        slug: dto.slug,
        descricao: dto.descricao,
        preco: dto.preco,
        estoque: dto.estoque,
        ativo: dto.ativo ?? true,
        categoriaId: dto.categoriaId,
        imagens: imagensSerializadas,
        imagemUrl: dto.imagens && dto.imagens.length > 0 ? dto.imagens[0] : null,
      },
      include: { categoria: true },
    });

    return this.formatarProduto(produto);
  }
}
