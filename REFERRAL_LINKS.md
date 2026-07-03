# Referral universal links (`/r/{code}`)

Powers the single PawPeer invite link — **`https://pawpeer.io/r/{CODE}`**. One
link, no fallback:

- **App installed** → iOS Universal Link / Android App Link opens the app and
  applies the referral (handled in the mobile app's `DeepLinkService`).
- **App not installed** → `r/index.html` copies `pawpeer-ref:{CODE}` to the
  clipboard and redirects to the right store. On first launch the app reads that
  value (deferred deep link) and pre-fills the referral code at sign-up.

## Files here

| Path | Purpose |
|------|---------|
| `.well-known/apple-app-site-association` | iOS Universal Link association (served as JSON via `_headers`) |
| `.well-known/assetlinks.json` | Android App Link verification |
| `r/index.html` | Landing / redirect + clipboard deferred deep link |
| `_redirects` | `/r/*  ->  /r/index.html  200` (any code renders the page) |
| `_headers` | forces `application/json` on the two `.well-known` files |

## ⚠️ Values to fill before this is fully live

1. **Android SHA-256** — replace `REPLACE_WITH_PLAY_APP_SIGNING_SHA256_FINGERPRINT`
   in `.well-known/assetlinks.json`. Get it from **Play Console → Setup → App
   integrity → App signing key certificate** (SHA-256). Add the upload-key
   fingerprint too if you sideload test builds.
2. **iOS App Store id** — set the real numeric id in `r/index.html`
   (`IOS_STORE_URL`) once the iOS app is published.

iOS `appID` is `SQB7S4HF9H.com.pawpeer.app` (Team id + bundle id).

## Verify after deploy

- `https://pawpeer.io/.well-known/apple-app-site-association` → JSON, 200, no redirect.
- `https://pawpeer.io/.well-known/assetlinks.json` → JSON, 200.
- `https://pawpeer.io/r/TEST123` → landing page.
