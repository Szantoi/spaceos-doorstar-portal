# SpaceOS.Doorstar.Portal — CLAUDE.md
## Terminál: fe | Mailbox: /opt/spaceos/docs/mailbox/fe/
## Stack: React 18, Vite, TypeScript, pnpm, oidc-client-ts, Tailwind CSS
## Pipeline: INBOX → CODE → BUILD → TEST → REVIEW → SECURITY → OUTBOX

---

## Working Directory Constraint

Your working directory is `/opt/spaceos/spaceos-doorstar-portal/`. You MUST NOT:
- `cd` to or read files from `spaceos-kernel/`, `spaceos-orchestrator/`,
  `spaceos-modules-*/`, `spaceos-infra/`, `spaceos-e2e/`, or any other
  SpaceOS backend repository
- Run `psql`, `systemctl`, `journalctl`, or any system administration command
- Access `/opt/spaceos/` outside your own directory
- Access `/etc/spaceos/` (production secrets)

These directories are technically readable (gabor user), but accessing them
violates the Contract-First architecture. If you need backend information,
file a CONTRACT_ISSUES.md entry (see below).

---

## Dispatcher Integration

This session runs inside the SpaceOS tmux dispatcher as `spaceos-fe`.
Tasks arrive via `mailbox/fe/inbox/`, results go to `mailbox/fe/outbox/`.

**Mailbox paths** (relative to `/opt/spaceos/docs/`):
- Inbox:  `mailbox/fe/inbox/`
- Outbox: `mailbox/fe/outbox/`

**On task completion:**
1. Run all checks: `pnpm build && pnpm test && pnpm lint && pnpm typecheck`
2. Write DONE to `mailbox/fe/outbox/YYYY-MM-DD_NNN_<slug>-done.md`
3. Wait for next inbox — do NOT start unsolicited work

---

## Contract-First Architecture

The FE consumes the BFF API at `/bff/`. The BFF is deployed at the Orchestrator (port 3000).
**Never call backend services directly** (Kernel :5000, Inventory :5004, etc.).

BFF routes available:
- `GET /bff/health` — health check
- `GET/POST /bff/api/*` → Kernel
- `GET /bff/nodes/*` → Kernel /api/nodes/
- `GET /bff/inventory/*` → Inventory module
- `GET /bff/cutting/*` → Cutting module
- Auth: Bearer token (KC OIDC) required on all /bff/ routes

---

## AUTH — Keycloak OIDC

**Client:** `portal-app` (realm: spaceos)
**PKCE flow** — response_type: code
**Token storage: InMemoryWebStorage CSAK** — sessionStorage és localStorage TILOS (SEC-UI-02)

```typescript
// src/auth/keycloak.config.ts
import { UserManager, InMemoryWebStorage } from 'oidc-client-ts';

export const userManager = new UserManager({
  authority: import.meta.env.VITE_KEYCLOAK_URL
    + '/realms/' + import.meta.env.VITE_KEYCLOAK_REALM,
  client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
  redirect_uri: window.location.origin + '/callback',
  post_logout_redirect_uri: window.location.origin,
  response_type: 'code',
  scope: 'openid profile spaceos-tenant-scope',
  automaticSilentRenew: true,
  silentRequestTimeoutInSeconds: 10,
  userStore: new InMemoryWebStorage(),
  stateStore: new InMemoryWebStorage(),
});
```

**.env.local (nem commitolni):**
```
VITE_KEYCLOAK_URL=http://localhost:8080/auth
VITE_KEYCLOAK_REALM=spaceos
VITE_KEYCLOAK_CLIENT_ID=portal-app
VITE_BFF_BASE_URL=http://localhost:3000
```

---

## CONTRACT_ISSUES.md protokoll

Ha backend-től valamit kell (új endpoint, bug fix, schema clarification):
1. Írj egy sort `CONTRACT_ISSUES.md`-be: `CI-NNN | leírás | érintett service`
2. Outbox DONE üzenetben jelezd: `CONTRACT_ISSUE: CI-NNN filed`
3. Root koordinátor brige-eli a megfelelő backend terminálnak
**Ne írj közvetlenül más terminál mailbox-ába.**

---

## Security constraints (active findings)

- **SEC-UI-02** — InMemoryWebStorage kötelező, sessionStorage/localStorage TILOS
- **SEC-UI-03** — `sourcemap: false` production build-ben (vite.config.ts)
- **SEC-UI-06** — CSP header: Nginx állítja, FE ne vezessen be inline script-et
- **SEC-UI-08** — XSS: minden user-supplied content sanitize (DOMPurify ha szükséges)
- **SEC-UI-09** — Token nem logolható (console.log, Sentry stb.)
