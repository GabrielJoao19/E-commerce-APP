import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CarrinhoService } from '../../../core/services/carrinho.service';
import { Produto } from '../../../shared/models/produto.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly carrinhoService = inject(CarrinhoService);

  produto = signal<Produto | null>(null);
  carregando = signal<boolean>(true);
  quantidade = signal<number>(1);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarProduto(id);
    }
  }

  carregarProduto(id: string) {
    this.carregando.set(true);
    this.api.get<Produto>(`produtos/${id}`).subscribe({
      next: (dados) => {
        this.produto.set(dados);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);
      },
    });
  }

  incrementarQuantidade() {
    this.quantidade.update((q) => q + 1);
  }

  decrementarQuantidade() {
    if (this.quantidade() > 1) {
      this.quantidade.update((q) => q - 1);
    }
  }

  adicionarAoCarrinho() {
    const prod = this.produto();
    if (prod) {
      this.carrinhoService.adicionarAoCarrinho(prod, this.quantidade());
    }
  }
}
