import { Routes } from '@angular/router';
import { WorkOrdersGanttComponent } from './gantt/work-orders-gantt.component';

export const routes: Routes = [
  {
    path: 'timeline/:viewId',
    component: WorkOrdersGanttComponent,
  },
  {
    path: '**',
    redirectTo: 'timeline/123',
  },
];
