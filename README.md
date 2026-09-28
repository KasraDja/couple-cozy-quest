# Fig Collecting

A shared app for couples to keep lists of things to do together and track the dates they've been on.

- **Shared lists**: recipes, restaurants, shows and films, music, places to visit, things to do at home, trips, events and gigs, and videos.
- **Avatars**: two customisable characters shown together, styled in a forest-green theme.
- **XP and levels**: each completed date earns XP; levelling up unlocks accessories for the avatars.

**Live app**: https://kasradja.github.io/couple-cozy-quest/

The frontend is a static single-page app deployed to GitHub Pages. Data and sign-in use [Supabase](https://supabase.com).

## Development

You need [Bun](https://bun.sh). Create a `.env` file with your Supabase project's values (Supabase dashboard → Project Settings → API):

```sh
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable key>
```

Then:

```sh
bun install
bun run dev
```

The app runs at http://localhost:8080.

## Supabase setup

1. Create a project at https://supabase.com.
2. Create the tables: run the files in `supabase/migrations/` in order in the SQL editor, or run `supabase link --project-ref <project-ref>` and `supabase db push` with the [Supabase CLI](https://supabase.com/docs/guides/cli).
3. Google sign-in:
   - In Google Cloud Console, create an OAuth client (type "Web application") with the authorized redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`.
   - In Supabase → Authentication → Sign In / Providers → Google, enable it and enter the client ID and secret.
   - In Supabase → Authentication → URL Configuration, set the Site URL to `https://kasradja.github.io/couple-cozy-quest/` and add `http://localhost:8080/` to the redirect URLs.

## Deployment

Every push to `main` builds and deploys the site with `.github/workflows/deploy.yml`. One-time setup in the GitHub repository settings:

1. Settings → Pages → Source: **GitHub Actions**.
2. Settings → Secrets and variables → Actions: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
