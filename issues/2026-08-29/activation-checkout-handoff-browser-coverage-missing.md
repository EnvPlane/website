# Activation checkout handoff has no browser coverage

The hosted activation guide implements checkout-session creation and online
redemption, but the website contains no activation, checkout, or redemption
browser test. Running the advertised Playwright filter returns `No tests
found`.

This leaves the privacy-sensitive handoff unproven: the browser must submit
only SKU and safe installation/tenant binding, clear the activation code after
use, and avoid persisting it in DOM, storage, logs, or telemetry.

## Required remediation

- Add a browser test with an issuer mock for checkout and redemption.
- Assert request bodies exclude cluster credentials and tokens.
- Assert the activation code field is cleared after a successful handoff and
  no code appears in rendered DOM or browser storage.
- Run this test in the website release gate.
