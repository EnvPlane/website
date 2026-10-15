# Public route provenance and acceptance

Read-only review: 2026-10-15. The repository's `.openai/hosting.json` binds
Sites project `appgprj_6a92b02befa88191b3a66d401d2b7230`. The Sites API
reported its current live origin as
`https://envplane-install.alexandr928857.chatgpt.site`, with version 3 from
source commit `c76deeb9d8870bdd3f6be636808b83586849c2a8`. Deployment
`appgdep_6ace521d095c8191966dfa325fe17cb1` succeeded on
2026-10-13T15:46:35Z. The project has no attached custom domains. This is an
older published source than current GitHub `website` main; a later local commit
or release-gate run is not a new deployment.

Public read-only GET on 2026-10-15 returned 200 for this Sites origin's `/`,
`/pricing` and `/install`. The root linked to `/pricing`; pricing showed the
VAT-inclusive Team/Business offer text and linked to `/install`. In contrast,
`https://envplane.dev/` returned 200 with the separate EnvPlane enterprise
information page, while `https://envplane.dev/pricing` returned 404. The
`envplane.dev` deployment revision/provider binding was not exposed by this
repository's Sites project. No route from this repository should be described
as already deployed under that custom domain.

The existing `envplane.dev` root remains an informational destination selected
for future reviewed billing return admission. The published Sites `/pricing`
route is an informational offer page, not a Checkout callback or paid proof.
Browser navigation neither issues nor activates a license. Current return
allowlists remain empty until separately reviewed runtime admission.

Local acceptance: `npm run build` and
`npm run test:e2e -- tests/informational-routes.spec.ts` prove that this source
builds the root, pricing and install route/link chain, retains current offer
copy, and makes no browser mutation request during navigation. Actual
`envplane.dev/pricing` publication would require an explicit hosting/domain
decision and separate deployment authorization. After any such publication,
record the exact version/deployment and repeat public GET plus browser routing
checks; a source commit or CI build alone is insufficient.
