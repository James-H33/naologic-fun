import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ApplicationActions = createActionGroup({
  source: 'Application',
  events: {
    init: emptyProps(),
    initSuccess: props<{ workspaceId: string }>(),
  },
});
