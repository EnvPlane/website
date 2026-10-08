# Public pricing must match issuer offers

Status: implemented locally; website not published.

The activation guide previously requested legacy Pro or quote-only Enterprise.
It now offers canonical Team/Business SKUs. /pricing displays the generated public
catalog from contracts/cmd/plancatalog, including separate infrastructure/provider
charges, deterministic fallback and cleanup safety. Enterprise is quote-only.

## Codex implementation prompt

Regenerate app/subscription-offers.json from the same released contracts catalog
when prices change, verify activation-handoff SKU tests, run typecheck/lint/privacy
checks, then validate the production gateway's real price mapping before publishing
a live purchase path. Never promise an SLA or included provider credits from the
Enterprise floor price. Keep credentials and activation codes out of analytics.
