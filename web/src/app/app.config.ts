import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { authInterceptor } from '@core/auth/auth.interceptor';
import { errorInterceptor } from '@core/http/error.interceptor';
import { mockApiInterceptor } from '@core/http/mock-api.interceptor';
import { routes } from './app.routes';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    // Ordem: o token entra primeiro, os erros são tratados e o mock fica por último (simula o servidor).
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor, mockApiInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};