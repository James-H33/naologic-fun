import { FormError } from '@common/types/form-error.interface';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { WorkOrderActions } from './work-order.actions';

interface WorkOrderState {
  workOrders: WorkOrderDocument[];
  isCreateWorkOrderFormOpen: boolean;
  newWorkOrder: NewWorkOrder | null;
  newWorkOrderError: FormError | null;
  editWorkOrderError: FormError | null;
  editingWorkOrderId: string | null;
}

export const initialWorkOrderState: WorkOrderState = {
  workOrders: [],
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

    on(WorkOrderActions.loadWorkOrdersSuccess, (state, { workOrders }) => {
      return {
        ...state,
        workOrders,
      };
    }),

    on(WorkOrderActions.addWorkOrdersSuccess, (state, { workOrders }) => {
      return {
        ...state,
        workOrders,
      };
    }),

    on(WorkOrderActions.setWorkOrderFormOpenState, (state, { open }) => {
      return {
        ...state,
        isCreateWorkOrderFormOpen: open,
      };
    }),

    on(WorkOrderActions.openCreateWorkOrderForm, (state, { date, workCenterId }) => {
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

    on(WorkOrderActions.createWorkOrderSuccess, (state, { workOrders }) => {
      return {
        ...state,
        workOrders: workOrders,
        isCreateWorkOrderFormOpen: false,
        newWorkOrder: null,
        newWorkOrderError: null,
      };
    }),

    on(WorkOrderActions.editWorkOrderSuccess, (state, { workOrders }) => {
      return {
        ...state,
        workOrders: workOrders,
        editingWorkOrderId: null,
        editWorkOrderError: null,
      };
    }),

    on(WorkOrderActions.createWorkOrderFailure, (state, { error }) => {
      return {
        ...state,
        newWorkOrderError: error,
      };
    }),

    on(WorkOrderActions.editWorkOrderFailure, (state, { error }) => {
      return {
        ...state,
        editWorkOrderError: error,
      };
    }),

    on(WorkOrderActions.deleteWorkOrderSuccess, (state, { workOrders }) => {
      return {
        ...state,
        workOrders: workOrders,
      };
    }),

    on(WorkOrderActions.openEditWorkOrderForm, (state, { workOrderId }) => {
      return {
        ...state,
        editingWorkOrderId: workOrderId,
        editWorkOrderError: null,
      };
    }),
  ),
});
