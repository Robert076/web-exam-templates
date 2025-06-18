import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  // Only intercept API requests
  if (!request.url.includes('/api/')) {
    return next(request);
  }

  // For session-based authentication, we need to include credentials
  // This is handled by setting withCredentials: true in the HTTP calls
  // The session cookie will be automatically included by the browser

  return next(request);
};
