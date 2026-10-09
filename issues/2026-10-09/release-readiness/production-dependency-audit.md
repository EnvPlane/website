# Production dependency audit remediation

Status: implemented locally; hosted CI pending.

The release gate failed with critical Next.js and high sharp/source-map-js advisories. Updated Next.js and eslint-config-next to 16.3.8; refreshed compatible transitive dependencies to sharp 0.35.5 and source-map-js 1.2.2.

Validation: production npm audit reports zero vulnerabilities; lint, typecheck, privacy contract, build and four Playwright tests pass. Full dev dependency audit still reports high advisories in braces/Cloudflare tooling; these are not claimed fixed and no gate was disabled.

Implementation prompt: verify hosted release gate, then separately remediate the remaining development dependency advisories using compatible upstream versions and complete build/E2E checks. Never downgrade the framework or use audit --force without reviewing its dependency changes.

