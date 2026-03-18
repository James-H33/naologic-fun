import { selectWorkCenters } from '@common/store/work-centers/work-center.selectors';
import { ganttFeature } from './gantt.reducer';

import { selectWorkOrders } from '@common/store/work-order/work-order.selectors';
import { WorkCenterDocument } from '@common/types/work-center-document.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { createSelector } from '@ngrx/store';

export const { selectViewId, selectTimescaleConfig, selectWorkOrderIds, selectWorkCenterIds } =
  ganttFeature;

export const selectWorkOrdersForGantt = createSelector(
  selectWorkOrderIds,
  selectWorkOrders,
  (workOrderIds, workOrders) => {
    return workOrderIds
      .map((id) => workOrders.find((wo) => wo.docId === id))
      .filter((wo): wo is WorkOrderDocument => !!wo);
  },
);

export const selectWorkCentersForGantt = createSelector(
  selectWorkCenterIds,
  selectWorkCenters,
  (workCenterIds, workCenters) => {
    return workCenterIds
      .map((id) => workCenters.find((wc) => wc.docId === id))
      .filter((wc): wc is WorkCenterDocument => !!wc);
  },
);

export const selectWorkOrdersGroupedByWorkCenterForGantt = createSelector(
  selectWorkCentersForGantt,
  selectWorkOrdersForGantt,
  (workCenters, workOrders) => {
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
