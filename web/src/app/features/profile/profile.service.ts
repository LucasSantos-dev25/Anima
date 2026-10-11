import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '@core/auth/auth.models';
import { environment } from '@env/environment';

export interface UpdateProfileRequest {
  name: string;
  phone: string | null;
  birthDate: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/users/me`;

  get(): Observable<User> {
    return this.http.get<User>(this.url);
  }

  update(body: UpdateProfileRequest): Observable<User> {
    return this.http.put<User>(this.url, body);
  }
}