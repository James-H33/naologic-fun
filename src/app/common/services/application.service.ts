import { inject, Injectable } from '@angular/core';
import {
  selectAuthToken,
  selectWorkspaceId,
} from '@common/store/application/application.selectors';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private store = inject(Store);

  private workspaceId = this.store.selectSignal(selectWorkspaceId);
  private authToken = this.store.selectSignal(selectAuthToken);

  public WORKSPACE_ID_KEY = 'WORKSPACE_ID_KEY';
  public AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';

  public workspaceId$ = this.store.select(selectWorkspaceId);
  public authToken$ = this.store.select(selectAuthToken);

  setCredentials(workspaceId: string, authToken: string): void {
    localStorage.setItem(this.WORKSPACE_ID_KEY, workspaceId);
    localStorage.setItem(this.AUTH_TOKEN_KEY, authToken);
  }

  logout(): void {
    localStorage.removeItem(this.WORKSPACE_ID_KEY);
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
  }

  getBaseApiUrl(): string {
    return 'http://localhost:3000';
  }

  getWorkspaceId(): string | null {
    return this.workspaceId();
  }

  getAuthToken(): string | null {
    return this.authToken();
  }

  getWorkspaceIdFromStorage(): string | null {
    return localStorage.getItem(this.WORKSPACE_ID_KEY);
  }

  getAuthTokenFromStorage(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }
}
