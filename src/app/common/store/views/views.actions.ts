import { TimelineDocument } from '@common/types/timeline-document.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ViewsActions = createActionGroup({
  source: 'Views',
  events: {
    loadTimelines: emptyProps(),
    loadTimelinesSuccess: props<{ timelines: TimelineDocument[] }>(),
    createTimeline: props<{ timeline: TimelineDocument }>(),
  },
});
