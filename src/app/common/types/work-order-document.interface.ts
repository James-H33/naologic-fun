import { WorkOrderStatus } from './work-order-status.type';

export interface WorkOrderDocument {
  docId: string;
  docType: 'workOrder';
  data: {
    name: string;
    workCenterId: string; // References WorkCenterDocument.docId
    status: WorkOrderStatus;
    startDate: string | null; // ISO format (e.g., "2026-01-15")
    endDate: string | null; // ISO format
  };
}
