import { inject } from '@angular/core';
import { TimescalesConfig, Timescale } from '@common/types/timescales';
import {
  fakeWorkOrders,
  fakeWorkCenters,
  WorkOrderDocument,
} from '@common/types/work-order-document.interface';
import { loadFromStorageByKey } from '@common/utils/load-from-storage-by-key.function';
import { setDataInStorageByKey } from '@common/utils/set-data-in-storage-by-key.function';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, timer, map } from 'rxjs';
import { GanttActions } from './gantt.actions';
import { WorkCenterDocument } from '@common/types/work-center-document.interface';
import { WorkCenterActions } from '@common/store/work-centers/work-center.actions';
import { WorkOrderActions } from '@common/store/work-order/work-order.actions';

/**
 * Payload
 * {
 *    viewId: string;
 *    workCenterIds: string[];
 *    workOrderIds: string[];
 * }
 *
 * 1. Pull work orders and work centers that may have been stored in local storage
 * 2. Make API call to get work orders and work centers for the view that weren't in local storage (if applicable)
 * 3. Dispatch actions to add work orders and work centers to the store
 *
 */

export const loadWorkorders$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(GanttActions.loadWorkOrdersStart),
      switchMap((action) => {
        const { viewId } = action;
        const workOrdersKey = `workorders_view_${viewId}`;
        const workCentersKey = `workcenters_view_${viewId}`;

        const workorders: WorkOrderDocument[] =
          loadFromStorageByKey(workOrdersKey) ?? fakeWorkOrders;
        const workCenters: WorkCenterDocument[] =
          loadFromStorageByKey(workCentersKey) ?? fakeWorkCenters;

        const workOrderIds = workorders.map((wo) => wo.docId);
        const workCenterIds = workCenters.map((wc) => wc.docId);

        return timer(200).pipe(
          switchMap(() => [
            GanttActions.loadWorkOrdersSuccessForGantt({
              workOrderIds,
              workCenterIds,
            }),
          ]),
        );
      }),
    );
  },
  { functional: true },
);

export const loadTimeScaleConfig$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(GanttActions.loadTimeScaleConfigStart),
      switchMap((action) => {
        const { viewId } = action;
        const configKey = `workorder_config_view_${viewId}`;

        const config = loadFromStorageByKey(configKey);

        return timer(200).pipe(
          map(() =>
            GanttActions.loadTimeScaleConfigSuccess({
              config: config ?? TimescalesConfig[Timescale.Week],
            }),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const setTimescaleConfig$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(GanttActions.setTimescaleConfig),
      switchMap((action) => {
        const { viewId } = action;
        const configKey = `workorder_config_view_${viewId}`;

        setDataInStorageByKey(configKey, action.config);

        return timer(200).pipe(
          map(() =>
            GanttActions.setTimescaleConfigSuccess({
              config: action.config ?? TimescalesConfig[Timescale.Week],
            }),
          ),
        );
      }),
    );
  },
  { functional: true },
);
