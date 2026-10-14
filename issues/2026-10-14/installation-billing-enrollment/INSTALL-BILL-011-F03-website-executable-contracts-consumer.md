# INSTALL-BILL-011-F03: Include website executable catalog in consumer publication gates

Date:2026-10-14. Priority:P1. Status: fixed locally during coordinated009/010/011.
Components:website,contracts.

The website has no go.mod but scripts/check-pricing-artifact.mjs executes
`go run github.com/envplane/contracts/cmd/plancatalog@v0.1.111`. A Go-module-only
consumer inventory omitted this real dependency, leaving its publication/provenance
outside coordinated contracts pin updates. No billing/provider incident is claimed.

The executable dependency now comes from contracts-release.json for published
v0.1.119/source1964cf717a622c7f138279d0e5286eebc243f42d. Pricing verification runs
GOWORK=off, checks actual downloaded module/version/source/sums/OpenAPI digest,
then compares the real published CLI output with the committed catalog. The local
source override remains explicitly labelled non-published development evidence.
No commercial artifact bytes or advertised prices changed.

Synthetic provenance regressions reject wrong version, source, checksums, module,
OpenAPI and malformed release. The hosted gate runs them before pricing checking.
Record independent pricing/type/lint/build checks and exact commit/head gates in
docs/verification/install-bill-011-website.md. Keep original working tree intact;
use the isolated worktree. No AWS/provider/secrets/deployment action. Commit in
English after verification; push/merge only with the parent's coordinated command.
