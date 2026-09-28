import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { AutenticacaoService } from '../../core/services/autenticacao.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  readonly carrinhoService = inject(CarrinhoService);
  readonly authService = inject(AutenticacaoService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  finalizando = signal<boolean>(false);

  finalizarCompra() {
    if (!this.authService.estaAutenticado()) {
      alert('Você precisa estar conectado à sua conta para finalizar o pedido.');
      this.router.navigate(['/entrar']);
      return;
    }

    const usuario = this.authService.usuarioAtual();
    if (!usuario) return;

    this.finalizando.set(true);

    const pedidoDto = {
      usuarioId: usuario.id,
      itens: this.carrinhoService.itens().map((item) => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade,
      })),
    };

    this.api.post('pedidos', pedidoDto).subscribe({
      next: (pedidoCriado: any) => {
        this.finalizando.set(false);
        alert(`🎉 Pedido #${pedidoCriado.id.slice(0, 8)} realizado com sucesso! O estoque foi atualizado no banco de dados.`);
        this.carrinhoService.limparCarrinho();
        this.router.navigate(['/']);
      },
      error: (erro) => {
        this.finalizando.set(false);
        alert(
          erro?.error?.message ||
            'Não foi possível concluir o pedido. Verifique a disponibilidade do estoque.',
        );
      },
    });
  }
}
