import { FormError } from '@common/types/form-error.interface';
import { NewWorkCenter } from '@common/types/new-work-center.interface';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { TimescaleConfig } from '@common/types/timescales';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

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

    setFormError: props<{ error: FormError | null }>(),

    createWorkOrder: props<{ newWorkOrder: NewWorkOrder }>(),
    createWorkOrderSuccess: props<{
      workOrderId: string;
      workCenterId: string;
    }>(),

    deleteWorkOrder: props<{ workOrderId: string }>(),
    deleteWorkOrderSuccess: props<{
      workOrderId: string;
    }>(),

    updateWorkOrderDates: props<{ workOrder: WorkOrderDocument }>(),
    updateWorkOrderDatesSuccess: props<{
      workOrderId: string;
      workCenterId: string;
    }>(),

    updateWorkOrder: props<{ workOrder: WorkOrderDocument }>(),
    updateWorkOrderSuccess: props<{
      workOrderId: string;
      workCenterId: string;
    }>(),

    createWorkCenter: props<{ newWorkCenter: NewWorkCenter }>(),
    createWorkCenterSuccess: props<{
      workCenterId: string;
    }>(),

    openEditWorkOrderForm: props<{ workOrderId: string | null }>(),
    closeEditWorkOrderForm: emptyProps(),

    openWorkCenterForm: emptyProps(),
    closeWorkCenterForm: emptyProps(),

    openWorkOrderForm: props<{ date: Date; workCenterId: string }>(),
    closeWorkOrderForm: emptyProps(),

    getUpdatedWorkOrders: props<{ viewId: string; updatedIds: string[] }>(),
  },
});
