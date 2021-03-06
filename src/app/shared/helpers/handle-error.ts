import { HttpErrorResponse } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';

export const HTTP_ERROR_HANDLER = new InjectionToken<() => void>('');

export const handleErrorProvider = {
  provide: HTTP_ERROR_HANDLER,
  deps: [AlertService],
  useFactory: (alert: AlertService) => {
    return (err: HttpErrorResponse, errMsg?: Record<number, any>) => {
      let errorMessage = 'An unknown error occurred!';
      if (!err.status) {
        alert.show(errorMessage);
        return throwError(errorMessage);
      }

      if (errMsg && err.status in errMsg) {
        alert.show(errMsg[err.status]);

        return throwError(errMsg[err.status]);
      }

      alert.show(errorMessage);
      return throwError(errorMessage);
    };
  },
};
