import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CriarProdutoDto {
  @ApiProperty({ example: 'Smartphone Ultra X' })
  @IsString()
  @IsNotEmpty({ message: 'O nome do produto é obrigatório' })
  nome: string;

  @ApiProperty({ example: 'smartphone-ultra-x' })
  @IsString()
  @IsNotEmpty({ message: 'O slug do produto é obrigatório' })
  slug: string;

  @ApiProperty({ example: 'Smartphone com câmera de 108MP e processador octa-core' })
  @IsString()
  @IsNotEmpty({ message: 'A descrição do produto é obrigatória' })
  descricao: string;

  @ApiProperty({ example: 2999.99 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'O preço deve ser maior que zero' })
  preco: number;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'O estoque não pode ser negativo' })
  estoque: number;

  @ApiProperty({
    example: ['https://images.unsplash.com/photo-1511707171634-5f897ff02560'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imagens?: string[];

  @ApiProperty({ example: 'uuid-da-categoria' })
  @IsString()
  @IsNotEmpty({ message: 'A categoria do produto é obrigatória' })
  categoriaId: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
