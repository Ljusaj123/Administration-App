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

  assignRoleToUser(id: string, role: string) {
    const clientId = "9067c388-6ee9-4bb0-a378-c568f7927d32";

    let roleInfo: any = [];

    switch (role) {
      case "ADMIN":
        roleInfo = [
          {
            id: "5e218814-bbb1-474f-91d5-5b4340eed833",
            name: "TESTER",
          },
        ];
        break;
      case "DEVELOPER":
        roleInfo = [
          {
            id: "a1bc9885-5422-4aff-b518-f1a2cf4529c6",
            name: "DEVELOPER",
          },
        ];
        break;
      case "TESTER":
        roleInfo = [
          {
            id: "5e218814-bbb1-474f-91d5-5b4340eed833",
            name: "TESTER",
          },
        ];
    }

    const body = roleInfo;

    return this.http.post(
      this.baseUrl + id + "/role-mappings/clients/" + clientId,
      body,
      { headers: this.headers }
    );
  }

  getUsersRoles(role: string): Observable<any> {
    const clientId = "9067c388-6ee9-4bb0-a378-c568f7927d32";

    return this.http.get(
      `https://keycloak-tt-keycloak-stage.apps.ocp.thingstalk.eu/admin/realms/test-realm1/clients/${clientId}/roles/${role}/users`,
      {
        headers: this.headers,
      }
    );
  }
}
