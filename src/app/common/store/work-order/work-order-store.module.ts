import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { workOrderFeature } from './work-order.reducer';
import * as workOrderEffects from './work-order.effects';

@NgModule({
  providers: [provideStore(), provideState(workOrderFeature), provideEffects([workOrderEffects])],
})
export class WorkOrderStoreModule {}
