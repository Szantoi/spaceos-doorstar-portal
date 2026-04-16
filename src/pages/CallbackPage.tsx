import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userManager } from '../auth/keycloak.config';

export function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/login', { replace: true }));
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Bejelentkezés folyamatban...</p>
    </div>
  );
}
