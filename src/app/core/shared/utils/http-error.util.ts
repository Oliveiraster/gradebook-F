import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, catchError, OperatorFunction, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpErrorUtil {
  public handleError<T>(operation: string): OperatorFunction<T, T> {
    return catchError((error: HttpErrorResponse): Observable<never> => {
      const message =
        error.error?.message ||
        (error.status
          ? `Erro ${error.status} - ${error.statusText}`
          : 'Erro desconhecido na comunicação com o servidor');

      console.error(`Erro ao ${operation}:`, message, error);

      return throwError(() => new Error(`Erro ao ${operation}. ${message}`));
    }) as OperatorFunction<T, T>;
  }
}
