# Contributor instructions

dsh-chat-tidy is a standalone, browser-first DeepSeek Harness plugin.

- Preserve the no-op host entry and the browser bundle id `dsh-chat-tidy`.
- The plugin is a stylesheet and nothing else: no preferences, no Settings row, no DOM observation. Disabling the plugin is the off switch.
- Target stable semantic DSH anchors only; never generated CSS module class names.
- Prefix every conversation selector with `body ` so it outranks the equal-specificity CSS-module default regardless of stylesheet order.
- Justify each metric against a Codex measurement recorded in DESIGN.md; do not invent values.
- Continue using DSH color tokens; this plugin owns typography and geometry, not palettes.
- Every style element must dispose with the plugin fiber.
- Commit the generated `lib/` directory so GitHub installs do not require a blocked dependency build; `pnpm run verify:build` checks that it matches source.
- Update README.md, README.zh.md, DESIGN.md, CHANGELOG.md, and tests with visible behavior changes.
- Run `pnpm run check` and inspect `pnpm run pack:check` before release.
