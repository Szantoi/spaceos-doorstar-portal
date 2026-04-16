import { useProfile } from '../hooks/useProfile';
import { userManager } from '../auth/keycloak.config';

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();

  const handleLogout = () => {
    userManager.signoutRedirect();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500" data-testid="profile-loading">Betöltés...</div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-600" data-testid="profile-error">
          Nem sikerült betölteni a profil adatokat.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Profil</h1>

        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 text-xl font-bold"
              aria-hidden="true"
              data-testid="profile-avatar"
            >
              {getInitials(profile.name)}
            </div>
            <div>
              {profile.name && (
                <p className="text-lg font-semibold text-slate-800" data-testid="profile-name">
                  {profile.name}
                </p>
              )}
              {profile.email && (
                <p className="text-sm text-slate-500" data-testid="profile-email">
                  {profile.email}
                </p>
              )}
            </div>
          </div>

          {/* Tenant */}
          {profile.tenantName && (
            <div className="mb-4">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Szervezet</p>
              <p className="text-sm text-slate-700" data-testid="profile-tenant">
                {profile.tenantName}
              </p>
            </div>
          )}

          {/* Roles */}
          {profile.roles.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Szerepkörök</p>
              <div className="flex flex-wrap gap-2" data-testid="profile-roles">
                {profile.roles.map((role) => (
                  <span
                    key={role}
                    className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">Fiók</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
            data-testid="logout-button"
          >
            Kijelentkezés
          </button>
        </div>
      </div>
    </div>
  );
}
