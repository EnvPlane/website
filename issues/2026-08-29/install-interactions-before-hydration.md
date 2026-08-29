# Install interactions can run before hydration completes

## Summary

The guided install buttons are visible in server-rendered HTML before their
client handlers are attached. Fast browser automation can click a selector
without changing its state.

## Expected fix

Expose a non-sensitive hydration readiness marker and make interaction tests
wait for it before exercising path controls.
