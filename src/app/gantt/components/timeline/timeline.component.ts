import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { WorkCenterDocument } from '@common/types/work-center-document.interface';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import moment from 'moment';
import {
  combineLatest,
  filter,
  map,
  merge,
  of,
  pairwise,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { Timescale, TimescaleConfig, TimescalesConfig } from '../../../common/types/timescales';
import { TimelineService } from '../../services/timeline.service';
import { TimelineRowComponent } from '../timeline-row/timeline-row.component';

@Component({
  selector: 'nl-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TimelineRowComponent, CdkScrollableModule],
  providers: [TimelineService],
})
export class TimelineComponent implements AfterViewInit {
  timelineContainer = viewChild<ElementRef>('timelineContainer');
  timescalesBodyContainer = viewChild<ElementRef>('timescalesBodyContainer');
  workorderPreviewCard = viewChild<ElementRef>('workorderPreviewCard');

  timescaleConfig = input<TimescaleConfig>(TimescalesConfig[Timescale.Week]);

  workCentersMap = input<Record<WorkCenterDocument['docId'], WorkCenterDocument>>({});
  workOrdersGroupedByWorkCenter = input<Record<WorkCenterDocument['docId'], WorkOrderDocument[]>>(
    {},
  );

  createWorkOrder = output<{ date: Date; workCenterId: string }>();
  deleteWorkOrder = output<WorkOrderDocument['docId']>();
  editWorkOrder = output<WorkOrderDocument['docId']>();
  updateWorkOrder = output<WorkOrderDocument>();

  workOrdersGroupedByWorkCenterAsArray = computed(() => {
    const workOrdersGroupedByWorkCenter = this.workOrdersGroupedByWorkCenter() || {};
    const workCentersMap = this.workCentersMap() || {};

    return Object.entries(workOrdersGroupedByWorkCenter).map(([workCenterId, workOrders]) => ({
      workCenterName: workCentersMap[workCenterId]?.data.name ?? 'Unknown Work Center',
      workCenterId,
      workOrders,
    }));
  });

  timelineService = inject(TimelineService);

  timelineInit$ = toObservable(this.timelineService.initialized$);

  workOrderBeingDragged = signal<WorkOrderDocument | null>(null);
  mouseMove$ = this.timelineService.mouseMove$;
  mouseLeave$ = this.timelineService.mouseLeave$;
  mouseDown$ = this.timelineService.mouseDown$;
  mouseUp$ = this.timelineService.mouseUp$;
  keydown$ = this.timelineService.keydown$;
  keyup$ = this.timelineService.keyup$;
  isSpaceKeyPressed$ = merge(
    this.keydown$.pipe(
      filter((event) => event.key === ' '),
      map(() => true),
    ),
    this.keyup$.pipe(
      filter((event) => event.key === ' '),
      map(() => false),
    ),
  ).pipe(takeUntilDestroyed());

  isMouseDown$ = merge(
    this.mouseDown$.pipe(map(() => true)),
    this.mouseUp$.pipe(map(() => false)),
  ).pipe(takeUntilDestroyed());

  isSpaceKeyPressed = toSignal(this.isSpaceKeyPressed$, { initialValue: false });
  spaceKeyPressed = toSignal(this.isSpaceKeyPressed$, { initialValue: false });
  isMouseDown = toSignal(this.isMouseDown$, { initialValue: false });

  verticalScrollPosition = signal(0);
  isGrabbing = computed(() => this.spaceKeyPressed() && this.isMouseDown());

  @HostBinding('style.--nl-timeline-cursor-style')
  get cursorStyle() {
    if (this.spaceKeyPressed()) {
      return this.isGrabbing() ? 'grabbing' : 'grab';
    }

    return 'default';
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.timelineService.keydown$.next(event);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    this.timelineService.keyup$.next(event);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.timelineService.mouseDown$.next(event);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.timelineService.mouseUp$.next(event);
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    this.timelineService.mouseLeave$.next(event);
  }

  rowHeight = 48;
  timelineDates = this.timelineService.timelineDates;
  workCenterHovered: string | null = null;
  workOrderHovered: WorkOrderDocument | null = null;

  colWidth = computed(() => this.timescaleConfig().colWidth);

  previewCardWidth = computed(() => {
    const config = this.timescaleConfig();
    return config.colWidth / this.getScaleDivider(config.scale);
  });

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

    effect(() => {
      const spaceKeyPressed = this.spaceKeyPressed();
      const workOrderDragged = this.workOrderBeingDragged();

      if (spaceKeyPressed || workOrderDragged) {
        this.removeCreateWorkorderPreview();
      }
    });

    this.listenToMouseMoveInGrid();
    this.listenForDrag();
  }

  ngAfterViewInit(): void {
    this.timelineInit$
      .pipe(
        filter((init) => init),
        take(1),
      )
      .subscribe(() => {
        // Scroll to today
        this.scrollToDate(moment().toDate());
      });
  }

  onRowHover(workcenterId: string): void {
    this.workCenterHovered = workcenterId;
  }

  onWorkOrderHover(workOrder: WorkOrderDocument | null): void {
    this.workOrderHovered = workOrder;

    if (workOrder) {
      this.removeCreateWorkorderPreview();
    }
  }

  showCreateWorkorderPreview(relativeX: number, relativeY: number): void {
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

  removeCreateWorkorderPreview(): void {
    this.previewCardStyles.set({ left: 0, top: 0, display: 'none' });
  }

  onMouseMoveInGrid(event: MouseEvent): void {
    this.timelineService.mouseMove$.next(event);
  }

  onMouseLeaveGrid(): void {
    this.workCenterHovered = null;
    this.removeCreateWorkorderPreview();
  }

  onCreateWorkorder(event: MouseEvent): void {
    const date = this.timelineService.getDateBasedOnClickPosition(event);

    this.createWorkOrder.emit({
      date,
      workCenterId: this.workCenterHovered!,
    });
  }

  onTimelineScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement)?.scrollTop ?? 0;
    this.verticalScrollPosition.set(scrollTop);
  }

  private scrollToDate(date: Date): void {
    setTimeout(() => {
      this.timelineService.scrollToDate(date);
    }, 10 /* Small delay to let ui render before scrolling */);
  }

  private listenForDrag(): void {
    const grabbing$ = toObservable(this.isGrabbing);
    const mouseMove$ = this.mouseMove$.pipe(filter((event) => !!event));
    const mouseLeave$ = this.mouseLeave$.pipe(filter((event) => !!event));

    grabbing$
      .pipe(
        switchMap((grabbing) => {
          if (grabbing) {
            const scrollableArea = this.timelineContainer()?.nativeElement;

            return combineLatest([mouseMove$, of(scrollableArea)]).pipe(takeUntil(mouseLeave$));
          } else {
            return [];
          }
        }),
        tap(([event, scrollableArea]) => {
          if (scrollableArea) {
            scrollableArea.scrollLeft += -event.movementX;
            scrollableArea.scrollTop += -event.movementY;
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  private listenToMouseMoveInGrid(): void {
    this.mouseMove$
      .pipe(
        filter((event) => !!event),
        map((event) => {
          return {
            event,
            date: this.timelineService.getDateBasedOnClickPosition(event as MouseEvent),
            rowId: this.workCenterHovered,
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

          if (this.spaceKeyPressed() || this.workOrderBeingDragged()) {
            this.removeCreateWorkorderPreview();
          } else {
            this.showCreateWorkorderPreview(relativeX, relativeY);
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
