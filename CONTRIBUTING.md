# Contributing

1. Keep presentation decisions on the public session projection and selectors on semantic data attributes.
2. Preserve native React nodes, tool interactions, final-answer visibility, and attention-required content.
3. Dispose every observer, timer, listener, control, and visibility change. Disabling the plugin must fully restore the native view.
4. Add behavior and lifecycle regressions for changes; update both READMEs, design notes, and changelog.
5. Build and stage `lib/` before `pnpm run check`, whose freshness gate compares generated files with the index. Inspect `pnpm run pack:check` before release.
6. For work disclosure changes, run `pnpm run test:harness` against a built Harness checkout and perform browser visual checks separately.

Private review materials stay outside Git and npm. Public screenshots must use synthetic sessions with no personal paths, credentials, or real conversation data.
