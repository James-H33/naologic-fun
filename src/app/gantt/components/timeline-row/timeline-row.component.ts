import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DropdownListComponent } from '@common/components/dropdown-list/dropdown-list.component';
import { StatusComponent } from '@common/components/status/status.component';
import { DropdownDirective } from '@common/directives/dropdown/dropdown.directive';
import { TooltipModule } from '@common/directives/tooltip/tooltip.module';
import { DropdownListItem } from '@common/types/dropdown-list-item.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { WorkOrderStatusColors } from '@common/types/work-order-status-colors';
import { filter, map, merge, pairwise, take, takeUntil, tap } from 'rxjs';
import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'nl-timeline-row',
  templateUrl: './timeline-row.component.html',
  styleUrls: ['./timeline-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StatusComponent,
    DatePipe,
    TooltipModule,
    DropdownDirective,
    DropdownListComponent,
    AsyncPipe,
  ],
})
export class TimelineRowComponent {
  dates = input<{ label: string; date: Date }[]>([]);
  workOrders = input<WorkOrderDocument[]>([]);
  rowHeight = input(48);
  rowIndex = input(0);

  dropdownRef = viewChildren(DropdownDirective);
  activeDropdownWorkorder = signal<WorkOrderDocument | null>(null);
  workOrderHovered = output<WorkOrderDocument | null>();
  deleteWorkOrder = output<string>();
  editWorkOrder = output<string>();
  updateWorkOrder = output<WorkOrderDocument>();
  workOrderDragged = output<WorkOrderDocument | null>();

  timelineService = inject(TimelineService);
  destroyRef = inject(DestroyRef);

  mouseMoveEvent$ = this.timelineService.mouseMove$;
  mouseDown$ = this.timelineService.mouseDown$;
  mouseUp$ = this.timelineService.mouseUp$;

  draggedWorkOrder = signal<WorkOrderDocument | null>(null);

  isMouseDown$ = merge(
    this.mouseDown$.pipe(map(() => true)),
    this.mouseUp$.pipe(map(() => false)),
  ).pipe(takeUntilDestroyed(this.destroyRef));

  workOrderStatusColors = WorkOrderStatusColors;

  workOrderPositionMap = signal<Record<string, { left: number; width: number }>>({});

  dropdownItems = [
    { id: 'edit', title: 'Edit' },
    { id: 'delete', title: 'Delete', icon: 'trash', opts: { textColor: 'danger' } },
  ];

  constructor() {
    effect(() => {
      const timelineService = this.timelineService;
      const timelineDates = this.dates();
      const map: Record<string, { left: number; width: number }> = {};

      for (const workOrder of this.workOrders()) {
        const { left, width } = timelineService.calculateWorkOrderPosition(
          workOrder.data,
          timelineDates,
        );
        map[workOrder.docId] = { left, width };
      }

      this.workOrderPositionMap.set(map);
    });

    effect(() => {
      const workOrderBeingDragged = this.draggedWorkOrder();

      if (workOrderBeingDragged) {
        this.workOrderDragged.emit(workOrderBeingDragged);
      } else {
        this.workOrderDragged.emit(null);
      }
    });
  }

  onWorkOrderHover(workOrder: WorkOrderDocument | null): void {
    this.workOrderHovered.emit(workOrder);
  }

  onContextMenuAction(item: DropdownListItem): void {
    const activeWorkOrder = this.activeDropdownWorkorder();

    if (!activeWorkOrder) {
      return;
    }

    for (const dropdown of this.dropdownRef()) {
      dropdown.close();
    }

    if (item.id === 'edit') {
      this.editWorkOrder.emit(activeWorkOrder.docId);
    } else if (item.id === 'delete') {
      this.deleteWorkOrder.emit(activeWorkOrder.docId);
    }
  }

  onDragHandleMouseDown(
    event: MouseEvent,
    workOrder: WorkOrderDocument,
    handle: 'left' | 'right',
  ): void {
    let lastEmittedDate: Date | null = null;
    this.draggedWorkOrder.set(workOrder);

    this.mouseUp$
      .pipe(
        tap(() => {
          const updatedWorkOrder = {
            ...workOrder,
            data: {
              ...workOrder.data,
              [handle === 'left' ? 'startDate' : 'endDate']: lastEmittedDate
                ? lastEmittedDate.toISOString()
                : workOrder.data[handle === 'left' ? 'startDate' : 'endDate'],
            },
          };

          this.updateWorkOrder.emit(updatedWorkOrder);
          this.draggedWorkOrder.set(null);
        }),
        take(1),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.mouseMoveEvent$
      .pipe(
        map((moveEvent) => ({ moveEvent, workOrder, handle })),
        map(({ moveEvent, workOrder, handle }) => {
          const newDate = this.timelineService.getDateBasedOnClickPosition(moveEvent);
          return { moveEvent, workOrder, handle, newDate };
        }),
        pairwise(),
        filter(([prev, curr]) => {
          const prevDate = prev.newDate.toISOString().split('T')[0];
          const currDate = curr.newDate.toISOString().split('T')[0];

          return prevDate !== currDate;
        }),
        tap(([, curr]) => {
          const positionMap = this.workOrderPositionMap();
          const timelineDates = this.dates();
          const { workOrder, newDate, handle } = curr;
          const field = handle === 'left' ? 'startDate' : 'endDate';
          const { left, width } = this.timelineService.calculateWorkOrderPosition(
            { ...workOrder.data, [field]: newDate.toISOString() },
            timelineDates,
          );

          lastEmittedDate = newDate;

          positionMap[workOrder.docId] = { left, width };

          this.workOrderPositionMap.set({ ...positionMap });
        }),
        takeUntilDestroyed(this.destroyRef),
        takeUntil(this.mouseUp$),
      )
      .subscribe();
  }
}
