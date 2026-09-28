import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CriarPedidoDto } from './dto/criar-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CriarPedidoDto) {
    const idsProdutos = dto.itens.map((i) => i.produtoId);
    const produtos = await this.prisma.produto.findMany({
      where: { id: { in: idsProdutos } },
    });

    if (produtos.length !== idsProdutos.length) {
      throw new BadRequestException('Um ou mais produtos selecionados não foram encontrados no estoque');
    }

    let total = 0;
    const dadosItensPedido = dto.itens.map((item) => {
      const produto = produtos.find((p) => p.id === item.produtoId)!;
      if (produto.estoque < item.quantidade) {
        throw new BadRequestException(`Estoque insuficiente para o produto: ${produto.nome}`);
      }
      const precoUnitario = Number(produto.preco);
      total += precoUnitario * item.quantidade;

      return {
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnitario: precoUnitario,
      };
    });

    // Baixa atômica de estoque e inserção do pedido na transação
    return this.prisma.$transaction(async (tx) => {
      for (const item of dto.itens) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data: { estoque: { decrement: item.quantidade } },
        });
      }

      return tx.pedido.create({
        data: {
          usuarioId: dto.usuarioId,
          enderecoEntregaId: dto.enderecoEntregaId,
          total,
          itens: {
            create: dadosItensPedido,
          },
        },
        include: {
          itens: {
            include: { produto: true },
          },
        },
      });
    });
  }

  async listarPorUsuario(usuarioId: string) {
    return this.prisma.pedido.findMany({
      where: { usuarioId },
      include: {
        itens: {
          include: { produto: true },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async buscarPorId(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: {
          include: { produto: true },
        },
        usuario: { select: { id: true, nome: true, email: true } },
        enderecoEntrega: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return pedido;
  }
}
