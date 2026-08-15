# dsh-chat-tidy

Tidy Chat gives the DeepSeek Harness Web conversation page a calmer, more consistent reading rhythm. It refines typography, message width, spacing, user bubbles, compact activity rows, and the composer while preserving DSH's renderer, theme, tools, reasoning, and session behavior.

[简体中文](README.zh.md)

## What changes

- A restrained 21 / 18 / 16 px heading scale instead of article-sized Markdown headings.
- A consistent 15 px / 25 px body rhythm in the recommended mode.
- Tighter paragraphs, lists, code blocks, tables, tool rows, and turn spacing.
- A slightly wider, centered reading column and a less inflated composer.
- Responsive narrow-screen rules and full light/dark/custom-theme support.
- **Settings → General → Chat typography** with Balanced, Compact, and Original modes.

Balanced is the first-run default. Original leaves the DSH conversation presentation untouched without uninstalling the plugin.

## Design posture

Tidy Chat is a presentation plugin, not a replacement chat client. It does not:

- parse or sanitize Markdown;
- replace `conversation.chat.node` renderers;
- hide reasoning, context injection, or tool calls;
- observe and rewrite React DOM nodes;
- change model output, session logs, or host data.

The stylesheet is scoped by `body[data-dsh-chat-tidy]` and DSH's semantic anchors (`data-chat-flow`, `data-chat-flow-kind`, `data-disclosure-row`, and `data-composer-card`). Colors continue to come from `--dsw-*` tokens, so the built-in themes and token-based theme plugins keep palette ownership. See [DESIGN.md](DESIGN.md) for the exact scale and lifecycle.

## Install

From the community catalog:

```sh
dsh plugin --profile web add github:ChuanTianML/dsh-chat-tidy
```

Restart `dsh web`, then open **Settings → General → Chat typography**.

The GitHub repository includes verified host and client bundles, so installation does not need to run a dependency build script or change pnpm's `allowBuilds` policy.

For local development:

```sh
dsh plugin --profile web add -w /absolute/path/to/dsh-chat-tidy
```

The `-w` flag is required because the Web profile is a pnpm workspace root.

## Modes

| Mode | Body | Headings | Content width | Intended use |
| --- | --- | --- | --- | --- |
| Balanced | 15/25 | 21/18/16 | 760 px | Recommended everyday reading |
| Compact | 14/23 | 19/17/15 | 820 px | Long technical sessions |
| Original | DSH default | DSH default | DSH default | Instant rollback / comparison |

The selection is stored in this browser under `dsh-chat-tidy:mode`. A storage failure falls back to a session-local Balanced mode and never prevents the app from loading.

## Compatibility

- **Built-in light/dark themes:** supported.
- **dsh-skin:** compatible; Tidy Chat owns geometry while dsh-skin owns colors.
- **dsh-ux:** both plugins change chat typography and flow spacing. Use one layout plugin at a time to avoid competing overrides.
- **Alternative conversation views:** Tidy Chat only affects views that reuse DSH's semantic chat-flow anchors.

The current implementation targets DSH `>=0.1.0-rc.6`. If DSH removes a semantic anchor, the unmatched rule becomes inert; it does not block rendering.

## Development

Requires Node `^22.19` or `>=24` and pnpm 11.

```sh
pnpm install
pnpm run check
pnpm run pack:check
```

`pnpm run check` runs strict typechecking, ESLint, Vitest, both host/client builds, and a generated-bundle freshness check. The tests cover preference validation, storage failure, cross-tab updates, stylesheet reference counting, Settings accessibility, slot registration, and complete disposal.

See [VALIDATION.md](VALIDATION.md) for the 0.1.0 installed-profile smoke test and measured browser results.

## Privacy and security

The plugin makes no network requests. It stores only the selected presentation mode in localStorage. Report security issues as described in [SECURITY.md](SECURITY.md).

## License

MIT
