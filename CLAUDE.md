# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A minimal practice project demonstrating an OpenID Connect provider using the `oidc-provider` npm package, mounted as middleware in an Express app. The entire implementation lives in `src/index.ts`.

## Commands

Use Node v18.16.0 (see `.nvmrc`; run `nvm use` if using nvm).

- `npm run dev` — run the server directly from TypeScript source via `ts-node-esm` (no build step needed)
- `npm run build` — type-check and compile `src/` to `dist/` via `tsc`
- `npm start` — builds (via `prestart`) then runs the compiled output from `dist/` with plain `node`

There is no test suite, linter, or lint script configured in this repo.

## Configuration

- Copy `.env.sample` to `.env` and adjust `PORT` (defaults to `3000` if unset, but `.env.sample` sets `3001`). Loaded via `dotenv` in `src/index.ts`.
- Module system: this project uses native ESM (`"type": "module"` in `package.json`, `"module": "NodeNext"` in `tsconfig.json`), which is why `dev` requires `ts-node-esm` rather than plain `ts-node`.
- Formatting: Prettier is configured with `"semi": false` (`.prettierrc`) — no semicolons.

## Architecture

Everything is currently in one file, `src/index.ts`:

- An `oidc-provider` `Provider` instance is constructed with the issuer identity `http://localhost:3000` (this is the OIDC issuer URL baked into discovery metadata/tokens — it does not need to match the actual listen port).
- `findAccount` is stubbed to accept any account id and return only a `sub` claim — there is no real user store or authentication backend.
- A single statically-configured client (`client_id: "app"`) is registered in-process with the `authorization_code` grant type and PKCE explicitly set to not-required (`pkce.required: () => false`), which is non-default and intentionally relaxed for local testing — do not carry this pattern into anything resembling production.
- The provider's `.callback()` is mounted directly as Express middleware (`app.use(oidc.callback())`), so all OIDC endpoints (`/.well-known/openid-configuration`, `/auth`, `/token`, etc.) are handled by `oidc-provider` itself, not by custom Express routes.

When extending this project (e.g., adding real account lookup, persistent client storage, or additional routes), keep in mind there is no separation yet between the OIDC provider setup and the Express app — introduce that structure only as needed.
