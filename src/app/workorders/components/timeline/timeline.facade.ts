import { inject, Injectable } from '@angular/core';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { Store } from '@ngrx/store';
import { editWorkOrder } from '../../store/work-order/work-order.actions';

@Injectable({
  providedIn: 'root',
})
export class TimelineFacade {
  store = inject(Store);

  updateWorkOrder(workOrder: WorkOrderDocument): void {
    this.store.dispatch(editWorkOrder({ workOrder }));
  }
}
