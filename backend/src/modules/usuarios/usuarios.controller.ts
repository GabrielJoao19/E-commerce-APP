import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obter perfil e endereços do usuário por ID' })
  @ApiResponse({ status: 200, description: 'Perfil retornado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async buscarPorId(@Param('id') id: string) {
    return this.usuariosService.buscarPorId(id);
  }
}
