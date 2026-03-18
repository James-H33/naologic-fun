import { NewWorkCenter } from '@common/types/new-work-center.interface';
import { WorkCenterDocument } from '@common/types/work-center-document.interface';
import { createAction, props } from '@ngrx/store';

export const loadWorkCenters = createAction('[WorkCenter] Load Work Centers');

export const loadWorkCentersSuccess = createAction(
  '[WorkCenter] Load Work Centers Success',
  props<{ workCenters: WorkCenterDocument[] }>(),
);

export const createWorkCenter = createAction(
  '[WorkCenter] Create Work Center',
  props<{ workCenter: NewWorkCenter }>(),
);

export const createWorkCenterSuccess = createAction(
  '[WorkCenter] Create Work Center Success',
  props<{ workCenters: WorkCenterDocument[] }>(),
);

export const addWorkCenters = createAction(
  '[WorkCenter] Add Work Centers',
  props<{ workCenters: WorkCenterDocument[] }>(),
);

export const addWorkCentersSuccess = createAction(
  '[WorkCenter] Add Work Center Success',
  props<{ workCenters: WorkCenterDocument[] }>(),
);

export const toggleCreateWorkCenterForm = createAction(
  '[WorkCenter] Toggle Create Work Center Form',
  props<{ open: boolean }>(),
);
