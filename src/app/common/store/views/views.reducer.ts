import { TimelineDocument } from '@common/types/timeline-document.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { ViewsActions } from './views.actions';

interface ViewsState {
  viewId: string;
  viewType: string;
  timelines: TimelineDocument[];
}

export const initialViewsState: ViewsState = {
  viewId: '',
  viewType: '',
  timelines: [],
};

export const viewsFeature = createFeature({
  name: 'views',
  reducer: createReducer<ViewsState>(
    initialViewsState,

    on(ViewsActions.setView, (state, { viewId, viewType }) => ({
      ...state,
      viewId,
      viewType,
    })),

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
