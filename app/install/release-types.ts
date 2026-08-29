export type ClusterTarget = 'current' | 'remote';
export type HostingMode = 'cloud' | 'on-prem';

export type ReleaseIndex = {
  schemaVersion: 1;
  channel: 'stable';
  version: string;
  sourceRevision: string;
  chart: { repository: string; digest: string };
  support: {
    kubernetes: { minimum: string };
    helm: { minimum: string };
    deploymentModes: HostingMode[];
    clusterTargets: ClusterTarget[];
  };
  install: {
    release: string;
    namespace: string;
    command: string;
    prerequisites: string[];
  };
  status: { commands: string[] };
  firstRun: { url: string; screen: string };
};

export type VerifiedRelease = {
  verified: boolean;
  index: ReleaseIndex | null;
  bundleSha256: string;
};
