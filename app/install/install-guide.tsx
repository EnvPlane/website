'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { ClusterTarget, HostingMode, ReleaseIndex } from './release-types';

const prerequisiteCopy: Record<string, { title: string; detail: string }> = {
  kubernetes: { title: 'Kubernetes', detail: 'A provisioned, reachable cluster' },
  helm: { title: 'Helm', detail: 'Installed on your workstation' },
  'default-storage-class': { title: 'Storage', detail: 'A default StorageClass' },
  'namespace-rbac': { title: 'Access', detail: 'Permission to create one namespace' },
  'public-oci-egress': { title: 'Network', detail: 'Anonymous pull access to GHCR' },
};

function trackSelection(event: 'cluster_target_selected' | 'hosting_mode_selected' | 'install_command_copied', value: string) {
  window.dispatchEvent(new CustomEvent('envplane:analytics', { detail: { event, value } }));
}

export function InstallGuide({ release, bundleSha256 }: { release: ReleaseIndex | null; bundleSha256: string }) {
  const [clusterTarget, setClusterTarget] = useState<ClusterTarget>('current');
  const [hostingMode, setHostingMode] = useState<HostingMode>('cloud');
  const [copied, setCopied] = useState(false);

  const selectClusterTarget = (value: ClusterTarget) => {
    setClusterTarget(value);
    trackSelection('cluster_target_selected', value);
  };
  const selectHostingMode = (value: HostingMode) => {
    setHostingMode(value);
    trackSelection('hosting_mode_selected', value);
  };
  const copyCommand = async () => {
    if (!release) return;
    await navigator.clipboard.writeText(release.install.command);
    setCopied(true);
    trackSelection('install_command_copied', release.version);
    window.setTimeout(() => setCopied(false), 1800);
  };

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
            {release && <code className="digest">{release.chart.digest.slice(0, 22)}…</code>}
          </div>
        </aside>
      </section>

      <section className="guide-grid" aria-label="Installation path">
        <div className="path-panel">
          <p className="step-label">01 · Choose your path</p>
          <fieldset>
            <legend>Where will workloads run?</legend>
            <div className="segment" aria-label="Cluster target">
              {(['current', 'remote'] as const).map((value) => (
                <button key={value} type="button" className={clusterTarget === value ? 'selected' : ''} aria-pressed={clusterTarget === value} onClick={() => selectClusterTarget(value)}>
                  {value === 'current' ? 'Current cluster' : 'Remote cluster'}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>How is the cluster hosted?</legend>
            <div className="segment" aria-label="Hosting model">
              {(['cloud', 'on-prem'] as const).map((value) => (
                <button key={value} type="button" className={hostingMode === value ? 'selected' : ''} aria-pressed={hostingMode === value} onClick={() => selectHostingMode(value)}>
                  {value === 'cloud' ? 'Cloud' : 'On-prem'}
                </button>
              ))}
            </div>
          </fieldset>
          <div className="path-summary" aria-live="polite">
            <strong>{clusterTarget === 'current' ? 'Install management + workloads together' : 'Install management first, connect the target next'}</strong>
            <p>{clusterTarget === 'remote' ? 'The first-run screen will guide a least-privilege Agent install on the remote cluster.' : 'The same-cluster Agent and Runner are included in the stable umbrella.'} {hostingMode === 'on-prem' ? 'No cloud account or provider credentials are required.' : 'Cloud IAM, DNS and load balancers remain under your control.'}</p>
          </div>
          <p className="privacy-note">These choices stay in this browser. We never request cluster credentials, SCM tokens, kubeconfig files, or Secret values here.</p>
        </div>

        <div className="command-panel">
          <p className="step-label">02 · Install stable</p>
          <div className="command-heading">
            <h2>{release ? `Release ${release.version}` : 'Release verification pending'}</h2>
            <span className="verified-badge">signed index</span>
          </div>
          <pre aria-label="Helm install command"><code>{release?.install.command ?? 'Command unavailable until the release index is verified.'}</code></pre>
          <button className="copy-button" type="button" disabled={!release} onClick={copyCommand} aria-live="polite">{copied ? 'Copied' : 'Copy Helm command'}</button>
          <p className="command-help">The command is identical for every selection. Remote targets and provider integrations are configured after first run, where credentials remain write-only.</p>
        </div>
      </section>

      <section className="details-grid" aria-label="Install requirements and verification">
        <article>
          <p className="step-label">Before you run it</p>
          <h2>Five quick prerequisites</h2>
          <ul className="prerequisite-list">
            {(release?.install.prerequisites ?? Object.keys(prerequisiteCopy)).map((key) => {
              const item = prerequisiteCopy[key];
              return item ? <li key={key}><span aria-hidden="true">✓</span><div><strong>{item.title}</strong><p>{item.detail}{key === 'kubernetes' && release ? ` ${release.support.kubernetes.minimum}+` : ''}{key === 'helm' && release ? ` ${release.support.helm.minimum}+` : ''}</p></div></li> : null;
            })}
          </ul>
        </article>
        <article>
          <p className="step-label">03 · Check status</p>
          <h2>Watch it become ready</h2>
          <div className="status-stack">
            {(release?.status.commands ?? ['Status commands unlock with the verified release index.']).map((command, index) => <code key={command}><span>{index + 1}</span>{command}</code>)}
          </div>
        </article>
        <article className="first-run-card">
          <p className="step-label">04 · First run</p>
          <h2>Meet your setup guide</h2>
          <div className="screen-preview" aria-label="Expected first-run screen preview">
            <span className="preview-wordmark">envplane</span>
            <div><small>Initial setup</small><strong>Create the first operator</strong><p>Authentication starts inside your installation.</p></div>
          </div>
          <p>After the rollout, port-forward the frontend and open <strong>{release?.firstRun.url ?? 'the signed first-run URL'}</strong>. The expected screen is initial authentication—not a login form on this landing page.</p>
        </article>
      </section>

      <footer>
        <p>No cookies. No third-party analytics. No credential collection.</p>
        <p>{release ? `Verified bundle ${bundleSha256.slice(0, 12)}…` : 'Release verification required'}</p>
      </footer>
    </main>
  );
}
