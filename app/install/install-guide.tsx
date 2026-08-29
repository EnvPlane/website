'use client';

import Link from 'next/link';

type ReleaseIndex = {
  version: string;
  install: { command: string };
};

export function InstallGuide({ release }: { release: ReleaseIndex | null }) {
  return (
    <main className="install-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <Link className="wordmark" href="/">envplane</Link>
        <a className="quiet-link" href="https://github.com/EnvPlane/deploy/tree/main/docs">Documentation</a>
      </nav>

      <section className="install-hero" aria-labelledby="install-title">
        <div>
          <p className="eyebrow">Guided install · about 5 minutes</p>
          <h1 id="install-title">Your cluster.<br />One verified release.</h1>
          <p className="hero-copy">No account first. No kubeconfig upload. Choose your path and run one command from the signed stable release.</p>
        </div>
        <aside className="trust-card" aria-label="Release verification">
          <span className="pulse-dot" aria-hidden="true" />
          <div>
            <strong>{release ? `Stable ${release.version}` : 'Verifying stable release'}</strong>
            <p>{release ? 'Release index signature verified at build time.' : 'Install commands stay locked until signature verification completes.'}</p>
          </div>
        </aside>
      </section>

      <section className="guide-grid" aria-label="Installation path">
        <div className="path-panel">
          <p className="step-label">01 · Choose your path</p>
          <fieldset>
            <legend>Where will workloads run?</legend>
            <div className="segment" aria-label="Cluster target">
              <button type="button" className="selected" aria-pressed="true">Current cluster</button>
              <button type="button" aria-pressed="false">Remote cluster</button>
            </div>
          </fieldset>
          <fieldset>
            <legend>How is the cluster hosted?</legend>
            <div className="segment" aria-label="Hosting model">
              <button type="button" className="selected" aria-pressed="true">Cloud</button>
              <button type="button" aria-pressed="false">On-prem</button>
            </div>
          </fieldset>
          <p className="privacy-note">These choices stay in this browser. We never request cluster credentials, SCM tokens, or Secret values here.</p>
        </div>

        <div className="command-panel">
          <p className="step-label">02 · Install stable</p>
          <div className="command-heading">
            <h2>{release ? `Release ${release.version}` : 'Release verification pending'}</h2>
            <span className="verified-badge">signed index</span>
          </div>
          <pre aria-label="Helm install command"><code>{release?.install.command ?? 'Command unavailable until the release index is verified.'}</code></pre>
          <button className="copy-button" type="button" disabled={!release}>Copy Helm command</button>
          <p className="command-help">Requires Kubernetes 1.26+, Helm 3.14+, a default StorageClass, namespace RBAC, and public OCI egress.</p>
        </div>
      </section>
    </main>
  );
}
