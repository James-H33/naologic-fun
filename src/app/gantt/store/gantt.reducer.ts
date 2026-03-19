import { Timescale, TimescaleConfig, TimescalesConfig } from '@common/types/timescales';
import { createFeature, createReducer, on } from '@ngrx/store';
import { GanttActions } from './gantt.actions';

interface GanttState {
  viewId: string | null;
  workOrderIds: string[];
  workCenterIds: string[];
  timescaleConfig: TimescaleConfig;
}

const initialGanttState: GanttState = {
  viewId: null,
  workOrderIds: [],
  workCenterIds: [],
  timescaleConfig: TimescalesConfig[Timescale.Week],
};

export const ganttFeature = createFeature({
  name: 'gantt',
  reducer: createReducer<GanttState>(
    initialGanttState,
    on(GanttActions.loadWorkOrdersStart, (state, { viewId }) => {
      return {
        ...state,
        workOrderIds: [],
        workCenterIds: [],
        viewId,
      };
    }),

    on(GanttActions.loadWorkOrdersSuccessForGantt, (state, { workOrderIds, workCenterIds }) => {
      return {
        ...state,
        workOrderIds,
        workCenterIds,
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
  ),
});
