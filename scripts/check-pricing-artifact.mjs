import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const modulePath = 'github.com/envplane/contracts';
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');

// Verify the independently downloaded module, rather than treating a sibling
// source override or a version string alone as published provenance.
export function verifyPublishedContracts(release, downloaded, openapi) {
  if (release?.formatVersion !== 1 || !/^v0\.1\.[0-9]+$/.test(release.version)
      || !/^[0-9a-f]{40}$/.test(release.sourceCommit)
      || !/^h1:[A-Za-z0-9+/]+=$/.test(release.moduleSum)
      || !/^h1:[A-Za-z0-9+/]+=$/.test(release.goModSum)
      || !/^[0-9a-f]{64}$/.test(release.openapiSha256)
      || downloaded?.Path !== modulePath || downloaded.Version !== release.version
      || downloaded.Sum !== release.moduleSum || downloaded.GoModSum !== release.goModSum
      || downloaded.Origin?.Hash !== release.sourceCommit
      || digest(openapi) !== release.openapiSha256) {
    throw new Error('Published contracts provenance mismatch.');
  }
}

export function checkPricingArtifact() {
  const artifact = join(root, 'app/subscription-offers.json');
  const source = process.env.ENVPLANE_CONTRACTS_DIR;
  const env = { ...process.env, GOWORK: 'off' };
  let args;
  let version;
  if (source) {
    args = ['run', './cmd/plancatalog'];
  } else {
    const release = JSON.parse(readFileSync(join(root, 'contracts-release.json'), 'utf8'));
    // Validate the version before passing it to the fixed module command.
    if (!/^v0\.1\.[0-9]+$/.test(release.version)) throw new Error('Invalid contracts version.');
    const result = spawnSync('go', ['mod', 'download', '-json', `${modulePath}@${release.version}`],
      { env, encoding: 'utf8', timeout: 120_000, maxBuffer: 1024 * 1024 });
    if (result.status !== 0 || result.error) throw new Error('Published contracts download failed.');
    const downloaded = JSON.parse(result.stdout);
    if (typeof downloaded.Dir !== 'string' || !downloaded.Dir) throw new Error('Published module directory missing.');
    verifyPublishedContracts(release, downloaded, readFileSync(join(downloaded.Dir, 'openapi/openapi.json')));
    version = release.version;
    args = ['run', `${modulePath}/cmd/plancatalog@${version}`];
  }
  const result = spawnSync('go', args, { cwd: source, env, encoding: 'utf8', timeout: 120_000, maxBuffer: 1024 * 1024 });
  if (result.status !== 0 || result.error) throw new Error('Canonical catalog generation failed.');
  if (readFileSync(artifact, 'utf8') !== result.stdout) throw new Error('Pricing artifact drift: regenerate from the reviewed canonical catalog.');
  console.log(source
    ? 'Pricing artifact matches local contracts source; published acceptance not established.'
    : `Pricing artifact matches published contracts ${version} with verified provenance.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { checkPricingArtifact(); }
  catch { console.error('Pricing artifact/provenance check failed; review the published contracts pin and generated catalog.'); process.exitCode = 1; }
}
