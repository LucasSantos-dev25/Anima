import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, delay, of, switchMap, throwError, timer } from 'rxjs';

/**
 * Um handler recebe a requisição e o caminho (sem o prefixo da API).
 * Devolve a resposta simulada, ou null se a rota não for dele.
 */
export type MockHandler = (
  req: HttpRequest<unknown>,
  path: string,
) => Observable<HttpResponse<unknown>> | null;

const LATENCY_MS = 350;

export function mockOk<T>(body: T, status = 200): Observable<HttpResponse<T>> {
  return of(new HttpResponse<T>({ status, body })).pipe(delay(LATENCY_MS));
}

export function mockFail(status: number, message: string): Observable<never> {
  return timer(LATENCY_MS).pipe(
    switchMap(() =>
      throwError(
        () => new HttpErrorResponse({ status, statusText: message, error: { message } }),
      ),
    ),
  );
}