import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { WorkOrderStoreModule } from './workorders/store/work-order/work-order-store.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    importProvidersFrom([
      // Stores
      WorkOrderStoreModule,
    ]),
  ],
};
