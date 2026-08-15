# Validation record

This record captures the release checks performed for `dsh-chat-tidy` 0.1.0 on 2026-08-15 against a source checkout of DeepSeek Harness `>=0.1.0-rc.6`.

## Automated checks

```sh
pnpm run check
pnpm run pack:check
```

`pnpm run check` passed strict TypeScript checks, ESLint, 9 Vitest tests across 5 files, both the host and Web-client builds, and the generated-bundle freshness check. The package dry run contained only the declared release files.

## Installed Web smoke test

The plugin was linked into the real DSH Web profile and loaded through the normal plugin path:

```sh
pnpm dsh plugin --profile web add -w /absolute/path/to/dsh-chat-tidy
pnpm dsh web
```

The browser smoke test confirmed one plugin-owned stylesheet, one Settings contribution, complete mode switching, cross-reload persistence, and one-click rollback to DSH defaults.

| Check | Balanced | Compact | Original |
| --- | --- | --- | --- |
| Body | 15 px / 25 px | 14 px / 23 px | 16 px / 28 px DSH default |
| H2 | 18 px / 26 px | 17 px / 24 px | 22 px / 32 px DSH default |
| Chat-flow gap | 14 px | 10 px | 16 px DSH default |
| Content width | 760 px | 820 px | 748 px DSH default |
| Composer radius | 18 px | 16 px | 22 px DSH default |

Visual checks covered:

- desktop at 1440 × 900 in the built-in Light and Dark themes;
- Settings layout at desktop width;
- the conversation at 700 × 900 with no horizontal overflow;
- Settings and the plugin mode selector at 480 × 800 with no horizontal overflow;
- System theme and Balanced mode restored after validation.

No plugin error or warning appeared in the browser console. Connection-retry warnings observed during the run coincided with intentional local server restarts.

## Clean-clone distribution check

A committed release candidate was cloned with no hard links into a temporary directory. The clone had no `node_modules`, retained the committed `lib/client.js`, and was installed into a new isolated `DSH_HOME` Web profile without running a plugin build or changing `allowBuilds`:

```sh
DSH_HOME=/temporary/dsh-home pnpm dsh plugin --profile web add -w /temporary/clean-clone
DSH_HOME=/temporary/dsh-home pnpm dsh web
```

The clean-clone browser session reported Balanced mode, exactly one plugin-owned stylesheet, and exactly one accessible `Chat typography mode` Settings contribution. This check closes the gap between an in-place development link and the files a GitHub install receives.
