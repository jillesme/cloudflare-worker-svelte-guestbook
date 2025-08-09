# SvelteKit Guestbook on Cloudflare Workers & D1

This project is a simple guestbook application built following the steps outlined in [Cloudflare Workers, SvelteKit, Drizzle, and D1: Up and Running](https://jilles.me/cloudflare-workers-sveltekit-drizzle-and-d1-up-and-running)

It demonstrates how to build and deploy a full-stack SvelteKit application leveraging Cloudflare's serverless ecosystem, including:

- **Cloudflare Workers:** For running the SvelteKit backend logic on Cloudflare's edge network.
- **Cloudflare D1:** A serverless SQLite-compatible database.
- **SvelteKit:** A full-stack Svelte framework for building the frontend and backend.
- **Drizzle ORM:** A TypeScript ORM used to interact with the D1 database.

The result is a fast, globally distributed application with potentially zero infrastructure costs thanks to Cloudflare's generous free tiers.

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.io/) (but `npm` or `yarn` can also be used)

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (Free tier is sufficient).
- [Node.js](https://nodejs.org/) (LTS version recommended) installed locally.
- [pnpm](https://pnpm.io/installation) installed globally (or use `npm`/`yarn` and adjust commands accordingly).
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) installed and logged into your Cloudflare account (`wrangler login`).

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/jillesme/cloudflare-worker-svelte-guestbook.git
    cd cloudflare-worker-svelte-guestbook
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up local database environment:**
    Create a `.env` file in the root of the project and add the following line. This tells Drizzle where to find the local SQLite database file for `pnpm dev`.

    ```dotenv
    # .env
    DATABASE_URL=file:local.db
    ```

4.  **Apply initial local database migrations:**
    This will create the `local.db` file (if it doesn't exist) and apply the schema defined in `src/lib/server/db/schema.ts`.
    ```bash
    pnpm run db:migrate
    ```

## Development

To run the application locally using the Vite development server (hot-reloading, uses `local.db` SQLite file):

```bash
pnpm dev
```

Navigate to `http://localhost:5173` (or the port specified in the output). Changes made to your Svelte components or server routes will reload automatically. Note that Cloudflare bindings (like D1) are _not_ available in this mode.

## Local Preview (Miniflare)

To run the application locally using Miniflare, which simulates the Cloudflare Workers environment (including D1 bindings stored locally):

1.  **Ensure D1 is configured locally:** You might need to run the D1 migrations locally first if you haven't configured your remote D1 DB yet (see Cloudflare Setup section). Wrangler often prompts or handles this. If you encounter D1 errors, try:

    ```bash
    # Replace 'guestbook-db' if you used a different name in wrangler.jsonc
    wrangler d1 migrations apply guestbook-db --local
    ```

2.  **Run the preview script:**
    This script first builds the SvelteKit app (`vite build`) and then starts the Wrangler development server (`wrangler dev`).
    ```bash
    pnpm preview
    ```

Navigate to `http://localhost:8787` (or the port specified in the output). This mode uses a local simulation of your D1 database defined in `wrangler.jsonc`. Hot-reloading is not available; you need to stop and restart `pnpm preview` to see changes.

## Database Migrations (Drizzle Kit)

Migrations allow you to evolve your database schema over time.

1.  **Modify the schema:** Edit the table definitions in `src/lib/server/db/schema.ts`.
2.  **Generate migration files:** Create SQL migration files based on schema changes. These files are stored in `src/lib/server/db/migrations`.

    ```bash
    pnpm run db:make-migrations
    ```

    _(Note: This uses `drizzle-kit generate`. The blog post initially mentioned `db:push`, but recommends `generate` for better tracking.)_

3.  **Apply migrations:**
    - **To local SQLite DB (`local.db` used by `pnpm dev`):**
        ```bash
        pnpm run db:migrate
        ```
    - **To local D1 Preview DB (used by `pnpm preview`):** Replace `guestbook-db` with your D1 database name from `wrangler.jsonc`.
        ```bash
        wrangler d1 migrations apply guestbook-db
        ```
    - **To remote D1 Production DB (before deploying):** Replace `guestbook-db` with your D1 database name.
        ```bash
        wrangler d1 migrations apply guestbook-db --remote
        ```

## Cloudflare Setup (D1 Database)

Before deploying, you need to create a D1 database on Cloudflare and configure Wrangler.

1.  **Create the D1 Database:**
    Choose a unique name for your database (e.g., `guestbook-db`).

    ```bash
    wrangler d1 create guestbook-db
    ```

    Wrangler will output configuration details, including the `database_id`.

2.  **Configure `wrangler.jsonc`:**
    Add the `d1_databases` binding information provided by the previous command to your `wrangler.jsonc` file. Ensure the `binding` name matches what's used in the code (`DB` in this case) and add the `migrations_dir`.

    ```jsonc
    // wrangler.jsonc
    {
        // ... other config
        "compatibility_flags": ["nodejs_compat"], // Ensure this is present
        "d1_databases": [
            {
                "binding": "DB", // Important: Must match usage in hooks.server.ts (event.platform.env.DB)
                "database_name": "guestbook-db", // Use the name you chose
                "database_id": "YOUR_DATABASE_ID_HERE", // Paste the ID from 'wrangler d1 create' output
                "migrations_dir": "./src/lib/server/db/migrations", // Points to your migration files
            },
        ],
        // ... other config (like assets)
    }
    ```

3.  **Generate Cloudflare Types:**
    If you change bindings in `wrangler.jsonc`, regenerate types for better TypeScript support:
    ```bash
    pnpm run cf-typegen
    ```
    This updates `worker-configuration.d.ts` and ensures `event.platform.env.DB` is correctly typed. Follow any instructions regarding `@types/node` or `tsconfig.json` cleanup if prompted.

## Deployment

1.  **Apply Migrations to Remote D1:**
    Ensure your remote D1 database schema is up-to-date.

    ```bash
    # Replace 'guestbook-db' with your D1 database name
    wrangler d1 migrations apply guestbook-db --remote
    ```

2.  **Deploy the Worker:**
    This script builds the application and deploys it to Cloudflare Workers using Wrangler.
    ```bash
    pnpm run deploy
    ```

Wrangler will output the URL where your application is deployed (e.g., `https://svelte-guestbook.<your-subdomain>.workers.dev`).

## Important Scripts

- `pnpm dev`: Run local dev server (Vite) with HMR. Uses local SQLite file (`.env`).
- `pnpm build`: Build the application for production.
- `pnpm preview`: Build and run locally using Miniflare (simulates CF Workers). Uses local D1 preview.
- `pnpm deploy`: Build and deploy to Cloudflare Workers. Uses remote D1.
- `pnpm run db:make-migrations`: Generate SQL migration files from schema changes.
- `pnpm run db:migrate`: Apply migrations to the local SQLite database (`local.db`).
- `pnpm run cf-typegen`: Generate TypeScript types based on `wrangler.jsonc`.

## Key Configuration Files

- `svelte.config.js`: SvelteKit configuration (uses `@sveltejs/adapter-cloudflare`).
- `vite.config.ts`: Vite configuration.
- `wrangler.jsonc`: Cloudflare Wrangler configuration (Worker name, bindings, compatibility flags).
- `drizzle.config.ts`: Drizzle Kit configuration (schema path, migrations output).
- `tsconfig.json`: TypeScript configuration.
- `.env`: Environment variables for local development (e.g., `DATABASE_URL`).
- `src/app.d.ts`: App-level TypeScript declarations (including `Locals` and `Platform`).
- `src/hooks.server.ts`: SvelteKit server hooks (used here for DB client initialization).
- `src/lib/server/db/index.ts`: Database client initialization logic (handles D1 vs LibSQL).
- `src/lib/server/db/schema.ts`: Drizzle schema definition.
- `src/lib/server/db/migrations/`: Directory containing SQL migration files.

```

```
