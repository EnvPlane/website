# INSTALL-BILL-011 website direct-consumer handoff

Date:2026-10-14. Scope: compatible published contracts consumer pin/provenance only.
Worktree:/private/tmp/website-next-iteration-20261014.
Branch:codex/ticket-batch-20261014. Base:website main c76deeb.

Published contracts:v0.1.119.
Source:1964cf717a622c7f138279d0e5286eebc243f42d.
Publication run38610568116 and source Go CI38610568453 completed successfully.
Exact public module/OpenAPI sums are in contracts-release.json.

The executable catalog dependency was omitted by Go-module-only inventory because
website has no go.mod. Its oldv0.1.111 pin is replaced by the coordinated provenance
file. The checker resolves the published module with GOWORK=off and verifies the
actual module path/version/source commit/module sums/OpenAPI digest before running
the published catalog CLI. Development ENVPLANE_CONTRACTS_DIR remains explicit
source integration, never published evidence. Every subprocess is fixed-argv,
time-bounded and output-bounded; raw subprocess diagnostics are not printed.

## Local verification

- `GOCACHE=/private/tmp/install-bill-002-gocache npm run pricing:check`:PASS,
  actual publishedv0.1.119, no source override. Initial sandbox DNS denial was
  superseded by the authorized read-only module lookup. Log:
  /private/tmp/install009011-website-pricing.log.
- `npm run pricing:test`:PASS9,0fail,0skip. Synthetic positive provenance plus
  wrong version/source/module/module sums/OpenAPI/malformed-release negatives.
  Log:/private/tmp/install009011-website-unit.log.
- `npm run typecheck`, `npm run lint`, `npm run privacy:check`:PASS.
- `npm run build`:PASS all five vinext build phases. Initial sandbox dependency
  cache write denial was superseded by the authorized build. Existing vinext
  static-analysis route-classification notice does not establish hosted behavior.
- `git diff --check`:PASS.
- `cmp app/subscription-offers.json /Users/alex/PROJECTS/EnvPlane/website/app/subscription-offers.json`:
  identical. No generated catalog, advertised price or commercial feature changes.

Dependency package-lock matches the original clean repository. Local checking
reuses its installed node_modules via an untracked symlink; this dependency cache
is not a source change. Original website working tree stays untouched. Browser
E2E is unchanged and remains a hosted exact-head release-gate requirement; local
build/unit checks are not browser or deployed evidence.

## Evidence boundaries and remaining gates

Actual AWS/provider/secret/deployment operations:NONE. Go-module registry/GitHub
publication readback is dependency evidence, not payment-provider evidence. No
billing route, customer, enrollment, identity, grant or backend writer was enabled.

Parent coordinates push/PR/merge only after all source checks. Hosted website
release gate must run exact new head, including pricing:test/pricing:check, signed
stable-index validation and existing browser privacy/accessibility/E2E checks.
No website release/deployment is implied by a local commit or main merge.

Discovery/repair ticket:
issues/2026-10-14/installation-billing-enrollment/INSTALL-BILL-011-F03-website-executable-contracts-consumer.md.
Parent mirrors it and this handoff to Downloads with the coordinated evidence.
