import { Routes } from '@angular/router';
import { WorkOrdersGanttComponent } from './gantt/work-orders-gantt.component';
import { workspaceIdResolver } from '@common/resolvers/workspace.resolver';

export const routes: Routes = [
  {
    path: 'timeline/:viewId',
    component: WorkOrdersGanttComponent,
    resolve: {
      resolver: workspaceIdResolver,
    },
  },
  {
    path: '**',
    redirectTo: 'timeline/123',
  },
];
