# Browser demonstration fixture

The release screenshots use the actual built Harness Web application, an isolated temporary profile/workspace, and synthetic session events. No API key or private conversation is required. `demo.e2e.ts` is a manual capture fixture, not an additional regression test. The separate `pnpm run test:harness` command performs the automated assembled regression.

Use a built Harness checkout compatible with this plugin. Copy `demo.e2e.ts` into its `apps/web/tests/` directory, set `TIDY_PLUGIN_ROOT` to this checkout and `TIDY_DEMO_CONTROL` to an empty temporary directory, then run from the Harness root:

```sh
pnpm exec vitest run --config vitest.web.config.ts apps/web/tests/demo.e2e.ts
```

`ready.json` in the control directory contains the loopback URL. Open it in Chrome and select the seeded release-page session for the completed/expanded captures. Start a new session with the provided model for a live timer. The adapter emits synthetic progress and harmless `printf` commands, then waits. Create `finish` in the control directory to complete the response, or use the native Stop button to test interruption. Create `refresh` after rebuilding the plugin to invalidate its browser module revision. Create `stop` to close the isolated host. Remove the copied test file afterward. The fixture stops after one hour if left unattended.

The seeded completed turn records 2m 25s; the running screenshot shows real elapsed wall time in the local adapter. Neither is a performance benchmark. Capture only page content, and inspect every image before publication. Do not open system-prompt or configuration details in promotional screenshots.
