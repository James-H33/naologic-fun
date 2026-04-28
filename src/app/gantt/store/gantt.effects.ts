import { inject } from '@angular/core';
import { WorkCenterAPIService } from '@common/services/api/work-center-api.service';
import { WorkOrderAPIService } from '@common/services/api/work-order-api.service';
import { WorkOrderService } from '@common/services/work-order.service';
import { WorkCenterActions } from '@common/store/work-centers/work-center.actions';
import { WorkOrderActions } from '@common/store/work-order/work-order.actions';
import { Timescale, TimescalesConfig } from '@common/types/timescales';
import { loadFromStorageByKey } from '@common/utils/load-from-storage-by-key.function';
import { setDataInStorageByKey } from '@common/utils/set-data-in-storage-by-key.function';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, filter, map, switchMap, timer } from 'rxjs';
import { GanttService } from '../services/gantt.service';
import { GanttActions } from './gantt.actions';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { selectViewId } from './gantt.selectors';
import { selectWorkOrders } from '@common/store/work-order/work-order.selectors';

export const loadWorkorders$ = createEffect(
  (actions$ = inject(Actions), ganttService = inject(GanttService)) => {
    return actions$.pipe(
      ofType(GanttActions.loadViewDataStart),
      switchMap((action) => {
        const { viewId } = action;

        return ganttService.getFullViewData(viewId).pipe(
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
              return [GanttActions.setFormError({ error })];
            }

            return [
              GanttActions.createWorkOrderSuccess({
                workOrderId: result!.docId,
                workCenterId: newWorkOrder.workCenterId as string,
              }),
              GanttActions.closeWorkOrderForm(),
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
            if (error) {
              return [GanttActions.setFormError({ error })];
            }

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

export const updateWorkOrder$ = createEffect(
  (actions$ = inject(Actions), workOrderService = inject(WorkOrderService)) => {
    return actions$.pipe(
      ofType(GanttActions.updateWorkOrder),
      switchMap((action) => {
        const { workOrder } = action;

        return workOrderService.updateWorkOrder(workOrder).pipe(
          switchMap(({ result, error }) => {
            if (error) {
              return [GanttActions.setFormError({ error })];
            }

            return [
              GanttActions.updateWorkOrderSuccess({
                workOrderId: result!.docId,
                workCenterId: workOrder.data.workCenterId as string,
              }),
              GanttActions.closeEditWorkOrderForm(),
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

export const createWorkCenter$ = createEffect(
  (actions$ = inject(Actions), workCenterAPIService = inject(WorkCenterAPIService)) =>
    actions$.pipe(
      ofType(GanttActions.createWorkCenter),
      switchMap((action) => {
        const { newWorkCenter } = action;

        return workCenterAPIService.createWorkCenter(newWorkCenter).pipe(
          switchMap((workCenterDocument) => {
            return [
              GanttActions.createWorkCenterSuccess({
                workCenterId: workCenterDocument.docId,
              }),
              GanttActions.closeWorkCenterForm(),
              WorkCenterActions.addWorkCenters({
                workCenters: [workCenterDocument],
              }),
            ];
          }),
        );
      }),
    ),
  { functional: true },
);

export const deleteWorkOrder$ = createEffect(
  (actions$ = inject(Actions), workOrderAPIService = inject(WorkOrderAPIService)) =>
    actions$.pipe(
      ofType(GanttActions.deleteWorkOrder),
      switchMap((action) => {
        const { workOrderId } = action;

        return workOrderAPIService.deleteWorkOrder(workOrderId).pipe(
          switchMap(() => {
            return [
              GanttActions.deleteWorkOrderSuccess({
                workOrderId,
              }),
              WorkOrderActions.removeWorkOrders({
                workOrderIds: [workOrderId],
              }),
            ];
          }),
        );
      }),
    ),
  { functional: true },
);

export const getWorkOrdersForView$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), ganttService = inject(GanttService)) =>
    actions$.pipe(
      ofType(GanttActions.getUpdatedWorkOrders),
      concatLatestFrom(() => [store.select(selectViewId), store.select(selectWorkOrders)]),
      switchMap(([action, viewId]) => {
        const { updatedIds } = action;
        const updatedIdsMap = Object.fromEntries(updatedIds.map((id) => [id, true]));

        return ganttService.getViewData(viewId as string).pipe(
          switchMap((viewData) => {
            const workOrderIds = viewData.workOrderIds.filter((id) => updatedIdsMap[id]);

            if (workOrderIds.length === 0) {
              return EMPTY;
            }

            return ganttService.workOrderAPIService.getWorkOrders(workOrderIds).pipe(
              map((workOrders) =>
                WorkOrderActions.addWorkOrders({
                  workOrders,
                }),
              ),
            );
          }),
        );
      }),
    ),
  { functional: true },
);
