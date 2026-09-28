import { Categoria } from './categoria.model';

export interface Avaliacao {
  id: string;
  usuarioId: string;
  nota: number;
  comentario?: string;
  criadoEm: string;
  usuario?: {
    id: string;
    nome: string;
  };
}

export interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagens: string[];
  ativo: boolean;
  categoriaId: string;
  categoria?: Categoria;
  avaliacoes?: Avaliacao[];
  criadoEm: string;
  atualizadoEm: string;
}
