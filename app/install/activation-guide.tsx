'use client';

import { useState } from 'react';
import catalog from '../subscription-offers.json';

type Props = { issuerURL: string };

export function ActivationGuide({ issuerURL }: Props) {
  const [sku, setSKU] = useState('team');
  const [session, setSession] = useState('');
	const [checkoutURL, setCheckoutURL] = useState('');
  const [licenseID, setLicenseID] = useState('');
  const [installationID, setInstallationID] = useState('');
  const [tenantID, setTenantID] = useState('');
  const [nonce, setNonce] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  if (!issuerURL) return null;
  const requestCheckout = async () => {
    setMessage('');
    const response = await fetch(`${issuerURL}/v1/checkout-sessions`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sku }) });
    if (!response.ok) { setMessage('Checkout request could not be created. Try again later.'); return; }
    const value = await response.json() as { sessionId: string; checkoutUrl?: string };
    setSession(value.sessionId);
    setCheckoutURL(value.checkoutUrl ?? '');
    setMessage(value.checkoutUrl ? 'Checkout request created. Continue with the provider, then redeem the issued license below.' : 'Checkout request created. Complete payment with the provider, then redeem the issued license below.');
  };
  const redeem = async () => {
    setMessage(''); setCode('');
    const response = await fetch(`${issuerURL}/v1/licenses/${encodeURIComponent(licenseID)}/redeem`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ nonce, installationId: installationID, tenantId: tenantID }) });
    if (!response.ok) { setMessage('Redemption was rejected. Confirm the installation ID, tenant ID, and issued license ID.'); return; }
    const value = await response.json() as { activationCode: string };
    setCode(value.activationCode);
    setMessage('Copy the one-time activation code into your signed-in installation. It is never stored by this page.');
  };
  const clearCode = () => { setCode(''); setMessage('Activation code cleared from this browser.'); };

  return <section className="activation-card" aria-labelledby="activation-title">
    <p className="step-label">Optional · Activation</p><h2 id="activation-title">Activate without cluster credentials</h2>
    <p>Request checkout here. After purchase, copy the installation ID and tenant ID from your signed-in control-plane activation page; neither is a credential.</p>
    <label>SKU<select value={sku} onChange={(event) => setSKU(event.target.value)}>{catalog.plans.filter(plan => plan.offer.monthlyMinorUnits > 0 && !plan.offer.contactSales).map(plan => <option key={plan.id} value={plan.id}>{plan.offer.name} — €{plan.offer.monthlyMinorUnits / 100}/month</option>)}</select></label>
    <p>Infrastructure and AI provider charges are separate. Enterprise starts at €900/month by negotiated quote; SLA requires a separate agreement.</p>
    <button className="copy-button" type="button" onClick={requestCheckout}>Request checkout</button>{session && <p className="activation-status">Request {session}</p>}{checkoutURL && <p><a className="primary-link" href={checkoutURL}>Continue to secure checkout</a></p>}
    <div className="activation-fields">
      <label>Issued license ID<input value={licenseID} onChange={(event) => setLicenseID(event.target.value)} autoComplete="off" /></label>
      <label>Installation ID<input value={installationID} onChange={(event) => setInstallationID(event.target.value)} autoComplete="off" /></label>
      <label>Tenant ID<input value={tenantID} onChange={(event) => setTenantID(event.target.value)} autoComplete="off" /></label>
      <label>One-time nonce<input value={nonce} onChange={(event) => setNonce(event.target.value)} autoComplete="off" /></label>
    </div>
    <button className="copy-button" type="button" disabled={!licenseID || !installationID || !tenantID || !nonce} onClick={redeem}>Create activation code</button>
    {code && <><pre aria-label="Activation code"><code>{code}</code></pre><button className="copy-button" type="button" onClick={clearCode}>I installed it — clear code</button></>}
    {message && <p className="activation-status" aria-live="polite">{message}</p>}
  </section>;
}
