import { ViewsAPIService } from '@common/services/api/views-api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { ViewsActions } from './views.actions';

export const loadTimelines$ = createEffect(
  (actions$ = inject(Actions), viewsService = inject(ViewsAPIService)) => {
    return actions$.pipe(
      ofType(ViewsActions.loadTimelines),
      switchMap(() => {
        return viewsService
          .getTimelines()
          .pipe(map((timelines) => ViewsActions.loadTimelinesSuccess({ timelines })));
      }),
    );
  },
  { functional: true },
);
