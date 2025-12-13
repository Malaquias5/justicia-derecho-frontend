import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
  spinner.show();

  return next(req).pipe(
    finalize(() => {
      spinner.hide();
    })
  );
};
