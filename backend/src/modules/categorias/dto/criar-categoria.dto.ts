import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CriarCategoriaDto {
  @ApiProperty({ example: 'Eletrônicos & Smart', description: 'Nome da categoria' })
  @IsString({ message: 'O nome da categoria deve ser um texto' })
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório' })
  nome: string;

  @ApiProperty({ example: 'eletronicos-e-smart', description: 'Identificador amigável de URL' })
  @IsString({ message: 'O slug deve ser um texto' })
  @IsNotEmpty({ message: 'O slug da categoria é obrigatório' })
  slug: string;

  @ApiProperty({ example: 'Smartphones e dispositivos inteligentes', required: false })
  @IsString()
  @IsOptional()
  descricao?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', required: false })
  @IsString()
  @IsOptional()
  imagemUrl?: string;
}
