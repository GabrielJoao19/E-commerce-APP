import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CarrinhoService } from '../../../core/services/carrinho.service';
import { AutenticacaoService } from '../../../core/services/autenticacao.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  readonly carrinhoService = inject(CarrinhoService);
  readonly authService = inject(AutenticacaoService);

  sair() {
    this.authService.sair();
  }
}
