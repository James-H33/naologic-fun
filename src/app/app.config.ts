import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { WorkOrderStoreModule } from '@common/store/work-order/work-order-store.module';
import { WorkCenterStoreModule } from '@common/store/work-centers/work-center-store.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { workspaceInterceptor } from '@common/interceptors/workspace-id.interceptor';
import { ApplicationStoreModule } from '@common/store/application/application-store.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([workspaceInterceptor])),

    importProvidersFrom([
      // Stores
      ApplicationStoreModule,
      WorkOrderStoreModule,
      WorkCenterStoreModule,
    ]),
  ],
};
