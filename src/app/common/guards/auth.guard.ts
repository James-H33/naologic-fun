import { inject } from '@angular/core';
import { ApplicationService } from '@common/services/application.service';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const appService = inject(ApplicationService);
  const router = inject(Router);

  const authToken = appService.getAuthToken();

  if (!authToken) {
    router.navigate(['/login']);
    return false;
  }

  return !!authToken;
};
