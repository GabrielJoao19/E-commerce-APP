import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleEntrarDto {
  @ApiProperty({
    description: 'Token de credencial retornado pelo Google Identity Services',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...',
  })
  @IsString({ message: 'O token deve ser um texto' })
  @IsNotEmpty({ message: 'O token do Google é obrigatório' })
  token: string;
}
