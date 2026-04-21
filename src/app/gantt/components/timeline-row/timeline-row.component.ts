import { AsyncPipe, DatePipe } from '@angular/common';
import {
  asNativeElements,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DropdownListComponent } from '@common/components/dropdown-list/dropdown-list.component';
import { DropdownMenuComponent } from '@common/components/dropdown-menu/dropdown-menu';
import { StatusComponent } from '@common/components/status/status.component';
import { DropdownDirective } from '@common/directives/dropdown/dropdown.directive';
import { TooltipModule } from '@common/directives/tooltip/tooltip.module';
import { DropdownListItem } from '@common/types/dropdown-list-item.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { WorkOrderStatusColors } from '@common/types/work-order-status-colors';
import { TimelineService } from '@gantt/services/timeline.service';
import moment from 'moment';
import { filter, map, merge, pairwise, skipUntil, take, takeUntil, tap, timer } from 'rxjs';
import { GanttTimelineBarComponent } from '../timeline-bar/gantt-timeline-bar.component';

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
    DropdownMenuComponent,
    GanttTimelineBarComponent,
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
  elementHovered = output<boolean>();
  deleteWorkOrder = output<string>();
  editWorkOrder = output<string>();
  updateWorkOrder = output<WorkOrderDocument>();
  workOrderDragged = output<WorkOrderDocument | null>();

  hoveredTimelineBarId = signal<string | null>(null);

  timelineService = inject(TimelineService);
  destroyRef = inject(DestroyRef);

  mouseMoveEvent$ = this.timelineService.mouseMove$;
  mouseDown$ = this.timelineService.mouseDown$;
  mouseUp$ = this.timelineService.mouseUp$;

  goToDropDownOpened = signal<boolean>(false);
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
      this.configureWorkOrderPositionMapOnChange(this.dates(), this.workOrders());
    });

    effect(() => {
      this.updateWorkOrderBeingDragged(this.draggedWorkOrder());
    });
  }

  updateWorkOrderBeingDragged(workOrder: WorkOrderDocument | null): void {
    if (workOrder) {
      this.workOrderDragged.emit(workOrder);
    } else {
      this.workOrderDragged.emit(null);
    }
  }

  configureWorkOrderPositionMapOnChange(
    timelineDates: { label: string; date: Date }[],
    workOrders: WorkOrderDocument[],
  ): void {
    const timelineService = this.timelineService;
    const map: Record<string, { left: number; width: number }> = {};

    for (const workOrder of workOrders) {
      const { left, width } = timelineService.calculateWorkOrderPosition(
        workOrder.data,
        timelineDates,
      );
      map[workOrder.docId] = { left, width };
    }

    this.workOrderPositionMap.set(map);
  }

  onTimelineBarHovered(workOrderId: string | null): void {
    this.hoveredTimelineBarId.set(workOrderId);
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

  onMouseDownWorkOrder(event: MouseEvent, workOrder: WorkOrderDocument): void {
    const path = event.composedPath() as HTMLElement[];
    const isDraggingOnHandle = path.some((el) => el.classList?.contains('nl-timeline-item-handle'));

    if (isDraggingOnHandle) {
      return;
    }

    this.handleDragOfBothDates(workOrder);
  }

  handleDragOfBothDates(workOrder: WorkOrderDocument): void {
    let startDate: Date = new Date(workOrder.data.startDate as string);
    let endDate: Date = new Date(workOrder.data.endDate as string);
    const isDraggingDelay$ = timer(200).pipe(takeUntil(this.mouseUp$));
    const mouseUp$ = this.mouseUp$;

    this.draggedWorkOrder.set(workOrder);

    const saveOnDragEnd$ = mouseUp$.pipe(
      skipUntil(isDraggingDelay$),
      tap(() => {
        const updatedWorkOrder = {
          ...workOrder,
          data: {
            ...workOrder.data,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        };

        this.updateWorkOrder.emit(updatedWorkOrder);
        this.draggedWorkOrder.set(null);
      }),
      take(1),
      takeUntilDestroyed(this.destroyRef),
    );

    const updateWorkOrderOnMouseMove$ = this.mouseMoveEvent$.pipe(
      map((moveEvent) => {
        const newDate = this.timelineService.getDateBasedOnClickPosition(moveEvent);

        return { moveEvent, workOrder, newDate };
      }),
      pairwise(),
      filter(([prev, curr]) => this.isNewDate(prev.newDate, curr.newDate)),
      tap(([prev, curr]) => {
        const timeDiff = (prev.newDate.getTime() - curr.newDate.getTime()) * -1;
        startDate = moment(startDate).add(timeDiff, 'ms').startOf('day').toDate();
        endDate = moment(endDate).add(timeDiff, 'ms').startOf('day').toDate();

        const positionMap = this.workOrderPositionMap();
        const timelineDates = this.dates();

        const { left, width } = this.timelineService.calculateWorkOrderPosition(
          { startDate: startDate?.toISOString(), endDate: endDate?.toISOString() },
          timelineDates,
        );
        positionMap[workOrder.docId] = { left, width };
        this.workOrderPositionMap.set({ ...positionMap });
      }),
      takeUntilDestroyed(this.destroyRef),
      takeUntil(this.mouseUp$),
    );

    saveOnDragEnd$.subscribe();
    updateWorkOrderOnMouseMove$.subscribe();
  }

  onDragHandleMouseDown(workOrder: WorkOrderDocument, handle: 'left' | 'right'): void {
    let lastEmittedDate: Date | null = null;
    const field = handle === 'left' ? 'startDate' : 'endDate';
    this.draggedWorkOrder.set(workOrder);

    const saveOnDragEnd$ = this.mouseUp$.pipe(
      tap(() => {
        const updatedWorkOrder = {
          ...workOrder,
          data: {
            ...workOrder.data,
            [field]: lastEmittedDate ? lastEmittedDate.toISOString() : workOrder.data[field],
          },
        };

        this.updateWorkOrder.emit(updatedWorkOrder);
        this.draggedWorkOrder.set(null);
      }),
      take(1),
      takeUntilDestroyed(this.destroyRef),
    );

    const updateWorkOrderOnMouseMove$ = this.mouseMoveEvent$.pipe(
      map((moveEvent) => {
        const newDate = this.timelineService.getDateBasedOnClickPosition(moveEvent);
        return { moveEvent, newDate };
      }),
      pairwise(),
      filter(([prev, curr]) => {
        return this.isNewDate(prev.newDate, curr.newDate);
      }),
      tap(([, curr]) => {
        const positionMap = this.workOrderPositionMap();
        const { newDate } = curr;
        const { left, width } = this.timelineService.calculateWorkOrderPosition(
          { ...workOrder.data, [field]: newDate.toISOString() },
          this.dates(),
        );

        lastEmittedDate = newDate;

        positionMap[workOrder.docId] = { left, width };

        this.workOrderPositionMap.set({ ...positionMap });
      }),
      takeUntilDestroyed(this.destroyRef),
      takeUntil(this.mouseUp$),
    );

    saveOnDragEnd$.subscribe();
    updateWorkOrderOnMouseMove$.subscribe();
  }

  private isNewDate(prev: Date, curr: Date): boolean {
    const prevDate = prev.toISOString().split('T')[0];
    const currDate = curr.toISOString().split('T')[0];

    return prevDate !== currDate;
  }
}
