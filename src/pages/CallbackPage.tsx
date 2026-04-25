import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

export function CallbackPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/orders', { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">Hiba: {auth.error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Bejelentkezés folyamatban...</p>
    </div>
  );
}
