# Vite config uses a legacy JSON import

The generated Vite configuration imports hosting JSON without an import
attribute. Vite warns that this will be unsupported when its native config
loader becomes the default.

Declare the JSON import type explicitly and keep the build warning-free for
future Vite upgrades.
