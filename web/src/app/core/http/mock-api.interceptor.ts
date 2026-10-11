import { HttpInterceptorFn } from '@angular/common/http';

import { environment } from '@env/environment';
import { authMockHandler } from './mock/auth.mock';
import { MockHandler } from './mock/mock-utils';

const handlers: MockHandler[] = [authMockHandler];

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMock || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const path = req.url.slice(environment.apiUrl.length);

  for (const handler of handlers) {
    const response = handler(req, path);
    if (response) {
      return response;
    }
  }

  return next(req);
};