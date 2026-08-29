# Generated website runtime dependencies are vulnerable

The pinned site scaffold installed versions of Next, Vinext, Vite, Wrangler and
the Cloudflare Vite plugin with published high-severity advisories. Its blocked
install scripts also left the Wrangler dependency tree incomplete, so the local
preview could not start.

Upgrade to the registry-recommended compatible patch/minor releases, explicitly
approve only the required native build scripts, and gate releases on a clean
production dependency audit.
