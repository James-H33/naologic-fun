import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationService } from '@common/services/application.service';
import { Observable, tap } from 'rxjs';

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

  getViewData(viewId: string): Observable<ViewDataResponse> {
    return this.http.get<ViewDataResponse>(`${this.baseUrl}/views/view/${viewId}`).pipe(
      tap((response: ViewDataResponse) => {
        console.log('Received view data from API:', response);
      }),
    );
  }
}
