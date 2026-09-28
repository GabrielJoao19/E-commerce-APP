import { Injectable, computed, effect, signal } from '@angular/core';
import { ItemCarrinho } from '../../shared/models/carrinho.model';
import { Produto } from '../../shared/models/produto.model';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private readonly CHAVE_CARRINHO = 'ecommerce_carrinho';
  private itensSignal = signal<ItemCarrinho[]>(this.obterCarrinhoArmazenado());

  readonly itens = this.itensSignal.asReadonly();

  readonly totalItens = computed(() =>
    this.itensSignal().reduce((soma, item) => soma + item.quantidade, 0),
  );

  readonly precoTotal = computed(() =>
    this.itensSignal().reduce(
      (soma, item) => soma + Number(item.produto.preco) * item.quantidade,
      0,
    ),
  );

  constructor() {
    effect(() => {
      localStorage.setItem(this.CHAVE_CARRINHO, JSON.stringify(this.itensSignal()));
    });
  }

  private obterCarrinhoArmazenado(): ItemCarrinho[] {
    const dados = localStorage.getItem(this.CHAVE_CARRINHO);
    return dados ? JSON.parse(dados) : [];
  }

  adicionarAoCarrinho(produto: Produto, quantidade = 1) {
    this.itensSignal.update((atuais) => {
      const indiceExistente = atuais.findIndex((i) => i.produto.id === produto.id);
      if (indiceExistente > -1) {
        const atualizados = [...atuais];
        atualizados[indiceExistente] = {
          ...atualizados[indiceExistente],
          quantidade: atualizados[indiceExistente].quantidade + quantidade,
        };
        return atualizados;
      }
      return [...atuais, { produto, quantidade }];
    });
  }

  atualizarQuantidade(produtoId: string, quantidade: number) {
    if (quantidade <= 0) {
      this.removerDoCarrinho(produtoId);
      return;
    }

    this.itensSignal.update((atuais) =>
      atuais.map((item) =>
        item.produto.id === produtoId ? { ...item, quantidade } : item,
      ),
    );
  }

  removerDoCarrinho(produtoId: string) {
    this.itensSignal.update((atuais) =>
      atuais.filter((item) => item.produto.id !== produtoId),
    );
  }

  limparCarrinho() {
    this.itensSignal.set([]);
  }
}
