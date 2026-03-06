import { computed, Injectable, signal } from '@angular/core';
import { Timescale, TimescaleConfig, TimescalesConfig } from '@common/types/timescales';
import moment from 'moment';

@Injectable()
export class TimelineService {
  initialized$ = signal(false);
  timelineContainer = signal<HTMLElement>(null!);
  timelineBody = signal<HTMLElement>(null!);
  config = signal<TimescaleConfig>(TimescalesConfig[Timescale.Week]);
  dateRange = signal<{ start: Date; end: Date } | null>({
    start: moment().subtract(1, 'year').startOf('year').toDate(),
    end: moment().add(1, 'year').endOf('year').toDate(),
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
  }

  getRelativePositionFromEvent(event: MouseEvent) {
    const gridRect = this.timelineBody()?.getBoundingClientRect();
    const relativeX = event.clientX - Math.floor(gridRect.left);
    const relativeY = event.clientY - Math.floor(gridRect.top);

    return { relativeX, relativeY };
  }

  getPositionOfDate(date: Date): number {
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

  scrollToDate(date: Date) {
    const position = this.getPositionOfDate(date);
    const element = this.timelineContainer();

    if (element) {
      element.scrollLeft = position - element.clientWidth / 2;
    }
  }

  getDateBasedOnClickPosition(event: MouseEvent): Date {
    const { relativeX } = this.getRelativePositionFromEvent(event);
    const colWidth = this.config()?.colWidth;
    const scale = this.config()?.scale;
    const dateIndex = Math.floor(relativeX / colWidth);

    const day = this.getFormulaForDateByClickPosition(scale, dateIndex, relativeX);

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
    dateIndex: number,
    relativeX: number,
  ): Date {
    const dates = this.timelineDates();
    const date = dates[dateIndex];
    const colWidth = this.config()?.colWidth ?? 0;

    if (scale === Timescale.Month) {
      const daysInMonth = moment(date.date).daysInMonth();
      const day = Math.ceil((relativeX % colWidth) / (colWidth / daysInMonth));

      return moment(date.date).date(day).toDate();
    }

    if (scale === Timescale.Week) {
      const day = Math.ceil((relativeX % colWidth) / (colWidth / 7));

      return moment(date.date)
        .add(day - 1, 'day')
        .toDate();
    }

    return date.date;
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
