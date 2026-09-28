import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ItemPedidoDto {
  @ApiProperty({ example: 'uuid-do-produto', description: 'ID do produto a ser comprado' })
  @IsString()
  @IsNotEmpty()
  produtoId: string;

  @ApiProperty({ example: 2, description: 'Quantidade desejada' })
  @IsNumber()
  @IsPositive({ message: 'A quantidade deve ser positiva' })
  quantidade: number;
}

export class CriarPedidoDto {
  @ApiProperty({ example: 'uuid-do-usuario', description: 'ID do usuário comprador' })
  @IsString()
  @IsNotEmpty()
  usuarioId: string;

  @ApiProperty({ example: 'uuid-do-endereco', required: false, description: 'ID do endereço de entrega' })
  @IsString()
  @IsOptional()
  enderecoEntregaId?: string;

  @ApiProperty({ type: [ItemPedidoDto], description: 'Itens que compõem o pedido' })
  @IsArray()
  @ArrayMinSize(1, { message: 'O pedido deve conter pelo menos 1 item' })
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];
}
