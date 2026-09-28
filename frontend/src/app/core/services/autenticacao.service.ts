import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { RespostaAutenticacao, Usuario } from '../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AutenticacaoService {
  private readonly api = inject(ApiService);
  private readonly CHAVE_USUARIO = 'ecommerce_usuario';
  private readonly CHAVE_TOKEN = 'ecommerce_token';

  private usuarioSignal = signal<Usuario | null>(this.obterUsuarioArmazenado());
  readonly usuarioAtual = this.usuarioSignal.asReadonly();
  readonly estaAutenticado = computed(() => !!this.usuarioSignal());

  private obterUsuarioArmazenado(): Usuario | null {
    const dados = localStorage.getItem(this.CHAVE_USUARIO);
    return dados ? JSON.parse(dados) : null;
  }

  obterToken(): string | null {
    return localStorage.getItem(this.CHAVE_TOKEN);
  }

  entrar(credenciais: { email: string; senha: string }): Observable<RespostaAutenticacao> {
    return this.api.post<RespostaAutenticacao>('autenticacao/entrar', credenciais).pipe(
      tap((resposta) => {
        this.salvarSessao(resposta.usuario, resposta.token);
      }),
    );
  }

  cadastrar(dados: { nome: string; email: string; senha: string }): Observable<RespostaAutenticacao> {
    return this.api.post<RespostaAutenticacao>('autenticacao/cadastrar', dados).pipe(
      tap((resposta) => {
        this.salvarSessao(resposta.usuario, resposta.token);
      }),
    );
  }

  sair() {
    localStorage.removeItem(this.CHAVE_USUARIO);
    localStorage.removeItem(this.CHAVE_TOKEN);
    this.usuarioSignal.set(null);
  }

  private salvarSessao(usuario: Usuario, token: string) {
    localStorage.setItem(this.CHAVE_USUARIO, JSON.stringify(usuario));
    localStorage.setItem(this.CHAVE_TOKEN, token);
    this.usuarioSignal.set(usuario);
  }
}
