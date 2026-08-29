# Playwright result artifacts are not ignored

## Summary

Running the local browser release gate creates `test-results/` in the website
working tree. The directory is not ignored and can be committed accidentally.

## Impact

Generated test metadata can pollute source commits and create unnecessary
review noise.

## Expected fix

Ignore `/test-results/` alongside the existing coverage and build artifacts.
