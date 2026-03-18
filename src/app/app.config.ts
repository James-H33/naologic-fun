import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { WorkOrderStoreModule } from '@common/store/work-order/work-order-store.module';
import { WorkCenterStoreModule } from '@common/store/work-centers/work-center-store.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    importProvidersFrom([
      // Stores
      WorkOrderStoreModule,
      WorkCenterStoreModule,
    ]),
  ],
};
