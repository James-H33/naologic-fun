import { inject, Injectable } from '@angular/core';
import { selectWorkspaceId } from '@common/store/application/application.selectors';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private store = inject(Store);
  private workspaceId = this.store.selectSignal(selectWorkspaceId);
  private WORKSPACE_ID_KEY = 'WORKSPACE_ID_KEY';

  public workspaceId$ = this.store.select(selectWorkspaceId);

  getBaseApiUrl(): string {
    return 'http://localhost:3000';
  }

  getWorkspaceId(): string | null {
    return this.workspaceId();
  }

  getWorkspaceIdFromStorage(): string | null {
    return localStorage.getItem(this.WORKSPACE_ID_KEY);
  }
}
