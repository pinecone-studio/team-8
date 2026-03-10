# Team 8

Monorepo with a **Next.js 14** frontend and an **Apollo GraphQL** backend running on **Cloudflare Workers** with **D1** (SQLite) and **Drizzle ORM**.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, Apollo Client, TypeScript |
| API | Apollo GraphQL Server, Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| ORM | Drizzle ORM |
| Codegen | GraphQL Code Generator |
| Linting | ESLint, TypeScript strict mode |
| CI/CD | GitHub Actions |

## Prerequisites

- **Node.js** >= 20
- **npm** >= 10
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (for backend deployment)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/pinecone-studio/team-8.git
cd team-8
npm install
```

### 2. Set up the local database

```bash
# Generate migration SQL from Drizzle schema
npm run db:generate --workspace=backend

# Apply migration to the local D1 database
npm run db:migrate:local --workspace=backend
```

### 3. Start development servers

```bash
# Start both backend and frontend
npm run dev

# Or start them individually
npm run dev:backend    # GraphQL API at http://localhost:8787
npm run dev:frontend   # Next.js app at http://localhost:3000
```

## Project Structure

```
team-8/
├── backend/
│   ├── src/
│   │   ├── index.ts                          # Worker entry point
│   │   ├── db/
│   │   │   ├── schema.ts                     # Drizzle table definitions
│   │   │   └── index.ts                      # DB client factory
│   │   └── graphql/
│   │       ├── context.ts                    # GraphQLContext type
│   │       ├── index.ts                      # Re-exports
│   │       ├── generated/graphql.ts          # Auto-generated resolver types
│   │       ├── schemas/
│   │       │   ├── index.ts                  # Merges all schemas
│   │       │   └── employee.ts               # Employee types, inputs, queries, mutations
│   │       └── resolvers/
│   │           ├── queries/
│   │           │   ├── getEmployees.ts
│   │           │   └── getEmployee.ts
│   │           └── mutations/
│   │               ├── createEmployee.ts
│   │               ├── updateEmployee.ts
│   │               └── deleteEmployee.ts
│   ├── drizzle/                              # Migration SQL files (committed to git)
│   ├── wrangler.toml                         # Cloudflare Worker config
│   ├── codegen.ts                            # Backend codegen config
│   └── drizzle.config.ts                     # Drizzle config
├── frontend/
│   ├── src/
│   │   ├── app/                              # Next.js App Router pages
│   │   ├── lib/
│   │   │   ├── apollo-client.ts              # Apollo Client instance
│   │   │   └── apollo-provider.tsx           # ApolloProvider wrapper
│   │   └── graphql/
│   │       ├── queries/employee.graphql       # Query operations
│   │       ├── mutations/employee.graphql     # Mutation operations
│   │       └── generated/graphql.ts           # Auto-generated hooks & types
│   ├── codegen.ts                             # Frontend codegen config
│   └── next.config.js
├── .github/workflows/
│   ├── ci.yml                                # Lint + type check on PRs
│   └── cd.yml                                # Deploy on push to main
├── package.json                              # Root workspace config
└── tsconfig.base.json                        # Shared TypeScript config
```

## Common Tasks

### Adding a new database table

1. Add the table definition in `backend/src/db/schema.ts`
2. Generate the migration:
   ```bash
   npm run db:generate --workspace=backend
   ```
3. Apply it locally:
   ```bash
   npm run db:migrate:local --workspace=backend
   ```

### Adding a new GraphQL entity

1. **Schema** — Create `backend/src/graphql/schemas/myEntity.ts` with types, inputs, queries, and mutations using `extend type Query` / `extend type Mutation`
2. **Register schema** — Import and add it to the array in `backend/src/graphql/schemas/index.ts`
3. **Query resolvers** — Create files in `backend/src/graphql/resolvers/queries/` and register in the `queries/index.ts`
4. **Mutation resolvers** — Create files in `backend/src/graphql/resolvers/mutations/` and register in the `mutations/index.ts`
5. **Run codegen** to generate resolver types:
   ```bash
   npm run codegen --workspace=backend
   ```
6. **Frontend operations** — Add `.graphql` files in `frontend/src/graphql/queries/` and `frontend/src/graphql/mutations/`
7. **Run frontend codegen** to generate hooks:
   ```bash
   npm run codegen --workspace=frontend
   ```

### Using generated hooks in frontend

```tsx
"use client";

import { useGetEmployeesQuery, useCreateEmployeeMutation } from "@/graphql/generated/graphql";

export default function Page() {
  const { data, loading } = useGetEmployeesQuery();
  const [createEmployee] = useCreateEmployeeMutation();

  const handleCreate = () => {
    createEmployee({
      variables: {
        input: {
          email: "user@company.com",
          name: "User",
          role: "engineer",
          department: "Engineering",
          hireDate: "2024-01-15",
        },
      },
    });
  };

  // ...
}
```

### Writing a resolver

Resolvers use generated types from codegen for full type safety:

```typescript
import { MutationResolvers } from "../../generated/graphql";
import { schema } from "../../../db";

export const createSomething: MutationResolvers["createSomething"] = async (_, { input }, { db }) => {
  const results = await db.insert(schema.somethings).values(input).returning();
  return results[0];
};
```

## Available Scripts

### Root

| Command | Description |
|---|---|
| `npm run dev` | Start backend + frontend concurrently |
| `npm run dev:backend` | Start backend only |
| `npm run dev:frontend` | Start frontend only |
| `npm run lint` | Lint all workspaces |

### Backend (`--workspace=backend`)

| Command | Description |
|---|---|
| `npm run dev` | Run codegen + start wrangler dev server |
| `npm run codegen` | Generate GraphQL resolver types |
| `npm run deploy` | Deploy worker to Cloudflare |
| `npm run db:generate` | Generate Drizzle migration from schema changes |
| `npm run db:migrate:local` | Apply migrations to local D1 |
| `npm run db:migrate:remote` | Apply migrations to remote D1 |
| `npm run lint` | Run ESLint |

### Frontend (`--workspace=frontend`)

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Run codegen + build for production |
| `npm run codegen` | Generate GraphQL hooks and types |
| `npm run codegen:watch` | Watch mode — regenerate on `.graphql` file changes |
| `npm run lint` | Run ESLint |

## Environment Variables

### Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:8787
```

## Deployment

### Backend (Cloudflare Workers)

Handled automatically by CD pipeline on push to `main`. For manual deploy:

```bash
cd backend
npx wrangler login          # One-time: login with Cloudflare account
npx wrangler d1 migrations apply team8 --remote
npx wrangler deploy
```

### CI/CD Secrets

Add these in GitHub repo settings (`Settings > Secrets and variables > Actions`):

| Secret | Description |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with Workers edit permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
