/** Tidy Chat's Codex-aligned conversation stylesheet. */
import { PROCESS_CSS } from './process-styles.ts'

/** Marker used to find the plugin-owned stylesheet during lifecycle cleanup. */
export const STYLE_MARKER = 'dsh-chat-tidy'

/** Stable DSH structure that owns one rendered Markdown table. */
export const TIDY_TABLE_SHELL_SELECTOR = "body [data-chat-flow-kind='assistant-step'] [data-slot='conversation.chat.node'] :where(div):has(> table)"

/**
 * Metrics come from the Codex desktop client: its bundled stylesheet plus pixel
 * measurement of a live window. Body text is 14px on a `font-size + 8px` leading
 * rule, headings run 24/20/17/17/15/15 at weight 600 with 20px/10px margins, and
 * block rhythm is 11px rather than DSH's 16px.
 *
 * Selectors use documented DSH chat anchors and carry a leading `body` so each
 * rule outranks the equal-specificity CSS-module defaults regardless of
 * stylesheet order. Tidy Tables keeps Codex's measured cell density, then uses
 * DSH's own 12px code-block geometry and theme tokens for the component frame.
 * Color stays on DSH design tokens so themes keep the palette.
 */
export const TIDY_CHAT_CSS = String.raw`
:root {
  --dsh-ct-font-size: 14px;
  --dsh-ct-line-height: 22px;
  --dsh-ct-block-gap: 11px;
  --dsh-ct-heading-top: 20px;
  --dsh-ct-heading-bottom: 10px;
  --dsh-ct-list-indent: 21px;
  --dsh-ct-user-width: 560px;
  --dsh-ct-table-radius: 12px;
}

body [data-chat-flow] {
  gap: 14px;
}

body [data-conversation-scroll] :where(div):has(> [data-chat-flow]) {
  padding-block: 18px 26px;
}

body [data-chat-flow-kind='assistant-step'] > [data-slot='conversation.chat.node'] > div {
  font-size: var(--dsh-ct-font-size);
  line-height: var(--dsh-ct-line-height);
}

body [data-chat-flow-kind='assistant-step'] > [data-slot='conversation.chat.node'] > div > div:first-child {
  gap: var(--dsh-ct-block-gap);
}

body [data-chat-flow-kind='assistant-step'] :where(h1, h2, h3, h4, h5, h6) {
  margin-block: var(--dsh-ct-heading-top) var(--dsh-ct-heading-bottom);
  font-weight: 600;
}

body [data-chat-flow-kind='assistant-step'] h1 {
  font-size: 24px;
  line-height: 30px;
}

body [data-chat-flow-kind='assistant-step'] h2 {
  font-size: 20px;
  line-height: 25px;
}

body [data-chat-flow-kind='assistant-step'] :where(h3, h4) {
  font-size: 17px;
  line-height: 22px;
}

body [data-chat-flow-kind='assistant-step'] :where(h5, h6) {
  font-size: 15px;
  line-height: 20px;
}

body [data-chat-flow-kind='assistant-step'] :where(p, li, blockquote, th, td) {
  font-size: var(--dsh-ct-font-size);
  line-height: var(--dsh-ct-line-height);
}

body [data-chat-flow-kind='assistant-step'] p {
  margin-block: 0 var(--dsh-ct-block-gap);
}

body [data-chat-flow-kind='assistant-step'] :where(ul, ol) {
  margin-block: 0 var(--dsh-ct-heading-bottom);
  padding-inline-start: var(--dsh-ct-list-indent);
}

body [data-chat-flow-kind='assistant-step'] li:not(:first-child) {
  margin-top: 8px;
}

body [data-chat-flow-kind='assistant-step'] li > p {
  margin-block: 0 var(--dsh-ct-block-gap);
}

body [data-chat-flow-kind='assistant-step'] blockquote {
  position: relative;
  margin-block: 0 var(--dsh-ct-block-gap);
  padding-block: 4px;
  padding-inline-start: 18px;
  border-inline-start: 0;
  color: var(--dsw-alias-label-secondary);
}

/* Codex draws the quote rule as a rounded 4px bar, which a border cannot round. */
body [data-chat-flow-kind='assistant-step'] blockquote::before {
  content: '';
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 4px;
  border-radius: 2px;
  background: var(--dsw-alias-border-l3);
}

body [data-chat-flow-kind='assistant-step'] :where(pre, .md-code-block) {
  margin-block: 12px;
}

body [data-chat-flow-kind='assistant-step'] :not(pre) > code {
  padding: 1px 6px;
  box-decoration-break: clone;
}

body [data-chat-flow-kind='assistant-step'] hr {
  margin-block: 28px;
}

${TIDY_TABLE_SHELL_SELECTOR} {
  margin-block: 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: var(--dsh-ct-table-radius);
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  background: var(--dsw-alias-bg-base);
}

${TIDY_TABLE_SHELL_SELECTOR} > table {
  border-collapse: separate;
  border-spacing: 0;
  width: max-content;
  min-width: 100%;
  max-width: none;
}

${TIDY_TABLE_SHELL_SELECTOR} :where(th, td) {
  padding-block: 8px;
  padding-inline: 12px;
  overflow-wrap: anywhere;
}

${TIDY_TABLE_SHELL_SELECTOR} th {
  border-bottom: 1px solid var(--dsw-alias-border-l3);
  background: var(--dsw-alias-markdown-code-block-banner);
  font-weight: 600;
}

${TIDY_TABLE_SHELL_SELECTOR} td {
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

${TIDY_TABLE_SHELL_SELECTOR} :where(th, td):not(:last-child) {
  border-inline-end: 1px solid var(--dsw-alias-border-l2);
}

${TIDY_TABLE_SHELL_SELECTOR} :where(th, td):first-child {
  padding-inline-start: 12px;
}

${TIDY_TABLE_SHELL_SELECTOR} :where(th, td):last-child {
  padding-inline-end: 12px;
}

${TIDY_TABLE_SHELL_SELECTOR} tbody tr:last-child td {
  border-bottom: 0;
}

body [data-chat-flow] [data-disclosure-row] {
  height: 22px;
}

body [data-chat-flow] [data-disclosure-row] > span {
  font-size: 13px;
  line-height: 22px;
}

body [data-chat-flow-kind='user'] [data-time-hover-root] > div:first-child {
  max-width: min(var(--dsh-ct-user-width), 78%);
}

body [data-chat-flow-kind='user'] [data-time-hover-root] > div:first-child > div:not([data-align]) {
  padding: 9px 14px;
  border-radius: 18px;
  font-size: var(--dsh-ct-font-size);
  line-height: var(--dsh-ct-line-height);
}

body [data-turn-tail] {
  gap: 10px;
}

body [data-composer-card] {
  gap: 10px;
  padding-top: 8px;
  border-radius: 18px;
  font-size: var(--dsh-ct-font-size);
  line-height: var(--dsh-ct-line-height);
}

@media (max-width: 700px) {
  body [data-chat-flow-kind='user'] [data-time-hover-root] > div:first-child {
    max-width: 88%;
  }
}
${PROCESS_CSS}
`

interface StyleRecord {
  element: HTMLStyleElement
  references: number
}

const records = new WeakMap<Document, StyleRecord>()

/**
 * Mount the stylesheet once per document and reference-count its lifecycle.
 * @param document - Browser document owned by the client application.
 * @returns A disposer that removes the last plugin-owned stylesheet.
 */
export function adoptStyles(document: Document): () => void {
  const current = records.get(document)
  if (current !== undefined) {
    current.references += 1
    return () => { releaseStyles(document) }
  }

  const element = document.createElement('style')
  element.dataset.plugin = STYLE_MARKER
  element.textContent = TIDY_CHAT_CSS
  document.head.appendChild(element)
  records.set(document, { element, references: 1 })
  return () => { releaseStyles(document) }
}

function releaseStyles(document: Document): void {
  const record = records.get(document)
  if (record === undefined) return
  record.references -= 1
  if (record.references > 0) return
  record.element.remove()
  records.delete(document)
}
