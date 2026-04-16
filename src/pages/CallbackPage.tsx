// AuthProvider (react-oidc-context) automatically processes the PKCE callback
// when it detects ?code= in the URL and calls onSigninCallback to redirect.
// This page is only shown briefly during that processing.
export function CallbackPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Bejelentkezés folyamatban...</p>
    </div>
  );
}
