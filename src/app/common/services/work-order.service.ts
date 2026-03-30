import { inject, Injectable } from '@angular/core';
import { selectWorkOrdersGroupedByWorkCenter } from '@common/store/work-order/work-order.selectors';
import { FormError } from '@common/types/form-error.interface';
import { NewWorkOrder } from '@common/types/new-work-order.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { catchError, map, Observable, of } from 'rxjs';
import { WorkOrderAPIService } from './api/work-order-api.service';
import { CreateWorkOrderDto } from '@common/types/create-work-order.dto';
import { getDateAsISOString } from '@common/utils/get-date-as-iso-string.function';
import { UpdateWorkOrderDto } from '@common/types/update-work-order.dto';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderService {
  store = inject(Store);
  workOrderAPIService = inject(WorkOrderAPIService);
  workOrdersGroupedByWorkCenter = this.store.selectSignal(selectWorkOrdersGroupedByWorkCenter);

  createWorkOrder(
    workOrder: NewWorkOrder,
  ): Observable<{ result?: WorkOrderDocument; error?: FormError }> {
    const workOrdersGroupedByWorkCenter = this.workOrdersGroupedByWorkCenter();
    const workOrdersForWorkCenter =
      workOrdersGroupedByWorkCenter[workOrder.workCenterId as string] ?? [];

    const startDate = moment(workOrder.startDate);
    const endDate = moment(workOrder.endDate);

    for (const wo of workOrdersForWorkCenter) {
      const start = moment(wo.data.startDate);
      const end = moment(wo.data.endDate);

      const overlaps =
        startDate.isBetween(start, end, undefined, '[]') ||
        endDate.isBetween(start, end, undefined, '[]') ||
        start.isBetween(startDate, endDate, undefined, '[]') ||
        end.isBetween(startDate, endDate, undefined, '[]');

      if (overlaps) {
        return of({
          error: {
            message: 'Work order dates overlap with existing work order for the same work center.',
            fields: {
              startDate: 'Start date overlaps with existing work order.',
              endDate: 'End date overlaps with existing work order.',
            },
          },
        });
      }
    }

    const payload: CreateWorkOrderDto = {
      name: workOrder.title,
      description: '',
      startDate: getDateAsISOString(workOrder.startDate),
      endDate: getDateAsISOString(workOrder.endDate),
      status: workOrder.status,
      workCenterId: workOrder.workCenterId as string,
    };

    return this.workOrderAPIService.createWorkOrder(payload).pipe(
      map((createdWorkOrder) => ({ result: createdWorkOrder })),
      catchError(() =>
        of({
          error: {
            message: 'Failed to create work order. Please try again.',
            fields: {},
          },
        }),
      ),
    );
  }

  updateWorkOrder(
    workOrder: WorkOrderDocument,
  ): Observable<{ result?: WorkOrderDocument; error?: FormError }> {
    const { docId, data } = workOrder;
    const workOrdersGroupedByWorkCenter = this.workOrdersGroupedByWorkCenter();
    const workOrdersForWorkCenter =
      workOrdersGroupedByWorkCenter[data.workCenterId as string] ?? [];

    const startDate = moment(data.startDate);
    const endDate = moment(data.endDate);

    for (const wo of workOrdersForWorkCenter) {
      if (wo.docId === docId) {
        continue;
      }

      const start = moment(wo.data.startDate);
      const end = moment(wo.data.endDate);

      const overlaps =
        startDate.isBetween(start, end, undefined, '[]') ||
        endDate.isBetween(start, end, undefined, '[]') ||
        start.isBetween(startDate, endDate, undefined, '[]') ||
        end.isBetween(startDate, endDate, undefined, '[]');

      if (overlaps) {
        return of({
          error: {
            message: 'Work order dates overlap with existing work order for the same work center.',
            fields: {
              startDate: 'Start date overlaps with existing work order.',
              endDate: 'End date overlaps with existing work order.',
            },
          },
        });
      }
    }

    const payload: UpdateWorkOrderDto = {
      id: docId,
      description: '',
      ...data,
      startDate: getDateAsISOString(startDate.toDate()),
      endDate: getDateAsISOString(endDate.toDate()),
    };

    return this.workOrderAPIService.updateWorkOrder(payload).pipe(
      map((updatedWorkOrder) => ({ result: updatedWorkOrder })),
      catchError(() =>
        of({
          error: {
            message: 'Failed to update work order. Please try again.',
            fields: {},
          },
        }),
      ),
    );
  }
}
