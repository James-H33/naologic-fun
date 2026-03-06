import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { StatusComponent } from '@common/components/status/status.component';
import { DropdownDirective } from '@common/directives/dropdown/dropdown.directive';
import { TooltipModule } from '@common/directives/tooltip/tooltip.module';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { WorkOrderStatusColors } from '@common/types/work-order-status-colors';
import { TimelineService } from '../../services/timeline.service';
import { DropdownListComponent } from '@common/components/dropdown-list/dropdown-list.component';
import { DropdownListItem } from '@common/types/dropdown-list-item.interface';

@Component({
  selector: 'nl-timeline-row',
  templateUrl: './timeline-row.component.html',
  styleUrls: ['./timeline-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusComponent, DatePipe, TooltipModule, DropdownDirective, DropdownListComponent],
})
export class TimelineRowComponent {
  dates = input<{ label: string; date: Date }[]>([]);
  workOrders = input<WorkOrderDocument[]>([]);
  rowHeight = input(48);
  rowIndex = input(0);

  activeDropdownWorkorder = signal<WorkOrderDocument | null>(null);
  workOrderHovered = output<WorkOrderDocument | null>();
  deleteWorkOrder = output<string>();
  editWorkOrder = output<string>();

  timelineService = inject(TimelineService);

  workOrderStatusColors = WorkOrderStatusColors;

  workOrdersWithPostion = computed(() => {
    const timelineService = this.timelineService;
    const timelineDates = this.dates();

    return this.workOrders().map((workOrder) => {
      const { left, width } = timelineService.calculateWorkOrderPosition(
        workOrder.data,
        timelineDates,
      );

      return {
        ...workOrder,
        left,
        width,
      };
    });
  });

  dropdownItems = [
    { id: 'edit', title: 'Edit' },
    { id: 'delete', title: 'Delete', icon: 'trash', opts: { textColor: 'danger' } },
  ];

  onWorkOrderHover(workOrder: WorkOrderDocument | null): void {
    this.workOrderHovered.emit(workOrder);
  }

  onContextMenuAction(item: DropdownListItem): void {
    const activeWorkOrder = this.activeDropdownWorkorder();

    if (!activeWorkOrder) {
      return;
    }

    if (item.id === 'edit') {
      this.editWorkOrder.emit(activeWorkOrder.docId);
    } else if (item.id === 'delete') {
      this.deleteWorkOrder.emit(activeWorkOrder.docId);
    }
  }
}
