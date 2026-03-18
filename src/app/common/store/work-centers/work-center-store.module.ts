import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import * as workCenterEffects from './work-center.effects';
import { workCenterFeature } from './work-center.reducer';

@NgModule({
  providers: [provideStore(), provideState(workCenterFeature), provideEffects([workCenterEffects])],
})
export class WorkCenterStoreModule {}
