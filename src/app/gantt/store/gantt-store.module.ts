import { NgModule } from '@angular/core';
import { provideState } from '@ngrx/store';
import { ganttFeature } from './gantt.reducer';
import * as ganttEffects from './gantt.effects';
import { provideEffects } from '@ngrx/effects';

@NgModule({
  providers: [provideState(ganttFeature), provideEffects([ganttEffects])],
})
export class GanttStoreModule {}
