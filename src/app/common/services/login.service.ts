import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationService } from '@common/services/application.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  http = inject(HttpClient);
  applicationService = inject(ApplicationService);
  router = inject(Router);
  baseUrl = this.applicationService.getBaseApiUrl();

  login(credentials: { username: string; password: string }) {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }
}
