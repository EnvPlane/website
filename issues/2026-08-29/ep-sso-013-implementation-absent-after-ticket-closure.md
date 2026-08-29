# EP-SSO-013 implementation is absent after ticket closure

The activation issuer tracking ticket was closed, but repository review found
no implementation of the EP-SSO-013 lifecycle.

## Evidence

- `website` contains no hosted checkout/request-to-activation issuer endpoint
  or redemption lifecycle implementation.
- `control-plane` contains no `ActivationGrant` verification, redemption,
  revocation, replacement, or issuer key-set integration.
- The control-plane module is still pinned to contracts `v0.1.65`; the signed
  activation-code contract was added later in contracts commit `eb066a7`.
- No open-source runtime must receive an issuer private signing key; a private
  issuer service and its deployment/operational ownership are still required.

## Required acceptance evidence before closure

- Hosted issuer integration tests prove repeated purchase idempotency,
  replacement revision, revocation, and key rotation.
- Control-plane tests prove online redemption binding, cross-installation or
  cross-tenant replay rejection, and valid offline license continuity during
  issuer outage.
- Public key-set publication and offline verification use only the published
  contracts test vectors; private keys stay outside public repositories.
