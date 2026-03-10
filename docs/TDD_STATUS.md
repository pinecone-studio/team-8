# EBMS TDD Status

This file tracks the implementation order against the hackathon TDD. Do not skip ahead.

## Current status

### Phase 0 - Setup

- Done: monorepo/backend workspace scaffold
- Done: Cloudflare Worker scaffold
- Done: D1 schema and SQL migrations
- Done: baseline benefit catalog and rule config
- Done: local package/tooling install
- Done: real Cloudflare resource IDs in Wrangler config
- Done: auth provider wiring choice (Auth.js)
- Done: Worker JWT secret setup

### Phase 1 - Core Engine

- Done: eligibility engine core
- Done: eligibility engine unit tests
- Done: D1 seed generation for benefits and rules
- Done: audit-log/persistence bundle helpers
- Done: KV cache invalidation key helpers
- Done: connect bundle to Worker D1 writes
- Done: trigger orchestration route for recomputation

### Phase 2 - GraphQL API

- Done: Hono + GraphQL Yoga Worker integration
- Done: protected queries for `me`, `benefits`, `myBenefits`
- Done: protected HR queries for `employee(id)`, `employees`, `auditLog`
- Done: protected mutation for `recomputeEligibility`
- Done: contract metadata query
- Done: benefit request mutation with contract acceptance logging
- Done: HR override mutation with immutable audit logging
- Done: finance/admin request review query and mutation
- Done: signed contract download URL backend path
- Done: contract upload/versioning mutation and admin queries
- Done: notification event outbox and inspection query
- Done: internal notification dispatch route
- Done: OKR sync ingestion route and audit trail
- Done: attendance import ingestion route and audit trail
- Done: automatic eligibility recompute on sync triggers
- Done: admin visibility for latest sync runs
- Done: remote Cloudflare D1 demo dataset for employees, eligibility, contracts, requests, notifications, and sync history
- Done: sync run schema fix so service/system actors are not blocked by employee foreign keys
- Pending: frontend Auth.js token issuance contract
- Pending: real R2 signing credentials in Worker env
- Pending: live notification webhook destination

### Phase 3 - Frontend Integration

- Done: `frontend/employee-web` Next.js scaffold
- Done: `frontend/hr-admin` Next.js scaffold
- Done: Auth.js local credentials bridge
- Done: Worker JWT minting on Auth.js session creation
- Done: protected employee dashboard wired to live GraphQL
- Done: protected HR admin dashboard wired to live GraphQL
- Done: local env example and local dev env wiring
- Pending: real identity provider wiring instead of local credentials
- Pending: final designer-approved employee UI
- Pending: final designer-approved HR admin UI

## What Codex has done

1. Created DB schema, migrations, and Drizzle setup.
2. Added the full TDD benefit catalog and rule baseline.
3. Added deterministic eligibility evaluation logic.
4. Added unit tests for critical rule paths.
5. Added seed SQL generation for D1.
6. Added audit-log and persistence write models plus cache invalidation helpers.
7. Added Worker JWT validation for Auth.js-compatible API protection.
8. Added the first GraphQL schema and protected resolvers on the Worker.
9. Added contract metadata, benefit request, and HR override GraphQL operations.
10. Added finance review and signed contract URL operations.
11. Added contract upload/versioning, contract admin visibility, and expiring-contract queries.
12. Added notification event queueing for request/review/upload flows and a protected dispatch route.
13. Added OKR and attendance sync ingestion routes, sync run persistence, and admin sync visibility.
14. Added frontend employee and HR admin apps with Auth.js, Worker JWT bridging, and live GraphQL dashboards.
15. Reorganized the repo into top-level `frontend/` and `backend/` folders to align with the teacher branch structure.

## What the user needs to provide

1. Notification webhook URL/secret if the team wants live delivery beyond the outbox
2. Staging/production Cloudflare env wiring when the team is ready to leave local-only mode
3. Final identity-provider choice when the team is ready to leave local demo credentials

## Next implementation step

The backend/database foundation is now demo-complete. The remaining next steps are:

1. Final frontend UX polish with designer review
2. Optional live notification webhook wiring
3. Real identity provider wiring instead of local credentials
4. Staging/production Cloudflare deployment wiring
