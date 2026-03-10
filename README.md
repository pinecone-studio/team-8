# EBMS

Backend and frontend foundation for the Employee Benefits Management System (EBMS), aligned to the hackathon TDD and reorganized into teacher-style `frontend/` and `backend/` roots.

## What is already scaffolded

- Separated `frontend/` and `backend/` roots for clearer ownership
- D1-compatible SQL schema and Drizzle table definitions
- Baseline benefit catalog and eligibility rule seed config from the TDD
- Eligibility engine core for deterministic rule evaluation
- Audit log and persistence bundle helpers for eligibility recomputation
- Auth.js-compatible JWT guard for Worker routes
- Hono + GraphQL Yoga endpoint with protected employee and HR resolvers
- Contract upload/versioning and R2 signed download flow
- Notification event outbox plus protected dispatch route
- OKR and attendance sync ingestion routes with recompute wiring
- Employee web app with Auth.js session bridge and live GraphQL dashboard
- HR admin app with Auth.js session bridge and live GraphQL dashboard
- Wrangler bindings template for D1, KV, and R2
- Remote D1 demo dataset with employees, eligibility, contracts, requests, notifications, and sync history

## Workspace layout

- `backend/api-worker`: Cloudflare Worker API scaffold
- `backend/packages/config`: benefit catalog and rule seed data
- `backend/packages/db`: D1 schema, Drizzle config, SQL migration
- `backend/packages/eligibility`: pure TypeScript rule evaluator
- `frontend/employee-web`: Next.js/Auth.js employee portal scaffold
- `frontend/hr-admin`: Next.js/Auth.js admin portal scaffold

## Immediate next steps

1. Install dependencies with `npm install`.
2. Create the local D1 database and apply the D1 migrations.
3. Bootstrap the local or remote D1 database and seed catalog plus demo operational data.
4. Copy `frontend/employee-web/.env.local.example` and `frontend/hr-admin/.env.local.example` when setting up fresh local envs.
5. Start the Worker and frontend apps locally.
6. Configure an optional notification webhook destination.
7. Move from local-only verification to staging Cloudflare envs when ready.

## Deploy notes

- Cloudflare deployment and shared-session single-login notes live in [CLOUDFLARE_DEPLOY.md](/Users/bumbayarariunbat/Desktop/EBMS/team-8/docs/CLOUDFLARE_DEPLOY.md)

## Security model

- `employees` table нь profile, department, role, eligibility-related data хадгална. Password энд хадгалахгүй.
- Login credential нь тусдаа `access_credentials` table дээр хадгалагдана.
- Password нь `password_hash`, `password_salt`, `password_iterations`, `password_algorithm` хэлбэрээр PBKDF2-SHA256 hash-аар хадгалагдана.
- Frontend password эсвэл hash-ийг preview байдлаар авахгүй. Login зөвхөн Worker-ийн `/auth/login` endpoint-оор дамжина.

## Suggested execution order while design is in progress

1. Keep backend core logic under `backend/`.
2. Keep employee and admin UIs under `frontend/`.
3. Extend GraphQL queries and mutations from the existing Worker API.
4. Let designers shape the final UI on top of the current authenticated shells.
