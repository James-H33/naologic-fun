import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationService } from '@common/services/application.service';
import { TimelineDocument } from '@common/types/timeline-document.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViewsAPIService {
  http = inject(HttpClient);
  appService = inject(ApplicationService);
  baseUrl = this.appService.getBaseApiUrl();
  apiUrl = `${this.baseUrl}/views`;

  getTimelines(): Observable<TimelineDocument[]> {
    return this.http.get<TimelineDocument[]>(`${this.apiUrl}/timelines`).pipe(
      tap((response: TimelineDocument[]) => {
        console.log('Received timelines from API:', response);
      }),
    );
  }
}
