import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div
      className="min-h-screen bg-slate-50 flex items-center justify-center px-4"
      data-testid="not-found-page"
    >
      <div className="text-center">
        <p className="text-8xl font-bold text-slate-300 mb-4" aria-hidden="true">
          404
        </p>
        <h1 className="text-2xl font-bold text-slate-700 mb-2">Az oldal nem található</h1>
        <p className="text-slate-500 text-sm mb-6">
          A keresett oldal nem létezik vagy áthelyezésre került.
        </p>
        <Link
          to="/orders"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          data-testid="back-to-home-link"
        >
          Vissza a főoldalra
        </Link>
      </div>
    </div>
  );
}
