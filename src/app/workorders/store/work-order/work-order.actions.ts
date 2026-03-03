import { createAction, props } from '@ngrx/store';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { WorkCenterDocument } from '@common/types/work-center-documnet.interface';
import { TimescaleConfig } from '@common/types/timescales';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { FormError } from '@common/types/form-error.interface';

export const loadWorkOrdersStart = createAction(
  '[Workorders] Load Work Orders Start',
  props<{ viewId: string }>(),
);

export const loadWorkOrdersSuccess = createAction(
  '[Workorders] Load Work Orders Success',
  props<{
    workOrders: WorkOrderDocument[];
    workCenters: WorkCenterDocument[];
  }>(),
);

export const loadTimeScaleConfigStart = createAction(
  '[Workorders] Load Timescale Config Start',
  props<{ viewId: string }>(),
);

export const loadTimeScaleConfigSuccess = createAction(
  '[Workorders] Load Timescale Config Success',
  props<{
    config: TimescaleConfig;
  }>(),
);

export const setTimescaleConfig = createAction(
  '[Workorders] Set Timescale Config',
  props<{
    viewId: string;
    config: TimescaleConfig;
  }>(),
);

export const setTimescaleConfigSuccess = createAction(
  '[Workorders] Set Timescale Config Success',
  props<{
    config: TimescaleConfig;
  }>(),
);

export const setWorkOrderFormOpenState = createAction(
  '[Workorders] Set Work Order Form Open State',
  props<{
    open: boolean;
  }>(),
);

export const openCreateWorkOrderForm = createAction(
  '[Workorders] Open Create Work Order Form',
  props<{
    date: Date;
    workCenterId: string;
  }>(),
);

export const createWorkOrder = createAction(
  '[Workorders] Create Work Order',
  props<{
    workOrder: NewWorkOrder;
  }>(),
);

export const createWorkOrderSuccess = createAction(
  '[Workorders] Create Work Order Success',
  props<{
    workOrders: WorkOrderDocument[];
  }>(),
);

export const createWorkOrderFailure = createAction(
  '[Workorders] Create Work Order Failure',
  props<{
    error: FormError;
  }>(),
);
