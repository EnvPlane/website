# envplane website

Public, credential-free product landing pages for envplane.

## Guided install

`/install` renders its Helm command only from the stable release index published
and keylessly signed by `EnvPlane/deploy`. The release gate verifies the
Sigstore bundle against the deploy workflow identity before building the site.

```bash
npm ci
./scripts/sync-signed-release-index.sh
npm run privacy:check
npm run build
npm run test:e2e
```

The page intentionally has no forms, cookies, third-party analytics, credential
inputs, or network-backed interaction analytics. Selection and copy events are
browser-local `CustomEvent` signals only.
