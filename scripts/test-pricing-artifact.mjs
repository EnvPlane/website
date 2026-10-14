import { createHash } from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';
import { verifyPublishedContracts } from './check-pricing-artifact.mjs';

const openapi = Buffer.from('{"synthetic":"public fixture"}');
const sha = createHash('sha256').update(openapi).digest('hex');
function fixture() {
  const release = {
    formatVersion: 1, version: 'v0.1.999', sourceCommit: 'a'.repeat(40),
    moduleSum: `h1:${'A'.repeat(43)}=`, goModSum: `h1:${'B'.repeat(43)}=`, openapiSha256: sha,
  };
  const downloaded = { Path: 'github.com/envplane/contracts', Version: release.version,
    Sum: release.moduleSum, GoModSum: release.goModSum, Origin: { Hash: release.sourceCommit } };
  return { release, downloaded };
}

test('published module and artifact provenance agree', () => {
  const { release, downloaded } = fixture();
  assert.doesNotThrow(() => verifyPublishedContracts(release, downloaded, openapi));
});

for (const kind of ['version', 'source', 'sum', 'go-mod-sum', 'openapi', 'module', 'missing-origin', 'malformed-release']) {
  test(`reject mismatched ${kind} before catalog acceptance`, () => {
    const { release, downloaded } = fixture();
    switch (kind) {
      case 'version': downloaded.Version = 'v0.1.998'; break;
      case 'source': downloaded.Origin.Hash = 'b'.repeat(40); break;
      case 'sum': downloaded.Sum = `h1:${'C'.repeat(43)}=`; break;
      case 'go-mod-sum': downloaded.GoModSum = `h1:${'C'.repeat(43)}=`; break;
      case 'openapi': release.openapiSha256 = '0'.repeat(64); break;
      case 'module': downloaded.Path = 'foreign/module'; break;
      case 'missing-origin': delete downloaded.Origin; break;
      case 'malformed-release': release.version = 'v0.1.999 --unexpected'; break;
    }
    assert.throws(() => verifyPublishedContracts(release, downloaded, openapi), /provenance mismatch/);
  });
}
