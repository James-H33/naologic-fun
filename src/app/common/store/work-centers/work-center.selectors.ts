import { createSelector } from '@ngrx/store';
import { workCenterFeature } from './work-center.reducer';
import { WorkCenterDocument } from '@common/types/work-center-document.interface';

export const { selectWorkCenters, selectIsCreateWorkCenterFormOpen, selectNewWorkCenter } =
  workCenterFeature;

export const selectWorkCentersMap = createSelector(selectWorkCenters, (workCenters) => {
  return workCenters.reduce(
    (acc, workCenter) => {
      acc[workCenter.docId] = workCenter;
      return acc;
    },
    {} as Record<WorkCenterDocument['docId'], WorkCenterDocument>,
  );
});
