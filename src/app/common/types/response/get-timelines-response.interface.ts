import { TimelineDocument } from '../timeline-document.interface';

export interface GetTimelinesResponse {
  data: {
    timelines: TimelineDocument[];
  };
}
