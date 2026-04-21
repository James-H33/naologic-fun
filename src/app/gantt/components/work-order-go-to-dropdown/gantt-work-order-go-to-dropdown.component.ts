import { Component, input } from '@angular/core';
import { DropdownMenuComponent } from '@common/components/dropdown-menu/dropdown-menu';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';

@Component({
  selector: 'nl-gantt-work-order-go-to-dropdown',
  templateUrl: './gantt-work-order-go-to-dropdown.component.html',
  styleUrls: ['./gantt-work-order-go-to-dropdown.component.scss'],
  imports: [DropdownMenuComponent],
})
export class GanttWorkOrderGoToDropdownComponent {
  workOrders = input<WorkOrderDocument[]>([]);
}
