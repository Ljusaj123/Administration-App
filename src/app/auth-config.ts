import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  issuer:
    'https://keycloak-tt-keycloak-stage.apps.ocp.thingstalk.eu/realms/test-realm1',
  redirectUri: window.location.origin + '/welcome',
  logoutUrl: window.location.origin + '/welcome',
  clientId: 'test-realm1',
  responseType: 'code',
  oidc: true,
  scope: 'openid profile email offline_access',
  showDebugInformation: true,
};
