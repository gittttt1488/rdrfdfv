# Tovs Kavo World

Private, original dollhouse game built with React, TypeScript, SVG, Canvas, Vinext and Cloudflare D1. No real-money purchases, chat, ads or child passwords.

## Open and play

Open the deployed private URL and sign in with the Site owner's ChatGPT account. The same account on another device restores the same profile. Choose a username in Profile. A new player starts with 0 Coins and only Basic Brush.

- World: open any of 15 rooms. Drag the character, furniture and purchased decorations. Use Sit, Sleep, Eat, Play or Pick up. Doors advance to the next room.
- Characters: create up to eight characters; choose colors, features and clothing.
- Tovs Kavo Studio: select a tool, color, size and intensity; draw directly on the character. Tools clip to their relevant regions. Undo, clear, blend and local erasing are supported.
- Mini Games: complete a new level for exactly 500 Coins. Replays never pay twice. Jump Adventure deducts 100 Coins for each verified failed round, stopping at zero. Tap/Space requires a release before the next jump/flap.
- Shop: tools cost 100; small items cost 10 or 20. Purchases are atomic. Use purchased clothing/accessories from Inventory, or drag owned decorations in a room.
- Presets: 100 procedural guided looks, with locked-tool beginner alternatives. Match tools, colors and targets in three real application steps. Scores 55/80/95 earn 150/350/400 Coins, once per preset.
- Tutorials: replay the introduction.
- Profile: save, restore and sign out. Watch the cloud status before closing. Concurrent edits are rejected with a conflict message; loading the newer cloud version discards unsaved edits after your explicit choice.

Guest practice is available when authentication is unavailable in a local preview. Guest practice pays no Coins and has no cloud persistence.

## Administrator

Open Admin and enter 911. This only opens the access interface. The server requires both a stored admin role and a verified ChatGPT email matching the secret ADMIN_EMAILS allowlist. The private Site owner is configured through the Sites runtime secret. No administrator passwords exist in source.

The control room includes overview, players, Coin management/reset, grant/revoke inventory, suspend/restore accounts, game enable/disable and difficulty, preset integration status, system settings and audit logs. Destructive account/item/balance operations require a confirmation dialog and server confirmation flag. The Basic Brush cannot be revoked.

## Data and security

D1 tables: users, wallets, player_inventory, coin_transactions, game_sessions, audit_logs, admin_settings, rate_limits, preset_cache. JSON fields hold character and room state. Unique claims make rewards idempotent. SQLite triggers apply balance, inventory and audit changes atomically. Purchase triggers reject insufficient funds and duplicate ownership. Server routes derive the player ID from Sites identity, never a client-supplied ID. Game outcomes are recomputed from replays or puzzle moves; a client win flag is ignored. Preset strokes are validated against owned tools and scored on the server. Save revisions prevent an older device overwriting a newer save. Suspended accounts are rejected.

Platform identity headers must only be injected by trusted Sites dispatch. Do not expose the Worker origin directly outside that trusted proxy. The code does not use external auth passwords or PINs.

## Development and deployment

The canonical source is the Site's Git repository and this checkout. Source files live in app/, components/, lib/, db/, drizzle/, tests/, docs/.

1. Use Node 24+ and the retained lockfile. Install with the Sites install-dependencies helper.
2. Keep .openai/hosting.json project_id unchanged and d1 set to DB.
3. Configure ADMIN_EMAILS as a secret through Sites. Never commit values or .dev.vars.
4. Build with the Sites build-site.mjs helper. Apply the initial SQL migration to local D1 once, using the starter's documented local migration command.
5. Run TypeScript and the tests below. Use sites-preview for browser QA in managed environments.
6. Use Sites site-workflow.mjs to commit, push, build and package the exact source. Save and deploy with save_version_and_deploy_private. Production migrations are applied by Sites.
7. Keep owner-only access. Public release requires separate user permission and a trademark/name review. An original alternative is "Little Bloom World".

## Tests

```
npx tsc --noEmit
node --experimental-strip-types tests/engine.test.ts
python tests/economy.test.py
node --experimental-strip-types tests/api.test.mjs
```

The API suite runs the actual route handler with an in-memory SQLite-backed D1 adapter. It validates authentication boundaries, initial inventory, server validation, wallet transactions, account state, second-client reads, version conflicts, admin actions and audit logging. It does not represent a physical second-device or hosted OAuth login test.

The engine suite proves 1,000 distinct Jump layouts, 4,000 completed Jump simulations across difficulties 1/2/30/100, 1,000 solved sliding puzzles, 4,000 board-game winning proofs and 90 representative flying/runner/catcher wins. Generated Jump gaps are bounded by the jump envelope. One-input jump semantics are tested in the physics engine and wired with edge detection in the UI.

## AI status

GPT-5.6 is **not active**. No API credential was provided. 100 procedural presets work without paid requests. The server integration accepts OPENAI_API_KEY and OPENAI_MODEL (default gpt-5.6), checks /v1/models before using /v1/responses, validates returned JSON and caches ideas. It never falls back to another model silently. Provision an OpenAI key through the approved OpenAI Developers workflow. AI-produced ideas require editorial review and are not automatically installed as playable tutorials.

## Known limits

- This is a playable first release, not every detail of the full production brief.
- Rooms share a reusable scene system and simplified activities. There is no pathfinding, inventory of picked-up loose objects, object-to-character attachment, or deep location-specific simulations.
- Drawing uses region-clipped circles and simple blends, not a professional raster brush engine. Some related tools share rendering mechanics. No screenshot/AI similarity evaluation is active.
- Accounts use ChatGPT sign-in; separate password/PIN registration is not implemented.
- Admin individual-level disabling, impossible experimental test levels and editable reward amounts are not implemented. Fixed economy amounts are enforced.
- Full device testing on Android/iOS hardware and real multi-device OAuth synchronization has not been performed. Layout uses responsive CSS; touch controls are implemented.
- Server replay validation prevents duplicate claims and forged win flags, but it is not a full anti-bot/anti-automation system. Timing/board solutions can be derived by a determined client. The private game has no competitive or real-money stakes.
- Live AI generation, long-term background jobs, public release and trademark clearance are not complete.
- Network failures keep edits in the open page and visibly warn. Closing before a successful save can lose those edits; no offline write queue is claimed.
