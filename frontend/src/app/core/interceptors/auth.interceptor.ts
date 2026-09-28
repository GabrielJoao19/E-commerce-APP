import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AutenticacaoService } from '../services/autenticacao.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AutenticacaoService);
  const token = authService.obterToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
