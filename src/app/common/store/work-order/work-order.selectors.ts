import { createSelector } from '@ngrx/store';
import { workOrderFeature } from './work-order.reducer';
import { WorkCenterDocument } from '@common/types/work-center-document.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';

export const {
  selectWorkOrders,
  selectWorkCenters,
  selectIsCreateWorkOrderFormOpen,
  selectNewWorkOrder,
  selectNewWorkOrderError,
  selectEditingWorkOrderId,
} = workOrderFeature;

export const selectWorkOrdersGroupedByWorkCenter = createSelector(
  selectWorkOrders,
  selectWorkCenters,
  (workOrders, workCenters) => {
    const workCentersMap: Record<string, WorkCenterDocument> = {};

    for (const wc of workCenters) {
      workCentersMap[wc.docId] = wc;
    }

    const groupedWorkOrders: Record<string, WorkOrderDocument[]> = {};

    for (const wo of workOrders) {
      const wcId = wo.data.workCenterId;
      const wc = workCentersMap[wcId];

      if (!wc) {
        continue;
      }

      if (!groupedWorkOrders[wcId]) {
        groupedWorkOrders[wcId] = [];
      }

      groupedWorkOrders[wcId].push(wo);
    }

    return groupedWorkOrders;
  },
);

export const selectEditingWorkOrder = createSelector(
  selectWorkOrders,
  selectEditingWorkOrderId,
  (workOrders, editingWorkOrderId) => {
    if (!editingWorkOrderId) {
      return null;
    }

    return workOrders.find((wo) => wo.docId === editingWorkOrderId) || null;
  },
);

export const selectIsEditWorkOrderFormOpen = createSelector(
  selectEditingWorkOrderId,
  (editingWorkOrderId) => !!editingWorkOrderId,
);
