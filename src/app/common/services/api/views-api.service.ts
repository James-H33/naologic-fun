import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationService } from '@common/services/application.service';
import { GetTimelinesResponse } from '@common/types/response/get-timelines-response.interface';
import { TimelineDocument } from '@common/types/timeline-document.interface';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViewsAPIService {
  http = inject(HttpClient);
  appService = inject(ApplicationService);
  baseUrl = this.appService.getBaseApiUrl();
  apiUrl = `${this.baseUrl}/views`;

  getTimelines(): Observable<TimelineDocument[]> {
    return this.http.get<GetTimelinesResponse>(`${this.apiUrl}/timelines`).pipe(
      map((response: GetTimelinesResponse) => {
        return response.data.timelines;
      }),
      tap((response: TimelineDocument[]) => {
        console.log('Received timelines from API:', response);
      }),
    );
  }
}
