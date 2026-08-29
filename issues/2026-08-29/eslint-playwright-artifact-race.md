# ESLint races with Playwright artifact cleanup

## Summary

When lint and browser tests run together, ESLint traverses `test-results/`
while Playwright replaces that directory. The disappearing path causes an
`ENOENT` failure before linting source files.

## Expected fix

Exclude Playwright result and report directories in the flat ESLint config.
