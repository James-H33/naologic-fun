import { createFeature, createReducer, on } from '@ngrx/store';
import { ApplicationActions } from './application.actions';

interface ApplicationState {
  workspaceId: string | null;
}

export const initialApplicationState: ApplicationState = {
  workspaceId: null,
};

export const applicationFeature = createFeature({
  name: 'application',
  reducer: createReducer<ApplicationState>(
    initialApplicationState,

    on(ApplicationActions.initSuccess, (state, { workspaceId }) => {
      return {
        ...state,
        workspaceId,
      };
    }),
  ),
});
