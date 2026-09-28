export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao?: string;
  imagemUrl?: string;
  _count?: {
    produtos: number;
  };
}
