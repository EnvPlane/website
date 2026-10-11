'use client';

import { useState } from 'react';
import catalog from '../subscription-offers.json';

type Props = { issuerURL: string };

export function ActivationGuide({ issuerURL }: Props) {
  const [licenseID, setLicenseID] = useState('');
  const [installationID, setInstallationID] = useState('');
  const [tenantID, setTenantID] = useState('');
  const [nonce, setNonce] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  if (!issuerURL) return null;
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
    <p>Create checkout through Billing in your signed-in installation connected to the seller service. This public page does not authorize purchases. After verified purchase, copy the installation ID and tenant ID from your activation page; neither is a credential.</p>
    <p>{catalog.plans.filter(plan => plan.offer.monthlyMinorUnits > 0 && !plan.offer.contactSales).map(plan => `${plan.offer.name} €${plan.offer.monthlyMinorUnits/100}/month (VAT included)`).join(' · ')}. Card details are entered only on the hosted provider page.</p>
    <p>Returning to a success URL does not issue a license. Enterprise requires a negotiated quote; no automatic checkout is offered.</p>
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
