import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Timescale, TimescaleConfig, TimescalesConfig } from '@common/types/timescales';
import moment from 'moment';
import { fromEvent } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class TimelineService {
  private destroyRef = inject(DestroyRef);

  mouseMove$ = new Subject<MouseEvent>();
  mouseEnter$ = new Subject<MouseEvent>();
  mouseLeave$ = new Subject<MouseEvent>();
  mouseDown$ = new Subject<MouseEvent>();
  mouseUp$ = new Subject<MouseEvent>();
  keydown$ = new Subject<KeyboardEvent>();
  keyup$ = new Subject<KeyboardEvent>();
  windowResize$ = new Subject<Event>();

  initialized$ = signal(false);
  timelineContainer = signal<HTMLElement>(null!);
  timelineBody = signal<HTMLElement>(null!);
  config = signal<TimescaleConfig>(TimescalesConfig[Timescale.Week]);
  dateRange = signal<{ start: Date; end: Date } | null>({
    start: moment().subtract(2, 'year').startOf('year').toDate(),
    end: moment().add(2, 'year').endOf('year').toDate(),
  });

  timelineDates = computed(() => {
    const config = this.config();
    const dateRange = this.dateRange();

    if (!dateRange) {
      return [];
    }

    const start = dateRange.start;
    const end = dateRange.end;

    const result = this.generateTimelineColumns(config, start, end);

    return result;
  });

  initialize(container: HTMLElement, body: HTMLElement, config: TimescaleConfig) {
    this.timelineContainer.set(container);
    this.timelineBody.set(body);
    this.config.set(config);
    this.initialized$.set(true);

    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.windowResize$.next(event);
      });
  }

  getRelativePositionFromEvent(event: MouseEvent) {
    const gridRect = this.timelineBody()?.getBoundingClientRect();
    const relativeX = event.clientX - Math.floor(gridRect.left);
    const relativeY = event.clientY - Math.floor(gridRect.top);

    return { relativeX, relativeY };
  }

  getColumnStartPositionOfDate(date: Date): number {
    const scale = this.config()?.scale;
    const dates = this.timelineDates();
    const timelineStartDate = moment(dates[0].date);
    const targetDate = moment(date);

    if (scale === Timescale.Month) {
      const monthsFromTimelineStart = targetDate.diff(timelineStartDate, 'months');
      return monthsFromTimelineStart * (this.config()?.colWidth ?? 0);
    }

    if (scale === Timescale.Week) {
      const weeksFromTimelineStart = targetDate.diff(timelineStartDate, 'weeks');
      return weeksFromTimelineStart * (this.config()?.colWidth ?? 0);
    }

    const daysFromTimelineStart = targetDate.diff(timelineStartDate, 'days');
    return daysFromTimelineStart * (this.config()?.colWidth ?? 0);
  }

  getPositionOfDate(date: Date): number {
    const scale = this.config()?.scale;
    const dates = this.timelineDates();
    const timelineStartDate = moment(dates[0].date);
    const targetDate = moment(date);

    const widthOfDay = this.getWidthOfDayBasedOnScale(scale);
    const daysFromTimelineStart = targetDate.diff(timelineStartDate, 'days');

    return daysFromTimelineStart * widthOfDay;
  }

  scrollToDate(date: Date, offset?: number): void {
    const clientWidth = this.timelineContainer()?.clientWidth ?? 0;
    offset = offset ?? -clientWidth * 0.1;
    const position = this.getPositionOfDate(date) + offset;
    const element = this.timelineContainer();

    if (element) {
      element.scrollLeft = position;
    }
  }

  getScrollPosition(): number {
    return this.timelineContainer()?.scrollLeft ?? 0;
  }

  getDateAtScrollPosition(position: number | null | undefined = null): Date | null {
    const scrollPosition = position ?? this.getScrollPosition();
    const dates = this.timelineDates();
    const scale = this.config()?.scale;
    const widthOfDay = this.getWidthOfDayBasedOnScale(scale);
    const daysFromTimelineStart = scrollPosition / widthOfDay;
    const timelineStartDate = moment(dates[0].date);
    const targetDate = timelineStartDate.add(daysFromTimelineStart, 'days');

    return targetDate.toDate();
  }

  getDateBasedOnClickPosition(event: MouseEvent): Date {
    const { relativeX } = this.getRelativePositionFromEvent(event);
    const colWidth = this.config()?.colWidth;
    const scale = this.config()?.scale;
    const colIndex = Math.floor(relativeX / colWidth);

    const day = this.getFormulaForDateByClickPosition(scale, colIndex, relativeX);

    return day;
  }

  calculateWorkOrderPosition(
    workOrder: { startDate: string | null; endDate: string | null },
    timelineDates: { label: string; date: Date }[],
  ): { left: number; width: number } {
    if (!this.config() || !workOrder.startDate || !workOrder.endDate) {
      return { left: 0, width: 0 }; // Default position if config is not set
    }
    const startDate = moment(workOrder.startDate);
    const endDate = moment(workOrder.endDate);
    const scale = this.config()?.scale;

    const timelineStartDate = moment(timelineDates[0].date);

    const widthOfDay = this.getWidthOfDayBasedOnScale(scale);
    const days = endDate.diff(startDate, 'days') + 1; // +1 to include the start date
    const daysFromTimelineStart = startDate.diff(timelineStartDate, 'days');

    const left = daysFromTimelineStart * widthOfDay;
    const width = days * widthOfDay;

    return { left, width };
  }

  private getFormulaForDateByClickPosition(
    scale: Timescale,
    colIndex: number,
    relativeX: number,
  ): Date {
    const dates = this.timelineDates();
    const col = dates[colIndex];
    const colWidth = this.config()?.colWidth ?? 0;

    if (scale === Timescale.Month) {
      const daysInMonth = moment(col.date).daysInMonth();
      const day = Math.ceil((relativeX % colWidth) / (colWidth / daysInMonth));

      return moment(col.date).date(day).toDate();
    }

    if (scale === Timescale.Week) {
      const day = Math.ceil((relativeX % colWidth) / (colWidth / 7));

      return moment(col.date)
        .add(day - 1, 'day')
        .toDate();
    }

    return col.date;
  }

  private getWidthOfDayBasedOnScale(scale: Timescale): number {
    const colWidth = this.config()?.colWidth;

    if (scale === Timescale.Month) {
      return colWidth / 30; // Approximate width of a day in month view
    }

    if (scale === Timescale.Week) {
      return colWidth / 7; // Width of a day in week view
    }

    return colWidth; // In day or hour view, the column represents a day or hour respectively
  }

  private generateTimelineColumns(
    config: TimescaleConfig,
    start: Date,
    end: Date,
  ): { label: string; date: Date }[] {
    const scale = config.scale;
    const result: { label: string; date: Date }[] = [];
    const current = moment(start).startOf(scale);

    while (current.toDate() <= end) {
      result.push({
        label: this.getDateLabel(current.toDate(), scale),
        date: current.toDate(),
      });

      current.add(1, scale.toLowerCase() as moment.unitOfTime.DurationConstructor);
    }

    return result;
  }

  private getDateLabel(date: Date, scale: Timescale): string {
    const momentDate = moment(date);

    switch (scale) {
      case Timescale.Month:
        return momentDate.format('MMM YYYY');
      case Timescale.Week: {
        const startOfWeek = momentDate.startOf('week').format('MMM D');
        const endOfWeek = momentDate.endOf('week').format('D, YYYY');
        return `${startOfWeek} - ${endOfWeek}`;
      }
      default:
        return momentDate.format('MMM D, YYYY');
    }
  }
}
