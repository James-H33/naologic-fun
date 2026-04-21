import { Component, computed, input, output } from '@angular/core';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { WorkOrderStatusColors } from '@common/types/work-order-status-colors';

@Component({
  selector: 'nl-gantt-timeline-bar',
  templateUrl: './gantt-timeline-bar.component.html',
  styleUrls: ['./gantt-timeline-bar.component.scss'],
})
export class GanttTimelineBarComponent {
  workOrders = input<WorkOrderDocument[]>([]);
  hovered = output<string | null>();

  timelineBars = computed(() => {
    const bars = [];
    const workOrders = this.workOrders();

    for (const workOrder of workOrders) {
      const data = workOrder.data;
      const start = new Date(data.startDate!).getTime();
      const end = new Date(data.endDate!).getTime();
      const statusColor = WorkOrderStatusColors[data.status].primaryBackground;

      const bar = {
        id: workOrder.docId,
        start,
        end,
        color: statusColor,
      };

      bars.push(bar);
    }

    return bars.sort((a, b) => a.start - b.start);
  });
}
