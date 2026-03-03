import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { WorkCenterDocument } from '@common/types/work-center-documnet.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import moment from 'moment';
import { filter, map, pairwise, Subject, take, tap } from 'rxjs';
import { Timescale, TimescaleConfig, TimescalesConfig } from '../../../common/types/timescales';
import { TimelineService } from '../../services/timeline.service';
import { TimelineRowComponent } from '../timeline-row/timeline-row.component';

@Component({
  selector: 'nl-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TimelineRowComponent],
  providers: [TimelineService],
})
export class TimelineComponent implements AfterViewInit {
  timelineContainer = viewChild<ElementRef>('timelineContainer');
  timescalesBodyContainer = viewChild<ElementRef>('timescalesBodyContainer');
  workorderPreviewCard = viewChild<ElementRef>('workorderPreviewCard');

  timescaleConfig = input<TimescaleConfig>(TimescalesConfig[Timescale.Week]);

  workOrdersGroupedByWorkCenter = input<Record<WorkCenterDocument['docId'], WorkOrderDocument[]>>(
    {},
  );

  createWorkOrder = output<{ date: Date; workCenterId: string }>();

  workOrdersGroupedByWorkCenterAsArray = computed(() => {
    const workOrdersGroupedByWorkCenter = this.workOrdersGroupedByWorkCenter() || {};

    return Object.entries(workOrdersGroupedByWorkCenter).map(([workCenterId, workOrders]) => ({
      workCenterId,
      workOrders,
    }));
  });

  timelineService = inject(TimelineService);

  timelineInit$ = toObservable(this.timelineService.initialized$);

  rowHeight = 48;
  timelineDates = this.timelineService.timelineDates;
  workCenterHovered: string | null = null;
  workOrderHovered: WorkOrderDocument | null = null;

  colWidth = computed(() => this.timescaleConfig().colWidth);

  previewCardWidth = computed(() => {
    const config = this.timescaleConfig();
    return config.colWidth / this.getScaleDivider(config.scale);
  });

  mouseMoveInGrid$ = new Subject<{ event: MouseEvent; rowId: string }>();

  previewCardStyles = signal<{ top: number; left: number; display: string }>({
    top: 0,
    left: 0,
    display: 'none',
  });

  constructor() {
    effect(() => {
      const config = this.timescaleConfig();

      if (config) {
        this.timelineService.config.set(config);
        this.scrollToDate(moment().toDate());
      }
    });

    effect(() => {
      const body = this.timescalesBodyContainer()?.nativeElement;
      const container = this.timelineContainer()?.nativeElement;
      const config = this.timescaleConfig();

      if (body && container) {
        this.timelineService.initialize(container, body, config);
      }
    });

    this.listenToMouseMoveInGrid();
  }

  ngAfterViewInit(): void {
    this.timelineInit$
      .pipe(
        filter((init) => init),
        take(1),
      )
      .subscribe(() => {
        this.scrollToDate(moment().toDate());
      });
  }

  onRowHover(workcenterId: string) {
    this.workCenterHovered = workcenterId;
  }

  onWorkOrderHover(workOrder: WorkOrderDocument | null) {
    this.workOrderHovered = workOrder;

    if (workOrder) {
      this.removeCreateWorkorderPreview();
    }
  }

  showCreateWorkorderPreview(relativeX: number, relativeY: number) {
    const config = this.timescaleConfig();
    const previewCardWidth = this.previewCardWidth();

    if (!config) {
      return;
    }

    const rowNumber = Math.floor(relativeY / this.rowHeight) ?? 0;

    if (rowNumber < 0) return; // Prevent negative row numbers

    const padding = 4;
    const top = rowNumber * this.rowHeight + padding;
    const left = relativeX - previewCardWidth / 2;

    this.previewCardStyles.set({ left, top, display: 'block' });
  }

  getScaleDivider(scale: Timescale): number {
    switch (scale) {
      case Timescale.Month:
        return 30;
      case Timescale.Week:
        return 7;
      default:
        return 1;
    }
  }

  removeCreateWorkorderPreview() {
    this.previewCardStyles.set({ left: 0, top: 0, display: 'none' });
  }

  onMouseMoveInGrid(event: MouseEvent) {
    if (this.workCenterHovered && !this.workOrderHovered) {
      this.mouseMoveInGrid$.next({ event, rowId: this.workCenterHovered });
    }
  }

  onMouseLeaveGrid() {
    this.workCenterHovered = null;
    this.removeCreateWorkorderPreview();
  }

  onCreateWorkorder(event: MouseEvent) {
    const date = this.timelineService.getDateBasedOnClickPosition(event);

    this.createWorkOrder.emit({
      date,
      workCenterId: this.workCenterHovered!,
    });
  }

  private scrollToDate(date: Date) {
    setTimeout(() => {
      this.timelineService.scrollToDate(date);
    }, 10 /* Small delay to let ui render before scrolling */);
  }

  private listenToMouseMoveInGrid() {
    this.mouseMoveInGrid$
      .pipe(
        map(({ event, rowId }) => {
          return {
            event,
            date: this.timelineService.getDateBasedOnClickPosition(event),
            rowId,
          };
        }),
        pairwise(),
        filter(
          ([prev, curr]) =>
            prev.date.getTime() !== curr.date.getTime() || prev.rowId !== curr.rowId,
        ),
        tap(([, curr]) => {
          const { relativeX, relativeY } = this.timelineService.getRelativePositionFromEvent(
            curr.event,
          );

          this.showCreateWorkorderPreview(relativeX, relativeY);
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
