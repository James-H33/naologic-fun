import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { TimescaleConfig } from '@common/types/timescales';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { createActionGroup, props } from '@ngrx/store';

export const GanttActions = createActionGroup({
  source: 'Gantt',
  events: {
    loadViewDataStart: props<{ viewId: string }>(),
    loadViewDataSuccess: props<{
      name: string;
      workOrderIds: string[];
      workCenterIds: string[];
    }>(),

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

    createWorkOrder: props<{ newWorkOrder: NewWorkOrder }>(),
    createWorkOrderSuccess: props<{
      workOrderId: string;
      workCenterId: string;
    }>(),

    updateWorkOrderDates: props<{ workOrder: WorkOrderDocument }>(),
    updateWorkOrderDatesSuccess: props<{
      workOrderId: string;
      workCenterId: string;
    }>(),
  },
});
