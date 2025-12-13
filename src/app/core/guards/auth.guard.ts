import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  // Evitar loop si ya estamos en /auth/login
  if (state.url.includes('/auth/login') || state.url.includes('/auth/register')) {
    return true;
  }

  if (authService.getToken()) {
    return true;
  }

  toastr.warning('Por favor inicia sesión para acceder', 'Acceso denegado');
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
