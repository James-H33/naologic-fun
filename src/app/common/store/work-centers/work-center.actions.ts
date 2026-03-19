import { NewWorkCenter } from '@common/types/new-work-center.interface';
import { WorkCenterDocument } from '@common/types/work-center-document.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const WorkCenterActions = createActionGroup({
  source: 'WorkCenter',
  events: {
    loadWorkCenters: emptyProps(),
    loadWorkCentersSuccess: props<{ workCenters: WorkCenterDocument[] }>(),
    createWorkCenter: props<{ workCenter: NewWorkCenter }>(),
    createWorkCenterSuccess: props<{ workCenters: WorkCenterDocument[] }>(),
    addWorkCenters: props<{ workCenters: WorkCenterDocument[] }>(),
    addWorkCentersSuccess: props<{ workCenters: WorkCenterDocument[] }>(),
    toggleCreateWorkCenterForm: props<{ open: boolean }>(),
  },
});
