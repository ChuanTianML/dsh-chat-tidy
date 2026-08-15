# Contributor instructions

dsh-chat-tidy is a standalone, browser-first DeepSeek Harness plugin.

- Preserve the no-op host entry and the browser bundle id `dsh-chat-tidy`.
- Keep all conversation CSS scoped by `data-dsh-chat-tidy` and stable semantic DSH anchors.
- Never target generated CSS module class names.
- Do not replace chat renderers, hide activity, or observe/rewrite React DOM nodes.
- Continue using DSH color tokens; this plugin owns typography and geometry, not palettes.
- Persist only the validated presentation mode and tolerate unavailable localStorage.
- Every listener, style element, locale registration, and slot entry must dispose with the plugin fiber.
- Commit the generated `lib/` directory so GitHub installs do not require a blocked dependency build; `pnpm run verify:build` checks that it matches source.
- Update README.md, README.zh.md, DESIGN.md, CHANGELOG.md, and tests with visible behavior changes.
- Run `pnpm run check` and inspect `pnpm run pack:check` before release.
