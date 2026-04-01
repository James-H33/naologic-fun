import { selectWorkCentersMap } from '@common/store/work-centers/work-center.selectors';
import { ganttFeature } from './gantt.reducer';

import {
  selectWorkOrders,
  selectWorkOrdersMap,
} from '@common/store/work-order/work-order.selectors';
import { WorkCenterDocument } from '@common/types/work-center-document.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { createSelector } from '@ngrx/store';

export const {
  selectViewId,
  selectTimescaleConfig,
  selectWorkOrderIds,
  selectWorkCenterIds,
  selectWorkCenterFormOpen,
  selectWorkOrderFormOpen,
  selectEditWorkOrderFormOpen,
  selectEditingWorkOrderId,
  selectNewWorkOrder,
  selectNewWorkCenter,
  selectFormError,
  selectName,
} = ganttFeature;

export const selectWorkOrdersForGantt = createSelector(
  selectWorkOrderIds,
  selectWorkOrdersMap,
  (workOrderIds, workOrdersMap) => {
    const result: WorkOrderDocument[] = [];

    for (const id of workOrderIds) {
      const wo = workOrdersMap[id];

      if (!wo) {
        continue;
      }

      result.push(wo);
    }

    return result;
  },
);

export const selectWorkCentersForGantt = createSelector(
  selectWorkCenterIds,
  selectWorkCentersMap,
  (workCenterIds, workCentersMap) => {
    const result: WorkCenterDocument[] = [];

    for (const id of workCenterIds) {
      const wc = workCentersMap[id];

      if (!wc) {
        continue;
      }

      result.push(wc);
    }

    return result;
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

export const selectWorkOrdersGroupedByWorkCenterForGantt = createSelector(
  selectWorkCentersForGantt,
  selectWorkOrdersForGantt,
  (workCenters, workOrders) => {
    const workCentersMap: Record<string, WorkOrderDocument[]> = {};

    for (const wc of workCenters) {
      workCentersMap[wc.docId] = [];
    }

    for (const wo of workOrders) {
      const wcId = wo.data.workCenterId;

      if (wcId in workCentersMap) {
        workCentersMap[wcId].push(wo);
      }
    }

    return workCentersMap;
  },
);
