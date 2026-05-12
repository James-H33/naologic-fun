import { TimelineDocument } from '@common/types/timeline-document.interface';
import { ViewType } from '@common/types/view-type.enum';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ViewsActions = createActionGroup({
  source: 'Views',
  events: {
    setView: props<{ viewId: string; viewType: ViewType }>(),
    loadView: props<{ viewId: string }>(),
    loadViewSuccess: props<{ viewData: { viewId: string; viewType: ViewType } }>(),

    loadTimelines: emptyProps(),
    loadTimelinesSuccess: props<{ timelines: TimelineDocument[] }>(),

    createTimeline: props<{ timeline: TimelineDocument }>(),
  },
});
