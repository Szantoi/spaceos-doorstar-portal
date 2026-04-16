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
        // Remove OIDC query params from URL and redirect to orders after PKCE callback
        window.history.replaceState({}, document.title, '/orders');
      }}
    >
      {children}
    </OidcAuthProvider>
  );
}
