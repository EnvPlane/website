import { InstallGuide } from './install-guide';
import releaseData from '../generated/release.json';
import type { VerifiedRelease } from './release-types';

export default function InstallPage() {
  const verifiedRelease = releaseData as VerifiedRelease;
  const release = verifiedRelease.verified ? verifiedRelease.index : null;
  return <InstallGuide release={release} bundleSha256={verifiedRelease.bundleSha256} />;
}
