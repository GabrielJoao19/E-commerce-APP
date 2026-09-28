import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { CriarCategoriaDto } from './dto/criar-categoria.dto';

@ApiTags('Categorias')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias com quantidade de produtos' })
  @ApiResponse({ status: 200, description: 'Lista de categorias retornada com sucesso' })
  async listarTodas() {
    return this.categoriasService.listarTodas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Consultar uma categoria por ID' })
  @ApiResponse({ status: 200, description: 'Categoria localizada' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async buscarPorId(@Param('id') id: string) {
    return this.categoriasService.buscarPorId(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar uma nova categoria' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  @ApiResponse({ status: 409, description: 'Slug já existente' })
  async criar(@Body() dto: CriarCategoriaDto) {
    return this.categoriasService.criar(dto);
  }
}
