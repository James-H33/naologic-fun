import { createSelector } from '@ngrx/store';
import { applicationFeature } from './application.reducer';

export const { selectWorkspaceId, selectAuthToken } = applicationFeature;

export const selectAppCredentials = createSelector(
  selectWorkspaceId,
  selectAuthToken,
  (workspaceId, authToken) => ({ workspaceId, authToken }),
);
