import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  const requiredRoles = route.data['roles'] as string[];
  const userRole = authService.getUserRole();

  // Evitar loop en rutas de autenticación
  if (state.url.includes('/auth/')) {
    return true;
  }

  if (!userRole) {
    toastr.error('No tienes permisos para acceder', 'Acceso denegado');
    router.navigate(['/auth/login']);
    return false;
  }

  if (!requiredRoles || requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
    return true;
  }

  // Redirigir al dashboard correcto según el rol
  toastr.error('No tienes los permisos necesarios', 'Acceso denegado');
  
  if (userRole === 'Admin') {
    router.navigate(['/admin/dashboard']);
  } else if (userRole === 'Abogado') {
    router.navigate(['/abogado/dashboard']);
  } else {
    router.navigate(['/usuario/mis-casos']);
  }
  
  return false;
};
