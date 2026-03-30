import { Timescale, TimescaleConfig, TimescalesConfig } from '@common/types/timescales';
import { createFeature, createReducer, on } from '@ngrx/store';
import { GanttActions } from './gantt.actions';

interface GanttState {
  name: string | null;
  viewId: string | null;
  workOrderIds: string[];
  workCenterIds: string[];
  timescaleConfig: TimescaleConfig;
}

const initialGanttState: GanttState = {
  viewId: null,
  name: null,
  workOrderIds: [],
  workCenterIds: [],
  timescaleConfig: TimescalesConfig[Timescale.Week],
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
  ),
});
