import Link from 'next/link';
import catalog from '../subscription-offers.json';

export default function Pricing() {
  return <main className="home-shell">
    <h1>Subscription plans</h1>
    <p>Software subscription prices in EUR per month. Infrastructure and AI provider usage are paid separately.</p>
    {catalog.plans.filter(plan=>plan.id!== 'free').map(plan=><section key={plan.id} aria-label={plan.offer.name}>
      <h2>{plan.offer.name} — {plan.offer.contactSales ? 'from ' : ''}€{plan.offer.monthlyMinorUnits/100}/month</h2>
      {plan.offer.contactSales ? <p>Custom limits, isolated installation and support by agreement. No SLA is automatically included.</p> : <p>{plan.limits['projects.max']} projects · {plan.limits['environments.active.max']} active feature environments · {plan.limits['clusters.managed.max']} connected clusters</p>}
      <p>{plan.offer.customerAIKey ? 'AI assistants with your own provider key.' : 'Deterministic read-only assistants; no external AI included.'}</p>
    </section>)}
    <p>Base applications and Terminated records do not consume active feature-environment slots. Deterministic read-only fallback remains available when AI is unavailable. License expiry never automatically deletes workloads or blocks authorized cleanup, deletion and export.</p>
    <Link className="primary-link" href="/install">Install and configure</Link>
  </main>;
}
