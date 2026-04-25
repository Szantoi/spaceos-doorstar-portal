import { UserManager, WebStorageStateStore, InMemoryWebStorage } from 'oidc-client-ts';

// SEC-UI-02: userStore marad InMemoryWebStorage (token nem kerül sessionStorage-ba)
// stateStore: sessionStorage szükséges — PKCE state/code_verifier túl kell élje a full-page redirectet
const inMemoryStorage = new InMemoryWebStorage();

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
  userStore: new WebStorageStateStore({ store: inMemoryStorage }),
  stateStore: new WebStorageStateStore({ store: sessionStorage }),
});
