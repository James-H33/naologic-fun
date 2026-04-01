import { FormError } from '@common/types/form-error.interface';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const WorkOrderActions = createActionGroup({
  source: 'WorkOrder',
  events: {
    loadWorkOrders: emptyProps(),
    loadWorkOrdersSuccess: props<{ workOrders: WorkOrderDocument[] }>(),
    addWorkOrders: props<{ workOrders: WorkOrderDocument[] }>(),
    addWorkOrdersSuccess: props<{ workOrders: WorkOrderDocument[] }>(),

    removeWorkOrders: props<{ workOrderIds: string[] }>(),
    removeWorkOrdersSuccess: props<{ workOrders: WorkOrderDocument[] }>(),

    createWorkOrder: props<{ workOrder: NewWorkOrder }>(),
    createWorkOrderSuccess: props<{ workOrders: WorkOrderDocument[] }>(),
    createWorkOrderFailure: props<{ error: FormError }>(),

    editWorkOrder: props<{ workOrder: WorkOrderDocument }>(),
    editWorkOrderSuccess: props<{ workOrders: WorkOrderDocument[] }>(),
    editWorkOrderFailure: props<{ error: FormError }>(),

    deleteWorkOrder: props<{ workOrderId: string }>(),
    deleteWorkOrderSuccess: props<{ workOrders: WorkOrderDocument[] }>(),
  },
});
