/** Tidy Chat's scoped visual rules and Settings-row presentation. */
/** Marker used to find the plugin-owned stylesheet during lifecycle cleanup. */
export declare const STYLE_MARKER = "dsh-chat-tidy";
/**
 * The stylesheet changes only semantic chat anchors and plugin-owned Settings
 * classes. Color remains on DSH design tokens so built-in and third-party
 * themes keep ownership of the palette.
 */
export declare const TIDY_CHAT_CSS: string;
/**
 * Mount the stylesheet once per document and reference-count its lifecycle.
 * @param document - Browser document owned by the client application.
 * @returns A disposer that removes the last plugin-owned stylesheet.
 */
export declare function adoptStyles(document: Document): () => void;
