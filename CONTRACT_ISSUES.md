# CONTRACT_ISSUES

| ID | Leírás | Érintett service | Státusz |
|---|---|---|---|
| CI-001 | CSP `connect-src` nem tartalmazza `https://joinerytech.hu` — OIDC discovery és token exchange böngészőből blokkolva | infra/nginx | OPEN |
| CI-002 | Supplier UI hiányzik a portálból — nincs `/suppliers` route, nincs `supplier-list` testid. `GET /bff/procurement/suppliers` endpoint FE-n nem használt. Flow 07 E2E tesztek skip-elve. | orchestrator/bff + fe | OPEN |
