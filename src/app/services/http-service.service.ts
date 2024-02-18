import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  baseUrl: string =
    'https://keycloak-tt-keycloak-stage.apps.ocp.thingstalk.eu/admin/realms/test-realm1/users/';

  headers: HttpHeaders = new HttpHeaders().set(
    'Authorization',
    'Bearer ' + sessionStorage.getItem('access_token')
  );

  getAllUsers(): Observable<any> {
    return this.http.get(this.baseUrl, {
      headers: this.headers,
    });
  }

  getSingleUser(id: string): Observable<any> {
    return this.http.get(this.baseUrl + id, {
      headers: this.headers,
    });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(this.baseUrl + id, {
      headers: this.headers,
    });
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(this.baseUrl + user.id, user, {
      headers: this.headers,
    });
  }

  createUser(user: User): Observable<any> {
    return this.http.post(this.baseUrl, user, {
      headers: this.headers,
    });
  }
}
