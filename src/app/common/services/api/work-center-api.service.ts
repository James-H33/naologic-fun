import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationService } from '@common/services/application.service';
import { NewWorkCenter } from '@common/types/new-work-center.interface';
import { WorkCenterDocument } from '@common/types/work-center-document.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkCenterAPIService {
  http = inject(HttpClient);
  appService = inject(ApplicationService);
  baseUrl = this.appService.getBaseApiUrl();
  apiUrl = `${this.baseUrl}/work-centers`;

  createWorkCenter(body: NewWorkCenter): Observable<WorkCenterDocument> {
    return this.http.post<WorkCenterDocument>(`${this.apiUrl}`, body).pipe(
      tap(() => {
        console.log('Work center created successfully');
      }),
    );
  }

  getWorkCenters(ids: string[]): Observable<WorkCenterDocument[]> {
    return this.http.post<WorkCenterDocument[]>(`${this.baseUrl}/work-centers/bulk`, { ids }).pipe(
      tap((response: WorkCenterDocument[]) => {
        console.log('Received work centers from API:', response);
      }),
    );
  }
}
