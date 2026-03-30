import { inject } from '@angular/core';
import { ApplicationService } from '@common/services/application.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApplicationActions } from './application.actions';
import { map } from 'rxjs';

export const getWorkspaceId = createEffect(
  (actions$ = inject(Actions), appService = inject(ApplicationService)) => {
    return actions$.pipe(
      ofType(ApplicationActions.init),
      map(() => {
        const workspaceId = appService.getWorkspaceIdFromStorage();
        console.log('Retrieved workspace ID from storage:', workspaceId);
        return ApplicationActions.initSuccess({ workspaceId: workspaceId ?? '' });
      }),
    );
  },
  { functional: true },
);
