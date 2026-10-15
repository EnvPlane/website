# envplane website

Public, credential-free product landing pages for envplane.
See [route provenance](docs/route-provenance.md) for the current Sites origin,
the separate `envplane.dev` information page, and the deployment acceptance gate.

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

## Published catalog dependency

The pricing/install pages consume the canonical contracts catalog through an
executable Go module dependency. `contracts-release.json` pins its compatible
published version, source commit, module sums and OpenAPI digest. `npm run
pricing:check` resolves that exact published module with `GOWORK=off`, verifies
its provenance and compares the generated catalog byte-for-byte. `npm run
pricing:test` checks wrong version/source/checksum/digest/module rejection.

`ENVPLANE_CONTRACTS_DIR` is an explicit local source-development override only;
its result is labelled source integration and does not establish published
acceptance. Hosted release checks use the published mode. Updating this pin does
not authorize changing commercial values, billing settings or provider resources.
