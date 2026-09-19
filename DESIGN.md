# Tidy Chat design

## Objective

Make the DSH Web conversation read like a mature coding-agent client. Codex is the target for typography and density: every metric below is measured from it, not invented. Tidy Tables deliberately completes the table frame with DSH's own component vocabulary. Native renderers, logged content, and host-owned colors remain authoritative. Tidy Work adds reversible presentation state in 0.4.0.

The defect being corrected is the article-like scale applied inside a high-frequency work surface: DSH renders 16 px body on 28 px leading with 32 px heading margins and 16 px block gaps, so visual volume swings sharply from one model response to another.

## Measurement method

Two independent readings were taken and agreed:

1. The Codex desktop app's bundled stylesheets and Markdown editor theme, extracted from `ChatGPT.app`'s `app.asar` (`app-*.css` and `app-initial-*.js`).
2. Pixel measurement of a live Codex window (2× retina screenshot, ink-row/column profiling to recover line pitch and box edges).

## Codex versus DSH

| Item | DSH default | Codex measured | Tidy Chat applies |
| --- | --- | --- | --- |
| Body | 16 / 28 px (1.75) | 14 / 22 px, rule `font-size + 8px` | 14 / 22 px |
| h1 | 24 / 34 px, weight 700 | 24 / 30 px (`line-height: 1.25`), weight 600 | 24 / 30 px, weight 600 |
| h2 | 22 / 32 px, weight 700 | 20 / 25 px, weight 600 | 20 / 25 px, weight 600 |
| h3, h4 | 20 / 30 px, 16 / 28 px | 17 / 22 px both | 17 / 22 px both |
| h5, h6 | 16 / 28 px | 15 / 20 px | 15 / 20 px |
| Heading margin | 32 px / 16 px | 20 px / 10 px | 20 px / 10 px |
| Paragraph | `margin: 16px 0` | `margin: 0 0 11px` (.6875rem) | `margin: 0 0 11px` |
| List indent | 18 px | 21 px (1.3125rem) | 21 px |
| List item gap | 6 px | 8 px (.5rem) | 8 px |
| List block margin | 16 px | 10 px (.625rem) | 10 px |
| `hr` | 32 px | 28 px | 28 px |
| Blockquote | 2 px square border, 14 px inset | rounded 4 px bar (radius 2 px), 24 px inset | rounded 4 px bar, 18 px inset |
| Inline code | radius 6 px, padding 0 5px | radius 6 px, padding 1px 6px, `box-decoration-break: clone` | padding and clone only |
| Table cells | 15 / 25 px tokens, 10 × 16 px | inherited 14 / 22 px, 8 × 12 px, header weight 600 | 14 / 22 px, 8 × 12 px, header weight 600 |
| Content width | 748 px | ≈730 px | unchanged at 748 px |

Two deliberate divergences: inline-code `font-size` is left alone because DSH sets `0.875em !important` and an `!important` war is not worth a 0.045em difference; blockquote inset is 18 px rather than 24 px because DSH's quote text is not indented as deeply to begin with.

Codex additionally tightens the gap between adjacent Han-script paragraphs to 4 px. That rule is not reproduced: DSH's `index.html` pins `lang="zh-CN"` statically, so a `:lang()` guard would also fire on English responses.

The rightmost column is reproducible from the running app rather than from this table alone. The heading ladder and body text side by side, with the computed styles read from the live document:

![The heading ladder and body text before and after Tidy Chat](docs/images/typography.png)

The blockquote bar and the table cells, both panes drawn 1:1 so the visible size difference is the rendered one:

![The blockquote bar and table cells before and after Tidy Chat](docs/images/blocks.png)

## Tidy Tables component

Codex's Markdown editor theme establishes the compact table rhythm: each cell uses 8 px block and 12 px inline padding, adjacent body rows have a 1 px separator, and header cells use weight 600. Tidy Chat already owned the inherited 14 / 22 px type, so 0.3.0 completes those measured properties without changing cell content or alignment.

The user-approved table frame is a deliberate DSH-native extension rather than a claim about Codex's table chrome. It uses a 1 px `--dsw-alias-border-l2` outer rule, DSH's existing 12 px code-block radius, `--dsw-alias-markdown-code-block-banner` for the header surface, and host border tokens for row and column rules. The table keeps `width: max-content` for wide content, adds `min-width: 100%` for short tables, and leaves the existing horizontal scrolling behavior in place.

![The same Markdown table before and after the Tidy Tables component](docs/images/tidy-tables.png)

## Tidy Work (0.4.0)

Codex reference: desktop 26.901.41123, observed in running and completed turns. The reference puts a work-duration header above a divider, preserves progress commentary while running, aggregates consecutive activity, and lets completed work fold independently of the final assistant answer. This plugin implements that interaction using Harness-owned events; it does not reuse Codex code.

The header and group labels reuse the measured 13 / 22 px activity rhythm. The 8 px label/chevron gap, 12 px header top spacing, and 14 px divider clearance reuse the existing compact spacing vocabulary. The 1 px divider uses the host border token. Only the chevron animates (150 ms); reduced-motion disables it. These header spacing choices are a DSH adaptation, not additional pixel-for-pixel Codex claims.

### Completion and visibility

`turn/end` must report `completed`, the host's `turn-tail` projection must identify a content-bearing final assistant, and the loaded history must include `turn/start` before a turn defaults to collapsed. A closed turn alone is insufficient. Streaming prose is never treated as the final answer. Time comes from the logged boundaries, not per-tool sums or the moment the page mounted.

The final assistant's text remains visible even when its reasoning shares the same native row. Progress commentary is foldable only after normal completion. Errors, interrupted output, context, unknown block types, images, unsupported tools, and extension nodes form visible barriers. Pending questions and approvals keep active tools visible; their native composer interfaces are untouched. A tool with a failed or unsupported nested call is also kept visible.

Supported passive tools are an explicit allowlist. Consecutive pure reasoning and tool rows share one group. Text splits activity groups; trailing reasoning can share a summary with the following tool row while remaining at its original position. Group labels contain action categories and counts, not paths or command text.

### Native presentation attachment

Harness currently exposes a keyed node renderer but no turn-grouping renderer. Replacing Chat would duplicate its paging, scroll, composer, tool, and extension behavior. Instead, the plugin registers a nonvisual subscription in `conversation.session.header.utilities`, scopes it to that conversation column, and inserts its own buttons beside semantic native anchors.

The controller reads `chat.order`, `chat.nodes`, `chat.timeline`, `running`, and `pending` through `useSession`. A child-list MutationObserver only finds native mounts and streamed children; it never infers model state from text. Own-control mutations are ignored and native mutations are coalesced. It never moves, clones, reparents, or recreates a native React node. Generated CSS-module class names are never read.

Visibility uses a plugin-owned attribute; controls reference native elements through `aria-controls`, and generated ids are removed on disposal. Unmatched anchors do not cause matched siblings to disappear into a partially mounted activity group. Native detail expansion and event handlers survive the plugin's show/hide operations.

### Reader state and lifecycle

Explicit turn and group expansion is retained in memory per session for the plugin lifetime. A focused native control or selected text prevents automatic turn collapse. Switching sessions disposes the old column controller while retaining its choices; reloading resets those choices. One timer updates visible active-turn labels without an aria-live announcement every second. Expanding a control restores its viewport position after native bottom-follow layout; a new pointer, touch, wheel, or keyboard gesture cancels the delayed restoration.

Disabling or uninstalling removes the header subscription, controls, visibility attributes, generated ids, MutationObserver, timers, dictionaries, and stylesheet. Every original row becomes visible. There is no network request, persistent browser storage, or host-side behavior.

## Styles and compatibility

Typography and tables use conversation-owned `data-*` attributes, the slot renderer's `[data-slot]`, and semantic Markdown descendants. Every conversation selector starts with `body` so it outranks equal-specificity CSS-module defaults regardless of stylesheet order. The stylesheet is reference counted per document.

Removed semantic anchors leave the affected enhancement inactive. Browser appearance and native lifecycle integration are separate checks: unit tests cover the policy and reversible attachment; the assembled test boots actual Harness and plugin bundles. Built-in light/dark themes retain palette ownership through `--dsw-*` tokens. Competing layout plugins may override the same geometry.

## Non-goals

Changing model requests or session logs, replacing native tool widgets, modifying the sidebar or editor, copying Codex's palette, and adding an extra Settings panel are outside this plugin's scope.
