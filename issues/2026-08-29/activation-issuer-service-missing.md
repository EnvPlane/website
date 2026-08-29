# Hosted activation issuer service is missing

Status: superseded on 2026-08-29. The private `activation-issuer` repository
now owns this service. Its implementation keeps signing keys in a KMS-facing
adapter and provides purchase idempotency, bound redemption, replacement,
revocation, audit state, and signed verification metadata. Public website
code remains intentionally free of issuer credentials and state.

EP-SSO-013 requires issuer-owned private signing keys, purchase idempotency,
replacement revisions, revocation distribution, and redemption audit state.
The open-source website, control-plane runtime, and Helm charts must not hold
these keys or issuer state.

## Required private-service contract

- Hosted checkout/request endpoint returns only a short-lived customer session.
- Issuer stores purchase-to-license idempotency and emits the same grant for a
  repeated purchase request unless an explicit replacement revision is issued.
- Issuer signs `contracts/domain.ActivationGrant` using issuer-managed Ed25519
  or ECDSA keys and publishes only key IDs/public keys for offline verification.
- Online redemption binds license ID and nonce to one installation/tenant;
  cross-binding replay is rejected and audited.
- Revocation and key rotation are published as signed metadata. Installed valid
  grants continue offline during issuer outage.

## Security boundary

No cluster credential, kubeconfig, SCM token, issuer private key, or billing
provider secret may enter website browser state, public repositories, chart
values, or control-plane runtime configuration.
