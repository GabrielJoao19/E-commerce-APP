import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { CarrinhoService } from '../../../core/services/carrinho.service';
import { Produto } from '../../../shared/models/produto.model';
import { Categoria } from '../../../shared/models/categoria.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly carrinhoService = inject(CarrinhoService);

  produtos = signal<Produto[]>([]);
  categorias = signal<Categoria[]>([]);
  carregando = signal<boolean>(true);
  termoBusca = signal<string>('');
  categoriaSelecionada = signal<string>('');

  ngOnInit() {
    this.carregarCategorias();
    this.carregarProdutos();
  }

  carregarCategorias() {
    this.api.get<Categoria[]>('categorias').subscribe({
      next: (dados) => this.categorias.set(dados),
      error: () => {},
    });
  }

  carregarProdutos() {
    this.carregando.set(true);
    const parametros: Record<string, string> = {};
    if (this.categoriaSelecionada()) parametros['categoriaId'] = this.categoriaSelecionada();
    if (this.termoBusca()) parametros['busca'] = this.termoBusca();

    this.api.get<Produto[]>('produtos', parametros).subscribe({
      next: (dados) => {
        this.produtos.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
      },
    });
  }

  filtrarPorCategoria(categoriaId: string) {
    this.categoriaSelecionada.set(categoriaId);
    this.carregarProdutos();
  }

  buscar() {
    this.carregarProdutos();
  }

  adicionarAoCarrinho(produto: Produto) {
    this.carrinhoService.adicionarAoCarrinho(produto);
  }
}
