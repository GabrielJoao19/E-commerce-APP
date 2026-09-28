export type Papel = 'CLIENTE' | 'ADMIN';

export interface Endereco {
  id: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  padrao: boolean;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  papel: Papel;
  criadoEm: string;
  enderecos?: Endereco[];
}

export interface RespostaAutenticacao {
  usuario: Usuario;
  token: string;
}
