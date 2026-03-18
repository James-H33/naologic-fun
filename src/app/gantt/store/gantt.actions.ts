import { TimescaleConfig } from '@common/types/timescales';
import { createAction, props } from '@ngrx/store';

export const loadWorkOrdersStart = createAction(
  '[Workorders] Load Work Orders Start',
  props<{ viewId: string }>(),
);

export const loadWorkOrdersSuccessForGantt = createAction(
  '[Workorders] Load Work Orders Success For Gantt',
  props<{
    workOrderIds: string[];
    workCenterIds: string[];
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
