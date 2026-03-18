import { FormError } from '@common/types/form-error.interface';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { WorkCenterDocument } from '@common/types/work-center-document.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  addWorkOrdersSuccess,
  createWorkOrderFailure,
  createWorkOrderSuccess,
  deleteWorkOrderSuccess,
  editWorkOrderFailure,
  editWorkOrderSuccess,
  loadWorkOrdersSuccess,
  openCreateWorkOrderForm,
  openEditWorkOrderForm,
  setWorkOrderFormOpenState,
} from './work-order.actions';

interface WorkOrderState {
  workOrders: WorkOrderDocument[];
  workCenters: WorkCenterDocument[];
  isCreateWorkOrderFormOpen: boolean;
  newWorkOrder: NewWorkOrder | null;
  newWorkOrderError: FormError | null;
  editWorkOrderError: FormError | null;
  editingWorkOrderId: string | null;
}

export const initialWorkOrderState: WorkOrderState = {
  workOrders: [],
  workCenters: [],
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

    on(loadWorkOrdersSuccess, (state, { workOrders }) => {
      return {
        ...state,
        workOrders,
      };
    }),

    on(addWorkOrdersSuccess, (state, { workOrders }) => {
      return {
        ...state,
        workOrders,
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
