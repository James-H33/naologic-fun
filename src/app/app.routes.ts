import { Routes } from '@angular/router';
import { authTokenResolver } from '@common/resolvers/auth-token.resolver';
import { workspaceIdResolver } from '@common/resolvers/workspace.resolver';
import { WorkOrdersGanttComponent } from './gantt/work-orders-gantt.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { authGuard } from '@common/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: ':workspaceId',
    resolve: {
      workspaceId: workspaceIdResolver,
      authToken: authTokenResolver,
    },
    canActivate: [authGuard],
    children: [
      {
        path: 'timeline/:viewId',
        component: WorkOrdersGanttComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
