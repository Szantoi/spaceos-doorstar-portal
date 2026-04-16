import { AuthProvider as OidcAuthProvider } from 'react-oidc-context';
import { userManager } from './keycloak.config';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <OidcAuthProvider userManager={userManager}>
      {children}
    </OidcAuthProvider>
  );
}
