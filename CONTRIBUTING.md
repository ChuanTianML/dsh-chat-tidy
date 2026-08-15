# Contributing

1. Open an issue for behavior changes that expand beyond scoped presentation.
2. Keep selectors on DSH semantic data attributes; do not depend on CSS module hashes.
3. Preserve the Original mode as a complete visual rollback.
4. Add tests for lifecycle, preference, accessibility, or selector changes as applicable.
5. Run `pnpm run check` and `pnpm run pack:check` before opening a pull request.

Changes that replace renderers, hide logged information, or modify model/session data belong in a separate proposal rather than this plugin.
