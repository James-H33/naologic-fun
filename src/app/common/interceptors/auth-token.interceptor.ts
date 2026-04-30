import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApplicationService } from '@common/services/application.service';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const appService = inject(ApplicationService);
  const authToken = appService.getAuthToken() ?? '';

  // Clone the request to add the new header
  const modifiedReq = req.clone({
    headers: req.headers.set('authorization', `Bearer ${authToken}`),
  });

  // Pass the cloned request to the next handler
  return next(modifiedReq);
};
