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
        // Full navigation to /orders after PKCE callback — replaceState alone
        // doesn't notify React Router, leaving the page stuck on CallbackPage
        window.location.replace('/orders');
      }}
    >
      {children}
    </OidcAuthProvider>
  );
}
