---
name: spaceos-terminal
description: >
  SpaceOS terminál kommunikációs skill. Használd amikor üzeneteket kell olvasni
  ("olvasd le az üzeneteidet", "olvasd el az inbox-odat", "van új feladatod?"),
  vagy amikor egy feladatot befejeztél és outbox üzenetet kell írni
  ("kész vagyok", "befejeztem", "írj DONE üzenetet").
  A skill a spaceos-fe terminálra vonatkozik — lefedi az inbox olvasás rituálját,
  a kötelező build+test gate-et, és a DONE/BLOCKED outbox sablonokat.
---

# SpaceOS Terminál — Kommunikációs Protokoll

## 1. Inbox olvasás — "olvasd le az üzeneteidet"

```bash
# UNREAD üzenetek keresése
grep -rl "status: UNREAD" ./mailbox/inbox/ 2>/dev/null

# Ha üres: legfrissebb fájl
ls -lt ./mailbox/inbox/ | grep "^-" | head -3
```

A legfrissebb UNREAD fájlt olvasd el, majd módosítsd:
```
status: UNREAD  →  status: READ
```

Ha több UNREAD van: a legalacsonyabb sorszámút dolgozd fel először.

## 2. Feladat végrehajtás — kötelező gate

**Minden feladatnál, kivétel nélkül:**

```
INBOX READ → IMPLEMENTÁLÁS → BUILD → TEST → OUTBOX
```

### Build + test gate

| Terminál | Build | Test |
|---|---|---|
| FE (spaceos-fe) | `pnpm build` → 0 error, dist/ létrejön | `pnpm test` → minden zöld |

**Kiegészítő ellenőrzések:**
```bash
pnpm lint        # → 0 hiba
pnpm typecheck   # → tsc --noEmit, 0 error
```

**Ha a build vagy test nem zöld: NE írj DONE-t.** Javítsd, aztán futtasd újra.

## 3. DONE üzenet írása

Amikor a feladat kész és a build+test gate átment:

**Fájlnév:** `YYYY-MM-DD_NNN_<slug>-done.md` → `./mailbox/outbox/`

NNN = az inbox üzenet sorszáma (pl. MSG-FE-007 → 007).

```yaml
---
id: MSG-FE-<NNN>-DONE
from: fe
to: root
type: done
priority: <az inbox üzenet prioritása>
status: UNREAD
ref: MSG-FE-<NNN>
created: YYYY-MM-DD
---
```

⚠️ **`type` mező szabályai — kötelező betartani:**

| Állapot | `type` értéke |
|---|---|
| Feladat sikeresen teljesítve | `done` |
| Feladat nem teljesíthető, segítség kell | `blocked` |
| Döntést kér a root-tól | `question` |

**`type: response` TILOS** — nem hordoz státusz információt, a root nem tudja kezelni.

**Kötelező szekciók** — részletes sablonok: `references/outbox-templates.md`

```markdown
## Összefoglaló
Mit implementáltál, mely fájlok változtak, commit hash.

## Tesztek
Hány teszt futott, mind zöld? Új tesztek száma?
(Utolsó sor a test output-ból másolva)

## Security review
Ellenőrzött pontok: InMemoryWebStorage, nincs dangerouslySetInnerHTML, auth guard, sourcemap.

## Kockázatok / kérdések
Ha van → status: BLOCKED és leírás. Ha nincs → "Nincsenek."
```

## 4. BLOCKED üzenet — ha elakadsz

Ha a feladatot nem tudod befejezni önállóan (hiányzó info, backend contract, infrastruktúra):

**Fájlnév:** `YYYY-MM-DD_NNN_<slug>-blocked.md` → `./mailbox/outbox/`

```yaml
---
id: MSG-FE-<NNN>-BLOCKED
from: fe
to: root
type: blocked
priority: high
status: UNREAD
ref: MSG-FE-<NNN>
created: YYYY-MM-DD
---
```

```markdown
## Mi blokkol
Konkrét technikai leírás — mi hiányzik, mi nem működik.

## Mit próbáltam
Legalább egy diagnózis kísérlet.

## Kérés a root-tól
Mit kell dönteni / kiadni ahhoz, hogy folytatni tudjam.
```

**Backend-től kell valami?** Ne írj más terminál mailbox-ába.
Írd a `CONTRACT_ISSUES.md`-be, és jelezd a DONE üzenetben: `CONTRACT_ISSUE: CI-NNN filed`.

**Soha ne folytasd találgatással.** Ha 2 próbálkozás után sem megy: BLOCKED.

## 5. Mailbox elérési utak

| Terminál | Inbox | Outbox |
|---|---|---|
| FE | `./mailbox/inbox/` | `./mailbox/outbox/` |
| (abszolút) | `/opt/spaceos/docs/mailbox/fe/inbox/` | `.../fe/outbox/` |

## 6. Amit soha nem szabad

- DONE outbox írása build/test failure mellett
- Találgatással folytatni, ha elakadtál (→ BLOCKED)
- Kódot módosítani a DONE után, outbox nélkül
- Más terminál repo-jába nyúlni (`spaceos-kernel/`, `spaceos-orchestrator/`, stb.)
- `TODO` / `FIXME` kommentet commitolni
- Token-t logolni (`console.log`, Sentry stb.)
- `localStorage` vagy `sessionStorage` használata tokenhez (SEC-UI-02)
