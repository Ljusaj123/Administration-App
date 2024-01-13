import { Component, OnInit } from "@angular/core";
import { OAuthService, UrlHelperService } from "angular-oauth2-oidc";
import { authCodeFlowConfig } from "../../auth-config";
import { JwksValidationHandler } from "angular-oauth2-oidc-jwks";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
  providers: [OAuthService, UrlHelperService],
})
export class NavbarComponent implements OnInit {

  constructor(private oauthService: OAuthService) {
    this.oauthService.setStorage(sessionStorage);
  }

  ngOnInit(): void {
    this.consfigureSingleSignOn();
  }

  consfigureSingleSignOn() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.oauthService.logOut(true);
  }

  get token() {
    const claims = this.oauthService.getIdentityClaims();
    return claims ?? null;
  }
}
