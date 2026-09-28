import { Produto } from './produto.model';

export type StatusPedido = 'PENDENTE' | 'PAGO' | 'ENVIADO' | 'ENTREGUE' | 'CANCELADO';

export interface ItemPedido {
  id: string;
  pedidoId: string;
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  produto?: Produto;
}

export interface Pedido {
  id: string;
  usuarioId: string;
  enderecoEntregaId?: string;
  status: StatusPedido;
  total: number;
  criadoEm: string;
  itens: ItemPedido[];
}
