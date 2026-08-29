# Activation checkout and redemption handoff is not implemented

EP-SSO-013 requires the hosted landing path from checkout/request to an
activation code. The private `activation-issuer` API exists, but website has
no client or route that calls its checkout endpoint, collects the safe
installation/tenant binding, or guides an operator to the write-only
control-plane activation endpoint.

## Required fix

- Add a privacy-reviewed hosted checkout/request flow that uses only public
  product selection and a short-lived issuer session.
- Consume the authenticated control-plane activation identity read model once
  it is implemented; do not collect cluster credentials.
- Provide online redemption and offline copy/paste guidance without rendering
  activation code values after installation.
- Add browser and privacy tests covering the flow.
