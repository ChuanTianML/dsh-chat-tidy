# Validation record

## 0.4.0 — Tidy Work

Validated on 2026-09-19 against the built DeepSeek Harness source checkout `c615b196a2796fce347b2c5c21c9276da7def0ee`. This release changes only the standalone plugin; the host was not patched for the feature.

### Automated checks

- `pnpm run check` passed, including strict source/test TypeScript checking, ESLint, all unit tests, both bundle builds, and the generated-bundle freshness check.
- `pnpm run pack:check` passed; the dry run contained 35 declared release files and excluded private review material, source tests, local profiles, and credentials.
- 51 Vitest tests passed across 5 files: turn/final-answer classification, mixed reasoning and Markdown, passive-tool grouping, failed and nested calls, pending interactions, incomplete history, interruption, native DOM mounting, selection/focus protection, manual expansion, session lifecycle, timers, scrolling, disposal, styles, and localization.
- Both distributable bundles were rebuilt. The generated-bundle freshness gate is part of `pnpm run check`.
- `pnpm run test:harness` passed its assembled regression with the actual Harness ModuleLoader, Chat projection, React renderers, and built plugin bundle. This is a jsdom integration check, not a browser screenshot test.

### Chrome acceptance

An isolated local Harness host used synthetic session events and a keyless streaming adapter. All UI interaction and captures used the real browser page. The capture fixture is in [integration/](integration/README.md).

- Working header updated with elapsed time; after a page reload it continued from the recorded start instead of resetting.
- Progress commentary stayed visible while native reasoning/tool activity grouped into expandable summaries.
- Completing the streamed turn automatically collapsed intermediate work and preserved the final Markdown, table, and native response actions.
- Expanding work retained its viewport position: the header measured 216 CSS px from the top before and after expansion.
- Enter and Space operated disclosure controls. Expanding a group exposed native Think and Bash cards, and the Bash card still opened its command/output details.
- Stopping a second turn retained commentary and interrupted reasoning; its work header remained expanded.
- English/Chinese controls followed the host language. Light/dark appearance followed host tokens. No warning or error was recorded in the demo page's browser console.

The current Chrome viewport was 1450 CSS px wide. A requested 700 px override did not change the observed viewport, so this release does not claim a new narrow-screen browser measurement; the earlier 0.3.0 measurements below remain historical evidence for unchanged typography/table styles.

### Publication images

[Working](docs/images/tidy-work-working.png), [completed](docs/images/tidy-work-completed.png), [expanded](docs/images/tidy-work-expanded.png), and [dark theme](docs/images/tidy-work-dark.png) are unedited real-app captures. The first three appear on both READMEs and lead the storefront screenshot list. The text, commands, workspace, and results are synthetic; no private conversation, credential, or personal filesystem path appears. The displayed check results are demonstration content, not evidence of a model performing those checks.

## Earlier release: 0.3.0

This record captures the release checks performed for `dsh-chat-tidy` 0.3.0 on 2026-08-30 against a source checkout of DeepSeek Harness `>=0.1.0-rc.6`.

## Automated checks

```sh
pnpm run check
pnpm run pack:check
```

`pnpm run check` passed strict TypeScript checks, ESLint, 6 Vitest tests across 2 files, both the host and Web-client builds, and the generated-bundle freshness check. The package dry run contained only the declared release files, including the new Tidy Tables comparison image and the eight-entry storefront screenshot manifest.

## Measured browser results

The stylesheet was applied to a seeded session in the real assembled Web app — the keyless web lane boots the actual host, a real Chromium, and the built `apps/web/dist`, so the DOM and the application CSS are identical on both sides and only the plugin stylesheet differs. Every row is a computed style read from the live document at 1280 CSS px with a device scale factor of 2.

| Item | DSH default | With Tidy Chat | Codex target |
| --- | --- | --- | --- |
| Body | 16 / 28 px, weight 400, margin 16 / 16 | 14 / 22 px, weight 400, margin 0 / 11 | 14 / 22 px, margin 0 / 11 |
| h1 | 24 / 34 px, weight 700, margin 0 / 16 | 24 / 30 px, weight 600, margin 0 / 10 | 24 / 30 px, weight 600 |
| h2 | 22 / 32 px, weight 700, margin 32 / 16 | 20 / 25 px, weight 600, margin 20 / 10 | 20 / 25 px, weight 600 |
| h3 | 20 / 30 px, weight 700, margin 32 / 16 | 17 / 22 px, weight 600, margin 20 / 10 | 17 / 22 px, weight 600 |
| h4 | 16 / 28 px, weight 600, margin 16 / 16 | 17 / 22 px, weight 600, margin 20 / 10 | 17 / 22 px, weight 600 |
| List item (not first) | 16 / 28 px, margin-top 6 px | 14 / 22 px, margin-top 8 px | margin-top 8 px |
| Table cell | 15 / 25 px | 14 / 22 px | 14 / 22 px |
| Blockquote | 16 / 28 px, margin 16 / 0 | 14 / 22 px, margin 0 / 11 | 14 / 22 px |
| Rule (`hr`) | margin 32 / 32 | margin 28 / 28 | margin 28 / 28 |
| Reading column | 748 px | 748 px | ≈730 px |
| **Rendered reply height** | **1411 px** | **1127 px (−20 %)** | — |

Every metric landed on its Codex target. The reading column is left alone deliberately: DSH's 748 px is already within 2.5 % of the Codex measurement, so changing it would be churn.

Two divergences from Codex are intentional and recorded in [DESIGN.md](DESIGN.md): inline code keeps DSH's `font-size: 0.875em !important`, and the blockquote inset is 18 px rather than 24 px.

## Tidy Tables browser results

The 0.3.0 browser lane installed the local release bundle into an isolated DSH Web profile, created a real Workspace and Session through the loopback API, ran the real Agent loop against a local streaming model fixture, and let DSH's production React Markdown renderer produce two tables. Before and after captures came from that one rendered assistant node by disabling only `<style data-plugin="dsh-chat-tidy">` between reads.

| Property | DSH default | With Tidy Tables |
| --- | --- | --- |
| Outer rule | none | 1 px solid `rgba(0, 0, 0, 0.1)` |
| Outer radius | 0 px | 12 px |
| Table minimum width | 0 px | 100 % |
| Header weight | 500 | 600 |
| Header surface | transparent | `rgb(249, 250, 251)` from the host token |
| Cell padding | 10 × 16 px source default | 8 × 12 px computed |
| Wide table | open table width | 999 px scroll width contained by a 746 px shell |

The 8-column table produced internal horizontal overflow while the 1280 px page remained exactly 1280 px wide. At a 700 px viewport the page client and scroll widths both remained 700 px. Under `body[data-ds-dark-theme]`, computed table colors changed to a `rgb(21, 21, 23)` shell, `rgb(44, 44, 46)` header, and `rgba(255, 255, 255, 0.12)` border without a plugin-specific dark-mode rule.

## Visual checks

Captured from the same session, seeded with a reply that exercises headings h1 – h4, paragraphs, nested lists, a blockquote, a table, inline code, a fenced code block, and a horizontal rule:

- desktop at 1280 × 960 in the built-in theme, before and after — [`docs/images/comparison.png`](docs/images/comparison.png);
- the complete reply flow at full height, before and after — [`docs/images/density.png`](docs/images/density.png);
- the whole application window with the plugin applied — [`docs/images/hero.png`](docs/images/hero.png);
- the same stylesheet under the built-in dark theme, before and after, showing the geometry changes while every colour still comes from the `--dsw-*` tokens — [`docs/images/themes.png`](docs/images/themes.png);
- the conversation at 700 × 900 CSS px with no horizontal overflow, where DSH collapses its own sidebar and the user-bubble cap falls back to 88 % — [`docs/images/narrow.png`](docs/images/narrow.png).
- the focused 0.3.0 table component before and after, rendered from the same real assistant reply — [`docs/images/tidy-tables.png`](docs/images/tidy-tables.png).

No plugin error or warning appeared in the browser console.

## Lifecycle check

The Vitest lifecycle test mounts the plugin through a fake client context and asserts exactly one `[data-plugin='dsh-chat-tidy']` stylesheet in `head`, and zero after the effect disposer runs. Because the plugin contributes no preference, no Settings row, and no stored state, disabling or uninstalling it is the complete rollback path — there is nothing left behind to reset.
