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
    setWorkOrderFormOpenState: props<{ open: boolean }>(),
    openCreateWorkOrderForm: props<{ date: Date; workCenterId: string }>(),
    openEditWorkOrderForm: props<{ workOrderId: string | null }>(),
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
