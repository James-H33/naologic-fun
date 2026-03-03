import { Routes } from '@angular/router';
import { WorkordersComponent } from './workorders/workorders.component';

export const routes: Routes = [
  {
    path: 'timeline/:viewId',
    component: WorkordersComponent,
  },
  {
    path: '**',
    redirectTo: 'timeline/123',
  },
];
