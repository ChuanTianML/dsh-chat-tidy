# Tidy Chat design

## Objective

Make the default DSH conversation easier to scan and closer to the restrained density of mature coding-agent clients, without forking the chat renderer or changing information semantics.

The primary defect is not Markdown support. DSH already owns GFM, KaTeX, syntax highlighting, sanitization, streaming, attachments, file mentions, and tool views. The defect is the article-like scale applied inside a high-frequency work surface: 24/22/20 px headings, 32 px heading margins, and 16 px paragraph/list gaps produce large changes in visual volume from one model response to another.

## Visual system

Balanced uses a 4 px-derived vertical rhythm:

| Element | Balanced | Compact |
| --- | --- | --- |
| Body | 15 px / 25 px | 14 px / 23 px |
| H1 | 21 px / 29 px | 19 px / 26 px |
| H2 | 18 px / 26 px | 17 px / 24 px |
| H3 | 16 px / 24 px | 15 px / 22 px |
| Heading margin | 24 px / 8 px | 18 px / 6 px |
| Paragraph/list margin | 10 px | 7 px |
| Chat-flow gap | 14 px | 10 px |
| Assistant block gap | 12 px | 9 px |
| Content width | 760 px | 820 px |
| User bubble | 15 px / 23 px | 14 px / 22 px |
| Composer radius | 18 px | 16 px |

Font family and colors remain inherited from DSH. Heading weight uses 650 when supported and naturally resolves between available static weights otherwise. The negative heading tracking is intentionally slight (`-0.018em`) and body tracking is nearly neutral (`-0.004em`).

## Extension boundary

The browser bundle contributes one Settings row through `settings.general.item`. Its CSS targets only:

- a plugin-owned body marker;
- the slot renderer's stable `[data-slot]` anchor;
- conversation-owned semantic `data-*` attributes;
- semantic Markdown elements below an `assistant-step` row;
- plugin-owned Settings classes.

CSS module hashes are never referenced. The plugin does not register a keyed chat-node replacement or a `conversation.view`, because either would duplicate DSH's renderer and sever feature contributions added by other plugins.

## Lifecycle

The client mounts:

1. one reference-counted `<style data-plugin="dsh-chat-tidy">`;
2. one controller that applies the stored mode to `<body>` and listens for cross-tab storage changes;
3. one locale namespace;
4. one General Settings slot entry.

Disposal removes the storage listener, restores the body attribute that existed before activation, unregisters dictionaries and the slot entry through Cordis effects, and removes the final stylesheet reference.

## Persistence

The current DSH browser settings transport exposes an allowlist of built-in namespaces. A visual preference therefore uses localStorage under `dsh-chat-tidy:mode`. Only three values are accepted; missing or malformed values resolve to Balanced. Storage read/write errors are swallowed because persistence failure must not block the Web UI.

## Accessibility

The mode selector is a labelled button group. Each option reports `aria-pressed`; focus uses the DSH business-color token and does not rely on color alone. Responsive rules stack the row and selector below 700 px and turn the selector into a vertical list below 480 px. Motion is limited to short Settings-control transitions and disabled under `prefers-reduced-motion`.

## Compatibility and failure mode

Rules use modern CSS already required by DSH's Chromium-class Web client, including `:has()` and `color-mix()`. A removed DSH semantic attribute produces an unmatched rule, not an exception. The plugin never uses a DOM observer, so a host DOM change cannot create a render loop or stale cloned node.

Token-based theme plugins are compatible. Layout plugins that set the same typography or chat-flow properties compete by definition; Tidy Chat raises specificity only inside its body scope and documents that users should select one layout plugin.

## Non-goals

- Aggregating tool calls into a new synthetic “worked for” row.
- Hiding reasoning or context by default.
- Replacing the conversation header, sidebar, or editor layout.
- Changing Markdown structure or model prompting.

Those require product-level renderer or view contributions and should be evaluated separately from typography polish.
