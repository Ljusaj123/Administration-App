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

  getAllUsers(): Observable<any> {
    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + sessionStorage.getItem("access_token")
    );

    return this.http.get(this.baseUrl, {
      headers: headers,
    });
  }

  getSingleUser(id: string): Observable<any> {
    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + sessionStorage.getItem("access_token")
    );

    return this.http.get(this.baseUrl + id, {
      headers: headers,
    });
  }

  deleteUser(id: string): Observable<any> {
    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + sessionStorage.getItem("access_token")
    );

    return this.http.delete(this.baseUrl + id, {
      headers: headers,
    });
  }

  updateUser(user: any, id: string): Observable<any> {
    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + sessionStorage.getItem("access_token")
    );

    const body = user;

    return this.http.put(this.baseUrl + id, body, {
      headers: headers,
    });
  }

  createUser(user: any): Observable<any> {
    let headers = new HttpHeaders().set(
      "Authorization",
      "Bearer " + sessionStorage.getItem("access_token")
    );

    const body = user;

    return this.http.post(this.baseUrl, body, {
      headers: headers,
    });
  }
}
