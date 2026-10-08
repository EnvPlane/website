# Review website dependency vulnerabilities reported on push

Status: open; GitHub notification recorded, individual alerts not yet triaged.

During the push to main on 2026-10-08, GitHub reported ten default-branch
dependency vulnerabilities: two critical, three high, two moderate and three low.
No CVE, affected package or exploitability details were provided in that response.
Do not infer that these alerts were introduced by the pushed pricing commit.

Source: https://github.com/EnvPlane/website/security/dependabot

## Codex implementation prompt

Inspect the current authorized Dependabot alerts and lockfile. Identify affected
direct/transitive dependencies and whether each vulnerability affects runtime or
build tooling. Prioritize verified critical/high findings, apply the smallest
compatible upgrades, run tests/typecheck/lint/build and recheck GitHub alerts after
publication. Preserve unrelated changes and do not claim resolution from a package
version change alone. No dependency fixes or release were performed in this pass.
