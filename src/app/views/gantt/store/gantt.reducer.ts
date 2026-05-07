import { FormError } from '@common/types/form-error.interface';
import { NewWorkCenter } from '@common/types/new-work-center.interface';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { Timescale, TimescaleConfig, TimescalesConfig } from '@common/types/timescales';
import { createFeature, createReducer, on } from '@ngrx/store';
import { GanttActions } from './gantt.actions';

interface GanttState {
  name: string | null;
  viewId: string | null;
  workOrderIds: string[];
  workCenterIds: string[];
  timescaleConfig: TimescaleConfig;
  workCenterFormOpen: boolean;
  workOrderFormOpen: boolean;
  editWorkOrderFormOpen: boolean;
  newWorkOrder: NewWorkOrder | null;
  newWorkCenter: NewWorkCenter | null;
  editingWorkOrderId: string | null;
  formError: FormError | null;
}

const initialGanttState: GanttState = {
  viewId: null,
  name: null,
  workOrderIds: [],
  workCenterIds: [],
  timescaleConfig: TimescalesConfig[Timescale.Week],
  workCenterFormOpen: false,
  workOrderFormOpen: false,
  editWorkOrderFormOpen: false,
  newWorkOrder: null,
  newWorkCenter: null,
  editingWorkOrderId: null,
  formError: null,
};

export const ganttFeature = createFeature({
  name: 'gantt',
  reducer: createReducer<GanttState>(
    initialGanttState,
    on(GanttActions.loadViewDataStart, (state, { viewId }) => {
      return {
        ...state,
        workOrderIds: [],
        workCenterIds: [],
        name: null,
        viewId,
      };
    }),

    on(GanttActions.loadViewDataSuccess, (state, { workOrderIds, workCenterIds, name }) => {
      return {
        ...state,
        workOrderIds,
        workCenterIds,
        name,
      };
    }),

    on(GanttActions.loadTimeScaleConfigSuccess, (state, { config }) => {
      return {
        ...state,
        timescaleConfig: config,
      };
    }),

    on(GanttActions.setTimescaleConfig, (state, { config }) => {
      return {
        ...state,
        timescaleConfig: config,
      };
    }),

    on(GanttActions.createWorkOrderSuccess, (state, { workOrderId, workCenterId }) => {
      return {
        ...state,
        workOrderIds: [...state.workOrderIds, workOrderId],
        // If the work center for the new work order isn't already in the list of work centers for the view, add it
        workCenterIds: state.workCenterIds.includes(workCenterId)
          ? state.workCenterIds
          : [...state.workCenterIds, workCenterId],
      };
    }),

    on(GanttActions.deleteWorkOrderSuccess, (state, { workOrderId }) => {
      return {
        ...state,
        workOrderIds: state.workOrderIds.filter((id) => id !== workOrderId),
      };
    }),

    on(GanttActions.createWorkCenterSuccess, (state, { workCenterId }) => {
      return {
        ...state,
        workCenterIds: [...state.workCenterIds, workCenterId],
      };
    }),

    on(GanttActions.openWorkCenterForm, (state) => {
      return {
        ...state,
        workCenterFormOpen: true,
        newWorkCenter: {
          name: '',
        },
        formError: null,
      };
    }),

    on(GanttActions.closeWorkCenterForm, (state) => {
      return {
        ...state,
        workCenterFormOpen: false,
      };
    }),

    on(GanttActions.openWorkOrderForm, (state, { workCenterId, date }) => {
      return {
        ...state,
        workOrderFormOpen: true,
        newWorkOrder: {
          title: '',
          startDate: date,
          endDate: date,
          status: 'open',
          workCenterId: workCenterId,
        },
        formError: null,
      };
    }),

    on(GanttActions.closeWorkOrderForm, (state) => {
      return {
        ...state,
        workOrderFormOpen: false,
      };
    }),

    on(GanttActions.openEditWorkOrderForm, (state, { workOrderId }) => {
      return {
        ...state,
        editWorkOrderFormOpen: true,
        editingWorkOrderId: workOrderId,
        formError: null,
      };
    }),

    on(GanttActions.closeEditWorkOrderForm, (state) => {
      return {
        ...state,
        editWorkOrderFormOpen: false,
        editingWorkOrderId: null,
      };
    }),

    on(GanttActions.setFormError, (state, { error }) => {
      return {
        ...state,
        formError: error,
      };
    }),
  ),
});
