import { Routes } from '@angular/router';
import { ViewsComponent } from './views.component';
import { ViewsTimelinesComponent } from './timelines/views-timelines.component';
import { WorkOrdersGanttComponent } from './gantt/work-orders-gantt.component';

export const viewsRoutes: Routes = [
  {
    path: '',
    component: ViewsComponent,
    children: [
      { path: 'timelines', component: ViewsTimelinesComponent },
      { path: 'timeline/:id', component: WorkOrdersGanttComponent },
    ],
  },
];
