import { Component, input } from '@angular/core';
import { WorkOrderStatusColors } from '@common/types/work-order-status-colors';
import { WorkOrderStatus } from '@common/types/work-order-status.type';

@Component({
  selector: 'nl-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent {
  status = input<WorkOrderStatus>('open');

  statusColors = WorkOrderStatusColors;
}
