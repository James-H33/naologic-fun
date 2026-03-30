import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApplicationService } from '@common/services/application.service';
import { CreateWorkOrderDto } from '@common/types/create-work-order.dto';
import { UpdateWorkOrderDto } from '@common/types/update-work-order.dto';
import { WorkOrderDocument } from '@common/types/work-order-document.interface';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkOrderAPIService {
  http = inject(HttpClient);
  appService = inject(ApplicationService);
  baseUrl = this.appService.getBaseApiUrl();
  apiUrl = `${this.baseUrl}/work-orders`;

  getWorkOrders(ids: string[]): Observable<WorkOrderDocument[]> {
    return this.http.post<WorkOrderDocument[]>(`${this.baseUrl}/work-orders/bulk`, { ids }).pipe(
      tap((response: WorkOrderDocument[]) => {
        console.log('Received work orders from API:', response);
      }),
    );
  }

  createWorkOrder(body: CreateWorkOrderDto): Observable<WorkOrderDocument> {
    return this.http.post<WorkOrderDocument>(`${this.apiUrl}`, body).pipe(
      tap(() => {
        console.log('Work order created successfully');
      }),
    );
  }

  updateWorkOrder(body: UpdateWorkOrderDto): Observable<WorkOrderDocument> {
    return this.http.put<WorkOrderDocument>(`${this.apiUrl}`, body).pipe(
      tap(() => {
        console.log('Work order updated successfully');
      }),
    );
  }
}
