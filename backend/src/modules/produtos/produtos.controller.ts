import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProdutosService } from './produtos.service';
import { CriarProdutoDto } from './dto/criar-produto.dto';

@ApiTags('Produtos')
@Controller('produtos')
export class ProdutosController {
  constructor(private readonly produtosService: ProdutosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar catálogo de produtos com filtros de busca e categoria' })
  @ApiQuery({ name: 'categoriaId', required: false, type: String, description: 'ID da categoria' })
  @ApiQuery({ name: 'busca', required: false, type: String, description: 'Termo de busca textual' })
  @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso' })
  async listarTodos(
    @Query('categoriaId') categoriaId?: string,
    @Query('busca') busca?: string,
  ) {
    return this.produtosService.listarTodos({ categoriaId, busca });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar produto por ID com categoria e avaliações' })
  @ApiResponse({ status: 200, description: 'Produto localizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async buscarPorId(@Param('id') id: string) {
    return this.produtosService.buscarPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Slug do produto já existente' })
  async criar(@Body() dto: CriarProdutoDto) {
    return this.produtosService.criar(dto);
  }
}
