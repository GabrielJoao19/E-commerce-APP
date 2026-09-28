import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/products/product-list/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
  },
  {
    path: 'produtos/:id',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent,
      ),
  },
  {
    path: 'carrinho',
    loadComponent: () =>
      import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'entrar',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'cadastrar',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  // Redirecionamentos de compatibilidade
  {
    path: 'cart',
    redirectTo: 'carrinho',
    pathMatch: 'full',
  },
  {
    path: 'login',
    redirectTo: 'entrar',
    pathMatch: 'full',
  },
  {
    path: 'register',
    redirectTo: 'cadastrar',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
