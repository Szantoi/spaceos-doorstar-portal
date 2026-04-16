import { useAuth } from 'react-oidc-context';

export function DashboardPage() {
  const auth = useAuth();
  const name = auth.user?.profile?.name ?? auth.user?.profile?.preferred_username ?? 'Felhasználó';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800" data-testid="welcome-message">
          Üdvözöljük, {name}!
        </h1>
        <p className="mt-4 text-gray-600">Doorstar Portal — Vezérlőpult</p>
      </div>
    </div>
  );
}
