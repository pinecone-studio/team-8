# Cloudflare Deploy

This repo is designed to deploy as three Cloudflare surfaces:

1. `api.<domain>` or a Worker route for `backend/api-worker`
2. `app.<domain>` for `frontend/employee-web`
3. `admin.<domain>` for `frontend/hr-admin`

## Single-login architecture

Single-login plus automatic role routing works when both frontend apps share:

- the same `NEXTAUTH_SECRET`
- the same `NEXTAUTH_COOKIE_PREFIX`
- the same cookie domain via `NEXTAUTH_COOKIE_DOMAIN`

Recommended production values:

```text
NEXTAUTH_COOKIE_PREFIX=ebms
NEXTAUTH_COOKIE_DOMAIN=.your-domain.example
```

With that setup:

- a user signs in once from `app.<domain>`
- the session cookie is readable on both `app.<domain>` and `admin.<domain>`
- employee users are routed to the employee portal
- `hr_admin` and `finance_manager` users are routed to the HR console

## Frontend env mapping

Employee app:

```text
NEXTAUTH_URL=https://app.your-domain.example
NEXTAUTH_SECRET=...
NEXTAUTH_COOKIE_PREFIX=ebms
NEXTAUTH_COOKIE_DOMAIN=.your-domain.example
WORKER_GRAPHQL_URL=https://api.your-domain.example/graphql
# WORKER_AUTH_URL=https://api.your-domain.example/auth/login
# WORKER_PREVIEW_URL=https://api.your-domain.example/auth/preview
NEXT_PUBLIC_ADMIN_APP_URL=https://admin.your-domain.example
NEXT_PUBLIC_EMPLOYEE_APP_URL=https://app.your-domain.example
```

HR app:

```text
NEXTAUTH_URL=https://admin.your-domain.example
NEXTAUTH_SECRET=...
NEXTAUTH_COOKIE_PREFIX=ebms
NEXTAUTH_COOKIE_DOMAIN=.your-domain.example
WORKER_GRAPHQL_URL=https://api.your-domain.example/graphql
# WORKER_AUTH_URL=https://api.your-domain.example/auth/login
NEXT_PUBLIC_EMPLOYEE_APP_URL=https://app.your-domain.example
```

## Backend env mapping

Worker secrets:

```text
AUTH_JWT_SECRET=...
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=ebms-migration-source
NOTIFICATION_WEBHOOK_URL=optional
NOTIFICATION_WEBHOOK_SECRET=optional
```

## Deploy order

1. Deploy the Worker
2. Point both frontend apps to the Worker GraphQL URL and Worker auth endpoint
3. Configure shared auth cookie domain and shared secrets
4. Deploy employee app
5. Deploy HR app
6. Verify:
   - employee login lands on employee portal
   - HR login lands on admin console
   - opening the other app with the same browser reuses the session

## Current limitation

The current codebase supports shared session cookies and role-based redirects.
The remaining deployment work is CI/build pipeline wiring for the two Next.js apps on Cloudflare.
