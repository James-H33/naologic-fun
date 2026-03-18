import { WorkCenterDocument } from '@common/types/work-center-document.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  addWorkCentersSuccess,
  createWorkCenterSuccess,
  loadWorkCentersSuccess,
  toggleCreateWorkCenterForm,
} from './work-center.actions';
import { NewWorkCenter } from '@common/types/new-work-center.interface';

interface WorkCenterState {
  isCreateWorkCenterFormOpen: boolean;
  workCenters: WorkCenterDocument[];
  newWorkCenter: NewWorkCenter | null;
}

export const initialWorkCenterState: WorkCenterState = {
  isCreateWorkCenterFormOpen: false,
  newWorkCenter: null,
  workCenters: [],
};

export const workCenterFeature = createFeature({
  name: 'workcenter',
  reducer: createReducer<WorkCenterState>(
    initialWorkCenterState,

    on(loadWorkCentersSuccess, (state, { workCenters }) => {
      return {
        ...state,
        workCenters,
      };
    }),

    on(createWorkCenterSuccess, (state, { workCenters }) => {
      return {
        ...state,
        workCenters,
        isCreateWorkCenterFormOpen: false,
        newWorkCenter: null,
      };
    }),

    on(toggleCreateWorkCenterForm, (state, { open }) => {
      return {
        ...state,
        isCreateWorkCenterFormOpen: open,
      };
    }),

    on(addWorkCentersSuccess, (state, { workCenters }) => {
      return {
        ...state,
        workCenters,
      };
    }),
  ),
});
