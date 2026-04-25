import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { userManager } from './keycloak.config';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <OidcAuthProvider
      userManager={userManager}
      onSigninCallback={() => {
        // Clean up ?code=&state= query params without page reload.
        // CallbackPage handles the actual React Router navigation to /orders.
        window.history.replaceState({}, document.title, window.location.pathname);
      }}
    >
      {children}
    </OidcAuthProvider>
  );
}
