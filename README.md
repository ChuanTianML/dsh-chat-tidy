# dsh-chat-tidy

Tidy Chat aligns the DeepSeek Harness Web conversation page with the reading rhythm of a mature coding-agent client. Typography and spacing are measured from the Codex desktop app, then applied to DSH's own chat anchors. Tidy Tables completes Markdown tables with DSH-native component chrome. The Markdown renderer, theme, tool calls, reasoning, and session behavior are untouched.

[简体中文](README.zh.md)

![The DSH Web conversation page with Tidy Chat applied](docs/images/hero.png)

## What changes

| Item | DSH default | Tidy Chat (Codex-measured) |
| --- | --- | --- |
| Body | 16 / 28 px | **14 / 22 px** |
| h1 – h6 | 24 / 22 / 20 / 16 / 16 / 16 px, weight 700 | **24 / 20 / 17 / 17 / 15 / 15 px, weight 600** |
| Heading margin | 32 px above, 16 px below | **20 px above, 10 px below** |
| Block rhythm | 16 px | **11 px** |
| List indent · item gap | 18 px · 6 px | **21 px · 8 px** |
| Rule (`hr`) | 32 px | 28 px |
| Blockquote | 2 px square border | rounded 4 px bar, 18 px inset |
| Tables | Open edges; 15 / 25 px, 10 × 16 px cells | Rounded component; themed header; row and column rules; 14 / 22 px, 8 × 12 px cells |
| Activity rows | 24 px, 14 / 24 px label | 22 px, 13 / 22 px label |

The reading column stays at DSH's 748 px, because Codex measures ≈730 px — the existing width was already right. Two earlier over-tightenings are reversed: list items go back out to 8 px and horizontal rules to 28 px.

![The heading ladder and body text before and after Tidy Chat](docs/images/typography.png)

### Tidy Tables

Tables now read as one component instead of a set of open horizontal rules. The shell uses DSH's own 12 px code-block radius and theme tokens; the header adopts the code-block banner surface and Codex's measured weight 600; short tables fill the reading column, while wide tables keep horizontal scrolling. No table content or alignment is rewritten.

![The same Markdown table before and after Tidy Tables](docs/images/tidy-tables.png)

### Side by side

Both captures come from the same seeded session in the real assembled Web app, at the same viewport and device scale. The only difference between the two panes is the plugin stylesheet.

![The same viewport before and after Tidy Chat](docs/images/comparison.png)

The same reply rendered end to end is 1411 px tall by default and 1127 px with Tidy Chat — 20 % less scrolling for identical content.

![Full-height reply flow before and after Tidy Chat](docs/images/density.png)

## Design posture

Tidy Chat is a stylesheet and nothing else. There is no preference, no Settings row, and no stored state — disabling or uninstalling the plugin is the off switch. It does not:

- parse or sanitize Markdown;
- replace `conversation.chat.node` renderers;
- hide reasoning, context injection, or tool calls;
- observe and rewrite React DOM nodes;
- change model output, session logs, or host data.

Selectors use DSH's semantic anchors (`data-chat-flow`, `data-chat-flow-kind`, `data-slot`, `data-disclosure-row`, `data-composer-card`, `data-turn-tail`, `data-time-hover-root`), never generated CSS-module class names. Each one carries a leading `body` so it outranks the equal-specificity module default regardless of stylesheet order. Colors continue to come from `--dsw-*` tokens, so built-in themes and token-based theme plugins keep palette ownership. The table shell is found through the stable rendered structure below those anchors, never its generated class. See [DESIGN.md](DESIGN.md) for the measurement and component record.

## Install

```sh
dsh plugin --profile web add github:ChuanTianML/dsh-chat-tidy
```

Restart `dsh web`. The new layout applies immediately.

The GitHub repository includes verified host and client bundles, so installation does not need to run a dependency build script or change pnpm's `allowBuilds` policy.

For local development:

```sh
dsh plugin --profile web add -w /absolute/path/to/dsh-chat-tidy
```

The `-w` flag is required because the Web profile is a pnpm workspace root.

## Compatibility

- **Built-in light/dark themes:** supported.
- **dsh-skin:** compatible; Tidy Chat owns geometry while dsh-skin owns colors.
- **dsh-ux:** both plugins change chat typography and flow spacing. Use one layout plugin at a time to avoid competing overrides.
- **Alternative conversation views:** Tidy Chat only affects views that reuse DSH's semantic chat-flow anchors.

Colors keep coming from the host, so the dark theme changes geometry only:

![The same stylesheet under the built-in dark theme](docs/images/themes.png)

At 700 CSS px DSH collapses its own sidebar and the user-bubble cap falls back to 88 %, with no horizontal overflow:

![The conversation at 700 px before and after Tidy Chat](docs/images/narrow.png)

The current implementation targets DSH `>=0.1.0-rc.6`. If DSH removes a semantic anchor, the unmatched rule becomes inert; it does not block rendering.

## Development

Requires Node `^22.19` or `>=24` and pnpm 11.

```sh
pnpm install
pnpm run check
pnpm run pack:check
```

`pnpm run check` runs strict typechecking, ESLint, Vitest, both host/client builds, and a generated-bundle freshness check. The tests cover stylesheet reference counting, anchor and specificity discipline, stable table-shell targeting, table component rules, and complete disposal.

See [VALIDATION.md](VALIDATION.md) for measured browser results.

## Privacy and security

The plugin makes no network requests and stores nothing. Report security issues as described in [SECURITY.md](SECURITY.md).

## License

MIT
