import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

let activeRequests = 0;
let spinnerTimeout: any = null;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);

  activeRequests++;

  // Solo mostrar spinner si la petición tarda más de 500ms
  if (activeRequests === 1) {
    spinnerTimeout = setTimeout(() => {
      spinner.show();
    }, 500);
  }

  return next(req).pipe(
    finalize(() => {
      activeRequests--;

      // Ocultar spinner solo cuando no hay peticiones activas
      if (activeRequests === 0) {
        if (spinnerTimeout) {
          clearTimeout(spinnerTimeout);
          spinnerTimeout = null;
        }
        spinner.hide();
      }
    })
  );
};
