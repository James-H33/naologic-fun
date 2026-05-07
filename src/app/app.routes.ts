import { Routes } from '@angular/router';
import { authGuard } from '@common/guards/auth.guard';
import { authTokenResolver } from '@common/resolvers/auth-token.resolver';
import { workspaceIdResolver } from '@common/resolvers/workspace.resolver';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
// import { ViewsComponent } from './views/views.component';

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
    path: ':workspaceId/v',
    resolve: {
      workspaceId: workspaceIdResolver,
      authToken: authTokenResolver,
    },
    canActivate: [authGuard],
    loadChildren: () => import('./views/views.routes').then((m) => m.viewsRoutes),

    // component: ViewsComponent,
    // children: [
    // {
    //   path: 'timeline/:viewId',
    //   component: WorkOrdersGanttComponent,
    // },
    // ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
