# Production dependency audit is not part of the release gate

## Summary

The current production dependency set passes `npm audit --omit=dev --audit-level=high`,
but no package script or documented release command runs that check. A future
dependency update could therefore ship without the audit required by
`scaffold-runtime-dependencies-vulnerable.md`.

## Expected fix

Add a reproducible production dependency audit script and include it in the
documented and CI release gate. It must fail the release on high-severity
production dependency advisories while leaving development-only dependencies
out of scope.
