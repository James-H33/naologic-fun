import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { ApplicationService } from '@common/services/application.service';
import { of } from 'rxjs';

export const logoutResolver: ResolveFn<void> = () => {
  const appService = inject(ApplicationService);

  appService.logout();

  return of(undefined);
};
