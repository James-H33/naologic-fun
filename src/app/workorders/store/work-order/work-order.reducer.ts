import { Timescale, TimescaleConfig, TimescalesConfig } from '@common/types/timescales';
import { WorkCenterDocument } from '@common/types/work-center-documnet.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  createWorkOrderFailure,
  createWorkOrderSuccess,
  deleteWorkOrderSuccess,
  editWorkOrderFailure,
  editWorkOrderSuccess,
  loadTimeScaleConfigSuccess,
  loadWorkOrdersStart,
  loadWorkOrdersSuccess,
  openCreateWorkOrderForm,
  openEditWorkOrderForm,
  setTimescaleConfig,
  setWorkOrderFormOpenState,
} from './work-order.actions';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { FormError } from '@common/types/form-error.interface';

interface WorkOrderState {
  viewId: string | null;
  workOrders: WorkOrderDocument[];
  workCenters: WorkCenterDocument[];
  timescaleConfig: TimescaleConfig;
  isCreateWorkOrderFormOpen: boolean;
  newWorkOrder: NewWorkOrder | null;
  newWorkOrderError: FormError | null;
  editWorkOrderError: FormError | null;
  editingWorkOrderId: string | null;
}

export const initialWorkOrderState: WorkOrderState = {
  viewId: null,
  workOrders: [],
  workCenters: [],
  timescaleConfig: TimescalesConfig[Timescale.Week],
  isCreateWorkOrderFormOpen: false,
  newWorkOrder: null,
  newWorkOrderError: null,
  editWorkOrderError: null,
  editingWorkOrderId: null,
};

export const workOrderFeature = createFeature({
  name: 'workorder',
  reducer: createReducer<WorkOrderState>(
    initialWorkOrderState,

    on(loadWorkOrdersStart, (state, { viewId }) => {
      return {
        ...state,
        workOrders: [],
        workCenters: [],
        viewId,
      };
    }),

    on(loadWorkOrdersSuccess, (state, { workOrders, workCenters }) => {
      return {
        ...state,
        workOrders: workOrders,
        workCenters: workCenters,
      };
    }),

    on(loadTimeScaleConfigSuccess, (state, { config }) => {
      return {
        ...state,
        timescaleConfig: config,
      };
    }),

    on(setTimescaleConfig, (state, { config }) => {
      return {
        ...state,
        timescaleConfig: config,
      };
    }),

    on(setWorkOrderFormOpenState, (state, { open }) => {
      return {
        ...state,
        isCreateWorkOrderFormOpen: open,
      };
    }),

    on(openCreateWorkOrderForm, (state, { date, workCenterId }) => {
      return {
        ...state,
        isCreateWorkOrderFormOpen: true,
        newWorkOrder: {
          title: '',
          startDate: date,
          endDate: date,
          status: 'open',
          workCenterId: workCenterId,
        },
        newWorkOrderError: null,
      };
    }),

    on(createWorkOrderSuccess, (state, { workOrders }) => {
      return {
        ...state,
        workOrders: workOrders,
        isCreateWorkOrderFormOpen: false,
        newWorkOrder: null,
        newWorkOrderError: null,
      };
    }),

    on(editWorkOrderSuccess, (state, { workOrders }) => {
      return {
        ...state,
        workOrders: workOrders,
        editingWorkOrderId: null,
        editWorkOrderError: null,
      };
    }),

    on(createWorkOrderFailure, (state, { error }) => {
      return {
        ...state,
        newWorkOrderError: error,
      };
    }),

    on(editWorkOrderFailure, (state, { error }) => {
      return {
        ...state,
        editWorkOrderError: error,
      };
    }),

    on(deleteWorkOrderSuccess, (state, { workOrders }) => {
      return {
        ...state,
        workOrders: workOrders,
      };
    }),

    on(openEditWorkOrderForm, (state, { workOrderId }) => {
      return {
        ...state,
        editingWorkOrderId: workOrderId,
        editWorkOrderError: null,
      };
    }),
  ),
});
