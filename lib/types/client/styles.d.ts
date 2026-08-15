/** Tidy Chat's conversation stylesheet, measured against the Codex desktop client. */
/** Marker used to find the plugin-owned stylesheet during lifecycle cleanup. */
export declare const STYLE_MARKER = "dsh-chat-tidy";
/**
 * Metrics come from the Codex desktop client: its bundled stylesheet plus pixel
 * measurement of a live window. Body text is 14px on a `font-size + 8px` leading
 * rule, headings run 24/20/17/17/15/15 at weight 600 with 20px/10px margins, and
 * block rhythm is 11px rather than DSH's 16px.
 *
 * Selectors use documented DSH chat anchors and carry a leading `body` so each
 * rule outranks the equal-specificity CSS-module defaults regardless of
 * stylesheet order. Color stays on DSH design tokens so themes keep the palette.
 */
export declare const TIDY_CHAT_CSS: string;
/**
 * Mount the stylesheet once per document and reference-count its lifecycle.
 * @param document - Browser document owned by the client application.
 * @returns A disposer that removes the last plugin-owned stylesheet.
 */
export declare function adoptStyles(document: Document): () => void;
