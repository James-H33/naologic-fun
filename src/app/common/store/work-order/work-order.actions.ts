import { FormError } from '@common/types/form-error.interface';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { createAction, props } from '@ngrx/store';

export const loadWorkOrders = createAction('[Workorders] Load Work Orders');

export const loadWorkOrdersSuccess = createAction(
  '[Workorders] Load Work Orders Success',
  props<{
    workOrders: WorkOrderDocument[];
  }>(),
);

export const addWorkOrders = createAction(
  '[Workorders] Add Work Orders',
  props<{
    workOrders: WorkOrderDocument[];
  }>(),
);

export const addWorkOrdersSuccess = createAction(
  '[Workorders] Add Work Orders Success',
  props<{
    workOrders: WorkOrderDocument[];
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

export const openEditWorkOrderForm = createAction(
  '[Workorders] Open Edit Work Order Form',
  props<{
    workOrderId: string | null;
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

export const editWorkOrderFailure = createAction(
  '[Workorders] Edit Work Order Failure',
  props<{
    error: FormError;
  }>(),
);

export const editWorkOrder = createAction(
  '[Workorders] Edit Work Order',
  props<{
    workOrder: WorkOrderDocument;
  }>(),
);

export const editWorkOrderSuccess = createAction(
  '[Workorders] Edit Work Order Success',
  props<{
    workOrders: WorkOrderDocument[];
  }>(),
);

export const deleteWorkOrder = createAction(
  '[Workorders] Delete Work Order',
  props<{
    workOrderId: string;
  }>(),
);

export const deleteWorkOrderSuccess = createAction(
  '[Workorders] Delete Work Order Success',
  props<{
    workOrders: WorkOrderDocument[];
  }>(),
);
