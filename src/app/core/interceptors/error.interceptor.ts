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
      
      if (error.status === 401) {
        errorMessage = 'Su sesión ha expirado';
        authService.logout();
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        errorMessage = 'No tiene permisos para realizar esta acción';
        router.navigate(['/']);
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      }

      // Mostrar mensaje de error
      if (error.status !== 401) {
        const detailedMessage = error.error?.message || errorMessage;
        toastr.error(detailedMessage, 'Error');
      }

      return throwError(() => error);
    })
  );
};
