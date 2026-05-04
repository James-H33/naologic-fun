import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '@common/services/application.service';
import { LoginService } from '@common/services/login.service';
import { SocketService } from '@common/services/socket/socket.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs';
import { ApplicationActions } from './application.actions';

export const getWorkspaceData$ = createEffect(
  (actions$ = inject(Actions), appService = inject(ApplicationService)) => {
    return actions$.pipe(
      ofType(ApplicationActions.init),
      map(() => {
        const workspaceId = appService.getWorkspaceIdFromStorage();
        const authToken = appService.getAuthTokenFromStorage();

        return ApplicationActions.initSuccess({
          workspaceId: workspaceId ?? '',
          authToken: authToken ?? '',
        });
      }),
    );
  },
  { functional: true },
);

export const login$ = createEffect(
  (
    actions$ = inject(Actions),
    loginService = inject(LoginService),
    appService = inject(ApplicationService),
  ) => {
    return actions$.pipe(
      ofType(ApplicationActions.login),
      switchMap((action) => {
        return loginService.login({ username: action.username, password: action.password }).pipe(
          map((response: any) => {
            const workspaceId = response.workspaceId;
            const authToken = response.authToken;

            appService.setCredentials(workspaceId, authToken);
            return ApplicationActions.loginSuccess({ workspaceId, authToken });
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const redirectAfterLogin$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(ApplicationActions.loginSuccess),
      tap((action) => {
        router.navigate([`${action.workspaceId}/timeline/123`]);
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const initializeWebsockets$ = createEffect(
  (actions$ = inject(Actions), socketService = inject(SocketService)) => {
    return actions$.pipe(
      ofType(ApplicationActions.loginSuccess, ApplicationActions.initSuccess),
      tap((action) => {
        socketService.init({ workspaceId: action.workspaceId, authToken: action.authToken });
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const logout$ = createEffect(
  (
    actions$ = inject(Actions),
    appService = inject(ApplicationService),
    router = inject(Router),
  ) => {
    return actions$.pipe(
      ofType(ApplicationActions.logout),
      tap(() => {
        appService.logout();
        router.navigate(['/login']);
      }),
    );
  },
  { functional: true, dispatch: false },
);
