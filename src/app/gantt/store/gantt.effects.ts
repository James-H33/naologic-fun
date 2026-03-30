import { inject } from '@angular/core';
import { WorkOrderService } from '@common/services/work-order.service';
import { WorkCenterActions } from '@common/store/work-centers/work-center.actions';
import { WorkOrderActions } from '@common/store/work-order/work-order.actions';
import { Timescale, TimescalesConfig } from '@common/types/timescales';
import { loadFromStorageByKey } from '@common/utils/load-from-storage-by-key.function';
import { setDataInStorageByKey } from '@common/utils/set-data-in-storage-by-key.function';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { combineLatest, map, switchMap, timer } from 'rxjs';
import { GanttService } from '../services/gantt.service';
import { GanttActions } from './gantt.actions';
import { WorkOrderAPIService } from '@common/services/api/work-order-api.service';
import { WorkCenterAPIService } from '@common/services/api/work-center-api.service';

export const loadWorkorders$ = createEffect(
  (
    actions$ = inject(Actions),
    ganttService = inject(GanttService),
    workOrderAPIService = inject(WorkOrderAPIService),
    workCenterAPIService = inject(WorkCenterAPIService),
  ) => {
    return actions$.pipe(
      ofType(GanttActions.loadViewDataStart),
      switchMap((action) => {
        const { viewId } = action;

        return getDataForView(viewId, ganttService, workOrderAPIService, workCenterAPIService).pipe(
          switchMap(({ workOrderIds, workCenterIds, workOrders, workCenters, name }) => {
            return [
              GanttActions.loadViewDataSuccess({ workOrderIds, workCenterIds, name }),
              WorkOrderActions.addWorkOrders({ workOrders }),
              WorkCenterActions.addWorkCenters({ workCenters }),
            ];
          }),
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

export const createWorkOrder$ = createEffect(
  (actions$ = inject(Actions), workOrderService = inject(WorkOrderService)) => {
    return actions$.pipe(
      ofType(GanttActions.createWorkOrder),
      switchMap((action) => {
        const { newWorkOrder } = action;

        return workOrderService.createWorkOrder(newWorkOrder).pipe(
          switchMap(({ result, error }) => {
            if (error) {
              return [WorkOrderActions.createWorkOrderFailure({ error })];
            }

            return [
              GanttActions.createWorkOrderSuccess({
                workOrderId: result!.docId,
                workCenterId: newWorkOrder.workCenterId as string,
              }),
              WorkOrderActions.setWorkOrderFormOpenState({
                open: false,
              }),
              WorkOrderActions.addWorkOrders({
                workOrders: [result!],
              }),
            ];
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const updateWorkOrderDates$ = createEffect(
  (actions$ = inject(Actions), workOrderService = inject(WorkOrderService)) => {
    return actions$.pipe(
      ofType(GanttActions.updateWorkOrderDates),
      switchMap((action) => {
        const { workOrder } = action;

        return workOrderService.updateWorkOrder(workOrder).pipe(
          switchMap(({ result, error }) => {
            // if (error) {
            //   return [WorkOrderActions.updateWorkOrderFailure({ error })];
            // }

            return [
              GanttActions.updateWorkOrderDatesSuccess({
                workOrderId: result!.docId,
                workCenterId: workOrder.data.workCenterId as string,
              }),
              WorkOrderActions.addWorkOrders({
                workOrders: [result!],
              }),
            ];
          }),
        );
      }),
    );
  },
  { functional: true },
);

function getDataForView(
  viewId: string,
  ganttService: GanttService,
  workOrderAPIService: WorkOrderAPIService,
  workCenterAPIService: WorkCenterAPIService,
) {
  return ganttService.getViewData(viewId).pipe(
    switchMap(({ workOrderIds, workCenterIds, ...data }) => {
      return combineLatest([
        workOrderAPIService.getWorkOrders(workOrderIds),
        workCenterAPIService.getWorkCenters(workCenterIds),
      ]).pipe(
        map(([workOrders, workCenters]) => {
          return {
            ...data,
            workOrderIds,
            workCenterIds,
            workOrders,
            workCenters,
          };
        }),
      );
    }),
  );
}
