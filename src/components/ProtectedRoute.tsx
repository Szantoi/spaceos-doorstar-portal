import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';
import { AppHeader } from './AppHeader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Betöltés...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div data-testid="app-shell">
      <AppHeader />
      {children}
    </div>
  );
}
