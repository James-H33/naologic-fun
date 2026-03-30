import { NgModule } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { applicationFeature } from './application.reducer';
import * as applicationEffects from './application.effects';

@NgModule({
  providers: [
    provideStore(),
    provideState(applicationFeature),
    provideEffects([applicationEffects]),
  ],
})
export class ApplicationStoreModule {}
