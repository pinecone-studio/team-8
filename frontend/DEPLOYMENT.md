# Frontend deployment (Cloudflare)

## Fixing "Internal Server Error" on deploy

The app needs **runtime environment variables** on Cloudflare. If they are missing, you’ll see a 500 Internal Server Error.

### 1. Set variables in the Cloudflare dashboard

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → your frontend worker (`team-8-frontend`).
2. Go to **Settings** → **Variables and Secrets**.
3. Add these **Environment Variables** (and/or **Secrets** for sensitive values):

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | **Yes** | Clerk publishable key (e.g. `pk_test_...` or `pk_live_...`) |
| `CLERK_SECRET_KEY` | **Yes** | Clerk secret key (e.g. `sk_test_...` or `sk_live_...`) – add as **Secret** |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | No | Default: `/sign-in` |
| `NEXT_PUBLIC_GRAPHQL_URL` | No | Default in code: `https://team8-api.team8pinequest.workers.dev/` |

Without `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`, Clerk (auth and proxy) will fail and the app can return 500.

### 2. Keep variables when deploying with Wrangler

If you deploy via CLI, keep the variables you set in the dashboard:

```bash
npm run deploy -- --keep-vars
```

Or with `opennextjs-cloudflare`:

```bash
opennextjs-cloudflare deploy -- --keep-vars
```

### 3. Workers Builds (CI/CD)

If you use [Workers Builds](https://developers.cloudflare.com/workers/builds/), set the same variables in **Build variables and secrets** so the Next.js build and runtime both have access (e.g. for `NEXT_PUBLIC_*` and SSG).

---

**Local development:** Use Next.js `.env.local` (see `.env.local.example`). For local Worker preview, copy `.dev.vars.example` to `.dev.vars` and set `NEXTJS_ENV=development` if needed.
