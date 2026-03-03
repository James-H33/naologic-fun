import { WorkOrderStatus } from './work-order-status.type';

export interface NewWorkOrder {
  title: string;
  startDate: Date | null;
  endDate: Date | null;
  workCenterId: string | null;
  status: WorkOrderStatus;
}
