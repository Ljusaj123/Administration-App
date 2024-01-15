import { Component, OnInit } from "@angular/core";
import { OAuthService, UrlHelperService } from "angular-oauth2-oidc";
import { authCodeFlowConfig } from "../../auth-config";
import { JwksValidationHandler } from "angular-oauth2-oidc-jwks";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
  providers: [OAuthService, UrlHelperService],
})
export class NavbarComponent implements OnInit {
  constructor(private authservice: OAuthService, private router: Router) {
    this.authservice.setStorage(sessionStorage);
  }

  ngOnInit(): void {
    this.consfigureSingleSignOn();
  }

  consfigureSingleSignOn() {
    this.authservice.configure(authCodeFlowConfig);
    this.authservice.tokenValidationHandler = new JwksValidationHandler();
    this.authservice.loadDiscoveryDocumentAndLogin();
  }

  login() {
    this.authservice.initCodeFlow();
  }

  logout() {
    this.authservice.logOut(true);
    this.router.navigate(["/welcome"]);
  }

  get token() {
    const claims = this.authservice.getIdentityClaims();
    return claims ?? null;
  }
}
