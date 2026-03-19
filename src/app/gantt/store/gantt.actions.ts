import { TimescaleConfig } from '@common/types/timescales';
import { createActionGroup, props } from '@ngrx/store';

export const GanttActions = createActionGroup({
  source: 'Gantt',
  events: {
    loadWorkOrdersStart: props<{ viewId: string }>(),
    loadWorkOrdersSuccessForGantt: props<{
      workOrderIds: string[];
      workCenterIds: string[];
    }>(),
    loadTimeScaleConfigStart: props<{ viewId: string }>(),
    loadTimeScaleConfigSuccess: props<{
      config: TimescaleConfig;
    }>(),
    setTimescaleConfig: props<{
      viewId: string;
      config: TimescaleConfig;
    }>(),
    setTimescaleConfigSuccess: props<{
      config: TimescaleConfig;
    }>(),
  },
});
