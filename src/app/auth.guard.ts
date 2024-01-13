import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { OAuthService } from "angular-oauth2-oidc";
import { Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(OAuthService);
  const router = inject(Router);

  var hasAccessToken = authService.hasValidAccessToken();
  var hasIdToken = authService.hasValidIdToken();

  if (hasAccessToken && hasIdToken) {
    return true;
  } else {
    router.navigate(["/welcome"]);
    return false;
  }
};
