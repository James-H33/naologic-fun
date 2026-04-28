import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WorkCenterAPIService } from '@common/services/api/work-center-api.service';
import { WorkOrderAPIService } from '@common/services/api/work-order-api.service';
import { ApplicationService } from '@common/services/application.service';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, tap, switchMap } from 'rxjs';

interface ViewDataResponse {
  viewId: string;
  name: string;
  workOrderIds: string[];
  workCenterIds: string[];
}

@Injectable({
  providedIn: 'root',
})
export class GanttService {
  http = inject(HttpClient);
  appService = inject(ApplicationService);
  baseUrl = this.appService.getBaseApiUrl();
  store = inject(Store);
  workOrderAPIService = inject(WorkOrderAPIService);
  workCenterAPIService = inject(WorkCenterAPIService);

  getViewData(viewId: string): Observable<ViewDataResponse> {
    return this.http.get<ViewDataResponse>(`${this.baseUrl}/views/view/${viewId}`).pipe(
      tap((response: ViewDataResponse) => {
        console.log('Received view data from API:', response);
      }),
    );
  }

  getFullViewData(viewId: string) {
    return this.getViewData(viewId).pipe(
      switchMap(({ workOrderIds, workCenterIds, ...data }) => {
        return combineLatest([
          this.workOrderAPIService.getWorkOrders(workOrderIds),
          this.workCenterAPIService.getWorkCenters(workCenterIds),
        ]).pipe(
          map(([workOrders, workCenters]) => {
            return {
              ...data,
              workOrderIds,
              workCenterIds,
              workOrders,
              workCenters,
            };
          }),
        );
      }),
    );
  }
}
