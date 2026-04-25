import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

// SEC-UI-02 update: sessionStorage for both stores.
// sessionStorage survives F5 reload but clears on tab close — acceptable compromise.
// stateStore: PKCE state/code_verifier must survive the full-page redirect.
// userStore: token must survive F5 reload.

export const userManager = new UserManager({
  authority:
    import.meta.env.VITE_KEYCLOAK_URL +
    '/realms/' +
    import.meta.env.VITE_KEYCLOAK_REALM,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: window.location.origin + '/callback',
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'openid profile spaceos-tenant-scope',
  automaticSilentRenew: true,
  silentRequestTimeoutInSeconds: 10,
  userStore: new WebStorageStateStore({ store: sessionStorage }),
  stateStore: new WebStorageStateStore({ store: sessionStorage }),
});
