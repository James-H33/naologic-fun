export class IntersectingWorkOrderMap {
  private map: Record<string, boolean> = {};
  private isVisibleCount = 0;

  set(workOrderId: string, isIntersecting: boolean): void {
    const previousValue = !!this.map[workOrderId];

    if (previousValue !== isIntersecting) {
      if (isIntersecting) {
        this.isVisibleCount++;
      } else {
        this.isVisibleCount--;
      }
    }

    this.map[workOrderId] = isIntersecting;
  }

  isAnyWorkOrderVisible(): boolean {
    return this.isVisibleCount > 0;
  }

  getWorkOrdersNotInViewCount(): number {
    return Object.keys(this.map).length - this.isVisibleCount;
  }

  clear(): void {
    this.map = {};
    this.isVisibleCount = 0;
  }
}
