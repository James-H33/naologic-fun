import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ApplicationActions = createActionGroup({
  source: 'Application',
  events: {
    init: emptyProps(),
    initSuccess: props<{ workspaceId: string; authToken: string }>(),
    login: props<{ username: string; password: string }>(),
    loginSuccess: props<{ workspaceId: string; authToken: string }>(),
    logout: emptyProps(),
  },
});
