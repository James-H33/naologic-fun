export interface TimelineDocument {
  id: string;
  name: string;
  dateRange: {
    start: string;
    end: string;
  };
  createdAt: string;
}
