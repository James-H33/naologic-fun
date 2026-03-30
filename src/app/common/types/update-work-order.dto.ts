export interface UpdateWorkOrderDto {
  id: string;
  name: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  status: string;
  workCenterId: string | null;
}
