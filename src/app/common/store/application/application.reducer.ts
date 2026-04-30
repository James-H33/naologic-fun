import { createFeature, createReducer, on } from '@ngrx/store';
import { ApplicationActions } from './application.actions';

interface ApplicationState {
  workspaceId: string | null;
  authToken: string | null;
}

export const initialApplicationState: ApplicationState = {
  workspaceId: null,
  authToken: null,
};

export const applicationFeature = createFeature({
  name: 'application',
  reducer: createReducer<ApplicationState>(
    initialApplicationState,

    on(ApplicationActions.initSuccess, (state, { workspaceId, authToken }) => {
      return {
        ...state,
        workspaceId,
        authToken,
      };
    }),

    on(ApplicationActions.loginSuccess, (state, { workspaceId, authToken }) => {
      return {
        ...state,
        workspaceId,
        authToken,
      };
    }),

    on(ApplicationActions.logout, (state) => {
      return {
        ...state,
        workspaceId: null,
        authToken: null,
      };
    }),
  ),
});
