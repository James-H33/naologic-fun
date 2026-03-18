import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap, timer } from 'rxjs';
import {
  addWorkCenters,
  addWorkCentersSuccess,
  createWorkCenter,
  createWorkCenterSuccess,
  loadWorkCenters,
  loadWorkCentersSuccess,
} from './work-center.actions';
import { inject } from '@angular/core';
import { concatLatestFrom } from '@ngrx/operators';
import { selectWorkCenters } from './work-center.selectors';
import { Store } from '@ngrx/store';
import { setDataInStorageByKey } from '@common/utils/set-data-in-storage-by-key.function';
import { WorkCenterDocument } from '@common/types/work-center-document.interface';

export const loadWorkCenters$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(loadWorkCenters),
      switchMap(() => {
        const workCentersKey = `nl-workcenters`;

        const workCenters: WorkCenterDocument[] =
          JSON.parse(localStorage.getItem(workCentersKey) ?? 'null') ?? [];

        return [loadWorkCentersSuccess({ workCenters })];
      }),
    );
  },
  { functional: true },
);

export const createWorkCenter$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      ofType(createWorkCenter),
      concatLatestFrom(() => [store.select(selectWorkCenters)]),
      switchMap(([, workCenters]) => {
        return timer(300).pipe(map(() => createWorkCenterSuccess({ workCenters })));
      }),
    ),
  { functional: true },
);

export const addWorkCenter$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      ofType(addWorkCenters),
      concatLatestFrom(() => [store.select(selectWorkCenters)]),
      switchMap(([{ workCenters }, currentWorkCenters]) => {
        return timer(300).pipe(
          map(() => {
            const updatedWorkCenters = [...currentWorkCenters, ...workCenters];
            return addWorkCentersSuccess({ workCenters: updatedWorkCenters });
          }),
        );
      }),
    ),
  { functional: true },
);

export const saveWorkCentersToStorage$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(createWorkCenterSuccess, addWorkCentersSuccess),
      concatLatestFrom(() => [store.select(selectWorkCenters)]),
      tap(([, workCenters]) => {
        setDataInStorageByKey(`nl-workcenters`, workCenters);
      }),
    );
  },
  { functional: true, dispatch: false },
);
