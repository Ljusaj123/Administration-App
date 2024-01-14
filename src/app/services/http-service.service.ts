import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private http: HttpClient, private oauthService: OAuthService) {}

  baseUrl: string =
    "https://keycloak-tt-keycloak-stage.apps.ocp.thingstalk.eu/admin/realms/test-realm1/users/";

  headers = new HttpHeaders().set(
    "Authorization",
    "Bearer " + sessionStorage.getItem("access_token")
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

  updateUser(user: any, id: string): Observable<any> {
    const body = user;

    return this.http.put(this.baseUrl + id, body, {
      headers: this.headers,
    });
  }

  createUser(user: any): Observable<any> {
    const body = user;

    return this.http.post(this.baseUrl, body, {
      headers: this.headers,
    });
  }
}
