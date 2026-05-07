import { TimelineDocument } from '@common/types/timeline-document.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ViewsActions } from './views.actions';

interface ViewsState {
  timelines: TimelineDocument[];
}

export const initialViewsState: ViewsState = {
  timelines: [],
};

export const viewsFeature = createFeature({
  name: 'views',
  reducer: createReducer<ViewsState>(
    initialViewsState,

    on(ViewsActions.loadTimelinesSuccess, (state, { timelines }) => ({
      ...state,
      timelines,
    })),

    on(ViewsActions.createTimeline, (state, { timeline }) => ({
      ...state,
      timelines: [...state.timelines, timeline],
    })),
  ),
});
