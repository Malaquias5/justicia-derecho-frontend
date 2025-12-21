import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'Ha ocurrido un error';
      let showToast = true;

      // Verificar si es un error de cuenta inactiva
      if (
        error.error?.message?.includes('inactiva') ||
        error.error?.message?.includes('DisabledException')
      ) {
        errorMessage = 'Su cuenta está inactiva. Contacte al administrador.';
        toastr.error(errorMessage, 'Cuenta Inactiva', {
          timeOut: 10000,
          closeButton: true,
        });
        authService.logout();
        router.navigate(['/auth/login']);
        return throwError(() => error);
      }

      if (error.status === 401) {
        errorMessage = 'Su sesión ha expirado';
        // No mostrar toast en login (el componente ya lo maneja)
        if (!req.url.includes('/auth/login')) {
          authService.logout();
          router.navigate(['/auth/login']);
        } else {
          showToast = false; // El componente de login maneja este error
        }
      } else if (error.status === 403) {
        errorMessage = 'No tiene permisos para realizar esta acción';
        // No redirigir automáticamente, solo mostrar el error
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
        // Capturar error específico de Spring Security
        if (error.error?.trace?.includes('DisabledException')) {
          errorMessage = 'Su cuenta está inactiva. Contacte al administrador.';
          authService.logout();
          router.navigate(['/auth/login']);
        }
        // Capturar error de conversión de tipos (NaN)
        else if (
          error.error?.message?.includes('NaN') ||
          error.error?.message?.includes('NumberFormatException')
        ) {
          errorMessage =
            'Error al procesar los datos. Por favor, verifica que todos los campos estén completos.';
          showToast = true;
        }
      }

      // Mostrar mensaje de error solo si no es un error de login
      if (showToast && error.status !== 401) {
        const detailedMessage = error.error?.message || errorMessage;
        toastr.error(detailedMessage, 'Error');
      }

      return throwError(() => error);
    })
  );
};
