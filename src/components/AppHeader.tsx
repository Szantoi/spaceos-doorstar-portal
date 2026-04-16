import { Link, NavLink } from 'react-router-dom';

export function AppHeader() {
  return (
    <header className="bg-white border-b border-slate-200 print:hidden" data-testid="app-header">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/orders"
          className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors"
        >
          Doorstar Portal
        </Link>
        <nav className="flex items-center gap-4" aria-label="Fő navigáció">
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-800'
              }`
            }
          >
            Rendelések
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-800'
              }`
            }
            data-testid="profile-nav-link"
          >
            Profil
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
