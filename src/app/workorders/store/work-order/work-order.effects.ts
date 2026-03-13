import { inject } from '@angular/core';
import { Timescale, TimescalesConfig } from '@common/types/timescales';
import {
  fakeWorkCenters,
  fakeWorkOrders,
  WorkOrderDocument,
} from '@common/types/work-order-document.interface';
import { getDateAsISOString } from '@common/utils/get-date-as-iso-string.function';
import { loadFromStorageByKey } from '@common/utils/load-from-storage-by-key.function';
import { setDataInStorageByKey } from '@common/utils/set-data-in-storage-by-key.function';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  createWorkOrder,
  createWorkOrderFailure,
  createWorkOrderSuccess,
  deleteWorkOrder,
  deleteWorkOrderSuccess,
  editWorkOrder,
  editWorkOrderFailure,
  editWorkOrderSuccess,
  loadTimeScaleConfigStart,
  loadTimeScaleConfigSuccess,
  loadWorkOrdersStart,
  loadWorkOrdersSuccess,
  setTimescaleConfig,
  setTimescaleConfigSuccess,
} from './work-order.actions';
import {
  selectViewId,
  selectWorkCenters,
  selectWorkOrders,
  selectWorkOrdersGroupedByWorkCenter,
} from './work-order.selectors';

export const loadWorkorders$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(loadWorkOrdersStart),
      switchMap((action) => {
        const { viewId } = action;
        const workOrdersKey = `workorders_view_${viewId}`;
        const workCentersKey = `workcenters_view_${viewId}`;

        const workorders = loadFromStorageByKey(workOrdersKey) ?? fakeWorkOrders;
        const workCenters = loadFromStorageByKey(workCentersKey) ?? fakeWorkCenters;

        return timer(200).pipe(
          map(() =>
            loadWorkOrdersSuccess({
              workOrders: workorders,
              workCenters: workCenters,
            }),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const loadTimeScaleConfig$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(loadTimeScaleConfigStart),
      switchMap((action) => {
        const { viewId } = action;
        const configKey = `workorder_config_view_${viewId}`;

        const config = loadFromStorageByKey(configKey);

        return timer(200).pipe(
          map(() =>
            loadTimeScaleConfigSuccess({
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
      ofType(setTimescaleConfig),
      switchMap((action) => {
        const { viewId } = action;
        const configKey = `workorder_config_view_${viewId}`;

        setDataInStorageByKey(configKey, action.config);

        return timer(200).pipe(
          map(() =>
            setTimescaleConfigSuccess({
              config: action.config ?? TimescalesConfig[Timescale.Week],
            }),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const createWorkOrder$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(createWorkOrder),
      concatLatestFrom(() => [
        store.select(selectWorkOrders),
        store.select(selectWorkOrdersGroupedByWorkCenter),
      ]),
      switchMap(([action, workOrders, workOrdersGroupedByWorkCenter]) => {
        const { workOrder } = action;
        const workOrdersForWorkCenter =
          workOrdersGroupedByWorkCenter[workOrder.workCenterId as string] ?? [];

        const startDate = moment(workOrder.startDate);
        const endDate = moment(workOrder.endDate);

        for (const wo of workOrdersForWorkCenter) {
          const start = moment(wo.data.startDate);
          const end = moment(wo.data.endDate);

          const overlaps =
            startDate.isBetween(start, end, undefined, '[]') ||
            endDate.isBetween(start, end, undefined, '[]') ||
            start.isBetween(startDate, endDate, undefined, '[]') ||
            end.isBetween(startDate, endDate, undefined, '[]');

          if (overlaps) {
            return [
              createWorkOrderFailure({
                error: {
                  message:
                    'Work order dates overlap with existing work order for the same work center.',
                  fields: {
                    startDate: 'Start date overlaps with existing work order.',
                    endDate: 'End date overlaps with existing work order.',
                  },
                },
              }),
            ];
          }
        }

        const newWorkOrder: WorkOrderDocument = {
          docId: `wo-${Math.floor(Math.random() * 10000)}`,
          docType: 'workOrder',
          data: {
            name: workOrder.title,
            startDate: getDateAsISOString(workOrder.startDate),
            endDate: getDateAsISOString(workOrder.endDate),
            status: workOrder.status,
            workCenterId: workOrder.workCenterId as string,
          },
        };

        return timer(200).pipe(
          map(() => {
            const updatedWorkOrders = [...workOrders, newWorkOrder];

            return createWorkOrderSuccess({ workOrders: updatedWorkOrders });
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const editWorkOrder$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(editWorkOrder),
      concatLatestFrom(() => [
        store.select(selectWorkOrders),
        store.select(selectWorkOrdersGroupedByWorkCenter),
      ]),
      switchMap(([action, workOrders, workOrdersGroupedByWorkCenter]) => {
        const { workOrder } = action;
        const { docId, data } = workOrder;
        const workOrdersForWorkCenter =
          workOrdersGroupedByWorkCenter[data.workCenterId as string] ?? [];

        const startDate = moment(data.startDate);
        const endDate = moment(data.endDate);

        for (const wo of workOrdersForWorkCenter) {
          if (wo.docId === docId) {
            continue;
          }

          const start = moment(wo.data.startDate);
          const end = moment(wo.data.endDate);

          const overlaps =
            startDate.isBetween(start, end, undefined, '[]') ||
            endDate.isBetween(start, end, undefined, '[]') ||
            start.isBetween(startDate, endDate, undefined, '[]') ||
            end.isBetween(startDate, endDate, undefined, '[]');

          if (overlaps) {
            return [
              editWorkOrderFailure({
                error: {
                  message:
                    'Work order dates overlap with existing work order for the same work center.',
                  fields: {
                    startDate: 'Start date overlaps with existing work order.',
                    endDate: 'End date overlaps with existing work order.',
                  },
                },
              }),
            ];
          }
        }

        const updatedWorkOrder: WorkOrderDocument = {
          ...workOrder,
          data: {
            ...data,
          },
        };

        return timer(200).pipe(
          map(() => {
            const updatedWorkOrders = workOrders.map((wo) =>
              wo.docId === docId ? updatedWorkOrder : wo,
            );

            return editWorkOrderSuccess({ workOrders: updatedWorkOrders });
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const deleteWorkOrder$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(deleteWorkOrder),
      concatLatestFrom(() => [store.select(selectWorkOrders)]),
      switchMap(([action, workOrders]) => {
        const { workOrderId } = action;

        const updatedWorkOrders = workOrders.filter((wo) => wo.docId !== workOrderId);

        return timer(200).pipe(
          map(() => {
            return deleteWorkOrderSuccess({ workOrders: updatedWorkOrders });
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const saveWorkOrdersToStorage$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(createWorkOrderSuccess, editWorkOrderSuccess, deleteWorkOrderSuccess),
      concatLatestFrom(() => [
        store.select(selectWorkOrders),
        store.select(selectWorkCenters),
        store.select(selectViewId),
      ]),
      tap(([, workOrders, workCenters, viewId]) => {
        setDataInStorageByKey(`workorders_view_${viewId}`, workOrders);
        setDataInStorageByKey(`workcenters_view_${viewId}`, workCenters);
      }),
    );
  },
  { functional: true, dispatch: false },
);
