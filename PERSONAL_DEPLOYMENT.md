# Personal KanaDojo deployment

This public AGPL-3.0 fork preserves KanaDojo attribution and license. It uses a Next.js application on Vercel Hobby, linked to `rpinedo1/kana-dojo`. No database, paid integrations, or custom domain are required for core exercises.

## Branches and deployment

- `main`: upstream mirror; do not add personal changes here.
- `deploy`: production branch, with automatic Vercel Git deployments.
- Project: `kana-dojo`; repository root; Next.js preset; Node.js 24.x; npm lockfile.
- Preserve `vercel.json` settings except the removed frequent Cron array. Build: `npm run clean:all && npm run build`. Ignore step: `bash scripts/vercel-ignore.sh`.
- Production URL: https://kana-dojo-orpin.vercel.app. Deployment is not complete until its Ready status and functional checks are verified.

## Environment

Set `ANALYTICS_DISABLED=true` in Production, Preview, and Development. Set `SITE_URL` to the production origin once assigned for sitemap generation. Do not configure upstream analytics keys. This setting also disables upstream AdSense scripts in this fork.

Sentry is disabled unless `NEXT_PUBLIC_SENTRY_DSN` is explicitly supplied for your own project. Default PII collection and Sentry build telemetry are off. The footer source link points to this fork; upstream credits remain intact. No Sentry auth token is needed for this deployment. Never commit credentials.

Core kana, kanji, vocabulary, training, and browser-local progress do not need service credentials. Cloud translation requires a configured translation provider (Google/Azure/AWS); automated bug reports require Supabase/Tally/DeepSeek/GitHub configuration. Leave those services unconfigured for this version. Wallpapers may use upstream public assets.

Progress is stored in the browser (localStorage/IndexedDB as used by upstream); it is not automatically synchronized between devices. Clearing browser data can remove progress.

## Update from upstream

Commit local work first. Add upstream once:

```sh
git remote add upstream https://github.com/lingdojo/kana-dojo.git
```

Then:

```sh
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
git switch deploy
git merge main
npm ci
npm run check
npm run build
git push origin deploy
```

Resolve conflicts by retaining the Cron removal and opt-in Sentry configuration. Preserve upstream changes elsewhere. Use normal merges; do not force-push. Review upstream configuration and optional services after each update.

## Modify and redeploy

Make focused changes on `deploy`, run checks, commit, and push. Vercel builds production changes automatically. Other branches produce previews. Docs-only changes can be skipped by the upstream ignore script; use a manual redeploy if one is necessary. Environment changes require redeployment.

## Troubleshoot

Inspect Vercel build/runtime logs. Confirm production branch `deploy`, correct Git repository, and Vercel GitHub App access to this fork. Hobby commits must be authored by the connected owner. Use Node 24 and `npm ci`. A Cron plan error means the upstream Cron was reintroduced. Local Google font download failures may reflect the build environment network; verify the actual Vercel build before modifying font behavior. Missing optional-service credentials do not imply core training is broken.

## Rollback

In Vercel Deployments, select a verified working production deployment and use rollback. Test the production alias afterward. Rollback does not revert environment variables or Git. Correct environment values separately, and revert the bad commit on `deploy` before the next push. Vercel rollback can pause automatic production assignment; promote the next verified deployment to restore normal releases.

## Verification (2026-10-08)

- `npm ci` completed with Node 24.19 and npm 11.9.
- `npm run check`: passed, zero errors; 482 existing warnings.
- Scroll-restoration regression tests: 6 passed. Build-ignore regression tests passed.
- Local production build attempted but failed downloading Google font assets. Actual Vercel production builds succeeded with those fonts.
- Git push automatically created a Ready production deployment.
- Live homepage, dojo navigation, Hiragana Pick, Katakana Type, Kanji Pick, Vocabulary Pick, answer feedback, scoring, and completed-session summary tested.
- Completed-session statistics, character progress, and achievements remained after reload.
- Public `/api/healthcheck`: HTTP 200, status ok. Vercel runtime logs during testing showed zero Error/Fatal entries; optional PostHog configuration warnings remain.
- Desktop tested. iPhone-size emulation could not run because the testing browser download returned an invalid archive; physical iPhone/Safari remains unverified.
- Blitz, Gauntlet, reverse variants, every JLPT level, audio output, and optional external-service features were not exhaustively tested.
- Existing achievement criteria can award N5 Graduate after a single Level 1 answer; this upstream behavior was observed and left unchanged.
