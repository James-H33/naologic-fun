import { createSelector } from '@ngrx/store';
import { workOrderFeature } from './work-order.reducer';
import { WorkCenterDocument } from '@common/types/work-center-documnet.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';

export const {
  selectWorkOrders,
  selectWorkCenters,
  selectTimescaleConfig,
  selectIsWorkOrderFormOpen,
  selectNewWorkOrder,
  selectNewWorkOrderError,
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
