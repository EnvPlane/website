#!/usr/bin/env bash
set -euo pipefail

repo="${ENVPLANE_RELEASE_REPOSITORY:-EnvPlane/deploy}"
api="${GITHUB_API_URL:-https://api.github.com}"
output="${ENVPLANE_RELEASE_OUTPUT:-app/generated/release.json}"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

for command in curl jq cosign shasum; do
  command -v "$command" >/dev/null || { echo "$command is required" >&2; exit 2; }
done

headers=(-H 'Accept: application/vnd.github+json' -H 'X-GitHub-Api-Version: 2022-11-28')
if [[ -n "${GITHUB_TOKEN:-}" ]]; then headers+=(-H "Authorization: Bearer $GITHUB_TOKEN"); fi
curl --fail --silent --show-error "${headers[@]}" "$api/repos/$repo/releases/latest" > "$tmp/release.json"

version="$(jq -er '.tag_name | sub("^envplane-v"; "") | select(test("^[0-9]+\\.[0-9]+\\.[0-9]+$"))' "$tmp/release.json")"
index_name="envplane-$version-release-index.json"
bundle_name="envplane-$version-release-index.sigstore.json"
index_url="$(jq -er --arg name "$index_name" '.assets[] | select(.name == $name) | .browser_download_url' "$tmp/release.json")"
bundle_url="$(jq -er --arg name "$bundle_name" '.assets[] | select(.name == $name) | .browser_download_url' "$tmp/release.json")"
curl --fail --silent --show-error -L "$index_url" -o "$tmp/index.json"
curl --fail --silent --show-error -L "$bundle_url" -o "$tmp/bundle.json"

cosign verify-blob \
  --bundle "$tmp/bundle.json" \
  --certificate-identity "https://github.com/EnvPlane/deploy/.github/workflows/release-on-main.yaml@refs/heads/main" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  "$tmp/index.json" >/dev/null

jq -e --arg version "$version" '
  .schemaVersion == 1 and .channel == "stable" and .version == $version and
  (.chart.repository == "oci://ghcr.io/envplane/envplane") and
  (.chart.digest | test("^sha256:[0-9a-f]{64}$")) and
  (.install.command | contains(" --version " + $version + " ")) and
  .support.clusterTargets == ["current", "remote"] and
  .support.deploymentModes == ["cloud", "on-prem"] and
  ([paths(scalars) as $p | getpath($p) | strings] | join(" ") | test("password|kubeconfig|credential|scm.?token|secret value"; "i") | not)
' "$tmp/index.json" >/dev/null

bundle_sha="$(shasum -a 256 "$tmp/bundle.json" | awk '{print $1}')"
mkdir -p "$(dirname "$output")"
jq -n --arg bundleSha256 "$bundle_sha" --slurpfile index "$tmp/index.json" \
  '{verified:true,index:$index[0],bundleSha256:$bundleSha256}' > "$output"
echo "verified stable release index $version"
