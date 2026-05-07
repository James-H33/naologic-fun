import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import * as viewsEffects from './views.effects';
import { viewsFeature } from './views.reducer';
// import { workCenterFeature } from './work-center.reducer';

@NgModule({
  providers: [provideStore(), provideState(viewsFeature), provideEffects([viewsEffects])],
})
export class ViewsStoreModule {}
