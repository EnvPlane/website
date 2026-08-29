import { readFileSync } from 'node:fs';

const source = readFileSync('app/install/install-guide.tsx', 'utf8');
const release = JSON.parse(readFileSync('app/generated/release.json', 'utf8'));
const forbidden = [
  /type=["'](?:password|file)["']/i,
  /<form\b/i,
  /fetch\s*\(/,
  /sendBeacon\s*\(/,
  /localStorage|sessionStorage|document\.cookie/,
  /google-analytics|segment\.com|mixpanel|amplitude/i,
];
for (const pattern of forbidden) {
  if (pattern.test(source)) throw new Error(`privacy contract violation: ${pattern}`);
}
if (!release.verified || !release.index?.install?.command) {
  throw new Error('release gate requires a verified signed release index');
}
const serialized = JSON.stringify(release.index).toLowerCase();
for (const term of ['password', 'kubeconfig', 'scm token', 'secret value']) {
  if (serialized.includes(term)) throw new Error(`signed release index contains forbidden term: ${term}`);
}
console.log('privacy and analytics contract passed');
