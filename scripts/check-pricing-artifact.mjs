import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const artifact = fileURLToPath(new URL('../app/subscription-offers.json', import.meta.url));
const source = process.env.ENVPLANE_CONTRACTS_DIR;
const args = source ? ['run', './cmd/plancatalog'] : ['run', 'github.com/envplane/contracts/cmd/plancatalog@v0.1.111'];
const result = spawnSync('go', args, { cwd: source, env: { ...process.env, GOWORK: 'off' }, encoding: 'utf8' });
if (result.status !== 0) {
  console.error('Canonical catalog generation failed; verify contracts access and Go toolchain.');
  process.exit(1);
}
if (readFileSync(artifact, 'utf8') !== result.stdout) {
  console.error('Pricing artifact drift: regenerate app/subscription-offers.json from contracts cmd/plancatalog.');
  process.exit(1);
}
console.log('Pricing artifact matches canonical CommercialPlanCatalog.');
