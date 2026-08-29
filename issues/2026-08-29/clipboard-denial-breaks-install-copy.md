# Clipboard denial breaks the install copy action

## Summary

`navigator.clipboard.writeText` can reject when browser clipboard permission
is unavailable. The rejection is unhandled and the command is not copied.

## Expected fix

Catch Clipboard API denial and use a short-lived in-document copy fallback.
Never send the command or selection data over the network.
