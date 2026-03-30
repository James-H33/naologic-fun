import { inject } from '@angular/core';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { getDateAsISOString } from '@common/utils/get-date-as-iso-string.function';
import { setDataInStorageByKey } from '@common/utils/set-data-in-storage-by-key.function';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { WorkOrderActions } from './work-order.actions';

import {
  selectWorkOrders,
  selectWorkOrdersGroupedByWorkCenter,
  selectWorkOrdersMap,
} from './work-order.selectors';
import { WorkOrderAPIService } from '@common/services/api/work-order-api.service';
import { CreateWorkOrderDto } from '@common/types/create-work-order.dto';
import { WorkOrderService } from '@common/services/work-order.service';

export const loadWorkOrders$ = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(WorkOrderActions.loadWorkOrders),
      switchMap(() => {
        const workOrdersKey = `nl-workorders`;

        const workOrders: WorkOrderDocument[] =
          JSON.parse(localStorage.getItem(workOrdersKey) ?? 'null') ?? [];

        return [WorkOrderActions.loadWorkOrdersSuccess({ workOrders })];
      }),
    );
  },
  { functional: true },
);

export const createWorkOrder$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    workOrderService = inject(WorkOrderService),
  ) => {
    return actions$.pipe(
      ofType(WorkOrderActions.createWorkOrder),
      concatLatestFrom(() => [store.select(selectWorkOrders)]),
      switchMap(([action, workOrders]) => {
        const { workOrder } = action;

        return workOrderService.createWorkOrder(workOrder).pipe(
          map(({ result, error }) => {
            if (error) {
              return WorkOrderActions.createWorkOrderFailure({ error });
            }

            const updatedWorkOrders = [...workOrders, result!];

            return WorkOrderActions.createWorkOrderSuccess({ workOrders: updatedWorkOrders });
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
      ofType(WorkOrderActions.editWorkOrder),
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
              WorkOrderActions.editWorkOrderFailure({
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

            return WorkOrderActions.editWorkOrderSuccess({ workOrders: updatedWorkOrders });
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
      ofType(WorkOrderActions.deleteWorkOrder),
      concatLatestFrom(() => store.select(selectWorkOrders)),
      switchMap(([action, workOrders]) => {
        const { workOrderId } = action;

        const updatedWorkOrders = workOrders.filter((wo) => wo.docId !== workOrderId);

        return timer(200).pipe(
          map(() => {
            return WorkOrderActions.deleteWorkOrderSuccess({ workOrders: updatedWorkOrders });
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const addWorkOrders$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) =>
    actions$.pipe(
      ofType(WorkOrderActions.addWorkOrders),
      concatLatestFrom(() => [store.select(selectWorkOrders), store.select(selectWorkOrdersMap)]),
      switchMap(([{ workOrders }, currentWorkOrders, currentWorkOrdersMap]) => {
        return timer(300).pipe(
          map(() => {
            const netNewWorkOrders: WorkOrderDocument[] = [];
            const updatedWorkOrdersMap = new Map<string, WorkOrderDocument>();

            for (const wo of workOrders) {
              updatedWorkOrdersMap.set(wo.docId, wo);

              if (!currentWorkOrdersMap[wo.docId]) {
                netNewWorkOrders.push(wo);
              }
            }

            const updatedCurrentWorkOrders = currentWorkOrders.map((wo) =>
              updatedWorkOrdersMap.has(wo.docId) ? updatedWorkOrdersMap.get(wo.docId)! : wo,
            );

            const updatedWorkOrders = [...updatedCurrentWorkOrders, ...netNewWorkOrders];

            return WorkOrderActions.addWorkOrdersSuccess({ workOrders: updatedWorkOrders });
          }),
        );
      }),
    ),
  { functional: true },
);

export const saveWorkOrdersToStorage$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(
        WorkOrderActions.createWorkOrderSuccess,
        WorkOrderActions.editWorkOrderSuccess,
        WorkOrderActions.deleteWorkOrderSuccess,
        WorkOrderActions.addWorkOrdersSuccess,
      ),
      concatLatestFrom(() => store.select(selectWorkOrders)),
      tap(([, workOrders]) => {
        setDataInStorageByKey(`nl-workorders`, workOrders);
      }),
    );
  },
  { functional: true, dispatch: false },
);
