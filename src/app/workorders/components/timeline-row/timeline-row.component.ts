import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { StatusComponent } from '@common/components/status/status.component';
import { TooltipModule } from '@common/directives/tooltip/tooltip.module';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { WorkOrderStatusColors } from '@common/types/work-order-status-colors';
import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'nl-timeline-row',
  templateUrl: './timeline-row.component.html',
  styleUrls: ['./timeline-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusComponent, DatePipe, TooltipModule],
})
export class TimelineRowComponent {
  // inputs
  dates = input<{ label: string; date: Date }[]>([]);
  workOrders = input<WorkOrderDocument[]>([]);
  rowHeight = input(48);
  rowIndex = input(0);

  workOrderHovered = output<WorkOrderDocument | null>();

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

  onWorkOrderHover(workOrder: WorkOrderDocument | null) {
    this.workOrderHovered.emit(workOrder);
  }
}
