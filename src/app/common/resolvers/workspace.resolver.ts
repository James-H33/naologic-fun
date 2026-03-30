import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { ApplicationService } from '@common/services/application.service';
import { filter } from 'rxjs/internal/operators/filter';
import { take } from 'rxjs/internal/operators/take';

export const workspaceIdResolver: ResolveFn<string> = () => {
  const appService = inject(ApplicationService);

  return appService.workspaceId$.pipe(
    filter((id) => !!id),
    take(1),
  ) as unknown as string;
};
