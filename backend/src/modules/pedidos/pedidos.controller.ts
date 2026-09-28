import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CriarPedidoDto } from './dto/criar-pedido.dto';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo pedido com controle de estoque' })
  @ApiResponse({ status: 201, description: 'Pedido realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Estoque insuficiente ou produto inválido' })
  async criar(@Body() dto: CriarPedidoDto) {
    return this.pedidosService.criar(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar detalhes de um pedido' })
  @ApiResponse({ status: 200, description: 'Pedido localizado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  async buscarPorId(@Param('id') id: string) {
    return this.pedidosService.buscarPorId(id);
  }

  @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Listar histórico de pedidos de um usuário' })
  @ApiResponse({ status: 200, description: 'Histórico de pedidos retornado com sucesso' })
  async listarPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.pedidosService.listarPorUsuario(usuarioId);
  }
}
