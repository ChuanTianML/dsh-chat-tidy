# Browser demonstration fixture

The release screenshots use the actual built Harness Web application, an isolated temporary profile/workspace, and synthetic session events. No API key or private conversation is required. `demo.e2e.ts` is a manual capture fixture, not an additional regression test. The separate `pnpm run test:harness` command performs the automated assembled regression.

Use a built Harness checkout compatible with this plugin. Copy `demo.e2e.ts` into its `apps/web/tests/` directory, set `TIDY_PLUGIN_ROOT` to this checkout and `TIDY_DEMO_CONTROL` to an empty temporary directory, then run from the Harness root:

```sh
pnpm exec vitest run --config vitest.web.config.ts apps/web/tests/demo.e2e.ts
```

`ready.json` in the control directory contains the loopback URL. Open it in Chrome and select the seeded release-page session for the completed/expanded captures. Start a new session with the provided model for a live timer. The adapter emits synthetic progress and harmless `printf` commands, then waits. Create `finish` in the control directory to complete the response, or use the native Stop button to test interruption. Create `refresh` after rebuilding the plugin to invalidate its browser module revision. Create `stop` to close the isolated host. Remove the copied test file afterward. The fixture stops after one hour if left unattended.

The seeded completed turn records 2m 25s; the running screenshot shows real elapsed wall time in the local adapter. Neither is a performance benchmark. Capture only page content, and inspect every image before publication. Do not open system-prompt or configuration details in promotional screenshots.

## Published Harness acceptance (0.4.1)

`seed-published-host.mjs` uses the published Session and persistence APIs to create two synthetic sessions: completed and user-stopped. The Markdown exercises paragraphs, lists, short/long tables, and indented four-column tables. No model call is made. Use a fresh temporary validation root; the script refuses an existing root.

```sh
npm install --prefix /tmp/tidy-host-041 --ignore-scripts --no-audit --no-fund @deepseek-ai/dsh@0.2.1-rc.2
TIDY_HOST_ROOT=/tmp/tidy-host-041 TIDY_VALIDATION_ROOT=/tmp/tidy-validation-041 node integration/seed-published-host.mjs
DSH_HOME=/tmp/tidy-validation-041/home node /tmp/tidy-host-041/node_modules/@deepseek-ai/dsh/lib/bin.js plugin --profile web add -w "$PWD"
DSH_HOME=/tmp/tidy-validation-041/home node /tmp/tidy-host-041/node_modules/@deepseek-ai/dsh/lib/bin.js web --patch /tmp/tidy-validation-041/overlay.yml --host 127.0.0.1 --port 3081
```

Open the loopback URL printed by the host and expand Ungrouped. Verify both seeded sessions, native process disclosure and keyboard controls, 11px paragraph gaps, and table frames aligned with their first cells. At wide and narrow viewport sizes, overflowing tables must scroll internally without horizontal page overflow. Check light/dark themes, switch sessions, reload, and disable/re-enable the plugin through Plugins. Restart Harness after changing activation on `0.2.1-rc.2`; in this acceptance run the switch persisted its state but did not unload the already running bundle. After restart, disabling restores native table geometry and leaves native disclosure untouched. Run the legacy `test:harness` and streaming demo separately to cover the plugin-owned controller.
