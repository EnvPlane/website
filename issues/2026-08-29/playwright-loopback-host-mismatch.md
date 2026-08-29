# Playwright web server uses an unreachable loopback address

## Summary

The vinext development server binds to `localhost`, while Playwright waits for
and navigates to `127.0.0.1`. On hosts where `localhost` resolves only to the
IPv6 loopback, the release gate times out after 120 seconds.

## Impact

Mobile, accessibility, analytics, and privacy browser checks cannot run
locally and may be host-dependent in CI.

## Expected fix

Use `localhost` consistently for Playwright's `baseURL` and web-server
readiness URL.
