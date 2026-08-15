/** Tidy Chat's scoped visual rules and Settings-row presentation. */

/** Marker used to find the plugin-owned stylesheet during lifecycle cleanup. */
export const STYLE_MARKER = 'dsh-chat-tidy'

/**
 * The stylesheet changes only semantic chat anchors and plugin-owned Settings
 * classes. Color remains on DSH design tokens so built-in and third-party
 * themes keep ownership of the palette.
 */
export const TIDY_CHAT_CSS = String.raw`
body[data-dsh-chat-tidy='balanced'] {
  --dsh-ct-content-width: 760px;
  --dsh-ct-flow-gap: 14px;
  --dsh-ct-block-gap: 12px;
  --dsh-ct-font-size: 15px;
  --dsh-ct-line-height: 25px;
  --dsh-ct-h1-size: 21px;
  --dsh-ct-h1-line: 29px;
  --dsh-ct-h2-size: 18px;
  --dsh-ct-h2-line: 26px;
  --dsh-ct-h3-size: 16px;
  --dsh-ct-h3-line: 24px;
  --dsh-ct-heading-top: 24px;
  --dsh-ct-heading-bottom: 8px;
  --dsh-ct-paragraph-gap: 10px;
  --dsh-ct-user-width: 560px;
  --dsh-ct-user-size: 15px;
  --dsh-ct-user-line: 23px;
  --dsh-ct-user-padding-y: 9px;
  --dsh-ct-user-padding-x: 14px;
  --dsh-ct-composer-radius: 18px;
}

body[data-dsh-chat-tidy='compact'] {
  --dsh-ct-content-width: 820px;
  --dsh-ct-flow-gap: 10px;
  --dsh-ct-block-gap: 9px;
  --dsh-ct-font-size: 14px;
  --dsh-ct-line-height: 23px;
  --dsh-ct-h1-size: 19px;
  --dsh-ct-h1-line: 26px;
  --dsh-ct-h2-size: 17px;
  --dsh-ct-h2-line: 24px;
  --dsh-ct-h3-size: 15px;
  --dsh-ct-h3-line: 22px;
  --dsh-ct-heading-top: 18px;
  --dsh-ct-heading-bottom: 6px;
  --dsh-ct-paragraph-gap: 7px;
  --dsh-ct-user-width: 620px;
  --dsh-ct-user-size: 14px;
  --dsh-ct-user-line: 22px;
  --dsh-ct-user-padding-y: 7px;
  --dsh-ct-user-padding-x: 12px;
  --dsh-ct-composer-radius: 16px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  div:has(> [data-conversation-scroll]) {
  --dsh-chat-content-width: var(--dsh-ct-content-width) !important;
  --dsh-composer-card-max-width: calc(var(--dsh-ct-content-width) + 32px) !important;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact']) [data-chat-flow] {
  gap: var(--dsh-ct-flow-gap) !important;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-conversation-scroll] :where(div):has(> [data-chat-flow]) {
  padding-block: 18px 26px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] > [data-slot='conversation.chat.node'] > div {
  font-size: var(--dsh-ct-font-size);
  line-height: var(--dsh-ct-line-height);
  letter-spacing: -0.004em;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] > [data-slot='conversation.chat.node'] > div > div:first-child {
  gap: var(--dsh-ct-block-gap);
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] :where(h1, h2, h3, h4, h5, h6) {
  margin-block: var(--dsh-ct-heading-top) var(--dsh-ct-heading-bottom);
  letter-spacing: -0.018em;
  text-wrap: pretty;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] h1 {
  font-size: var(--dsh-ct-h1-size);
  line-height: var(--dsh-ct-h1-line);
  font-weight: 650;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] h2 {
  font-size: var(--dsh-ct-h2-size);
  line-height: var(--dsh-ct-h2-line);
  font-weight: 650;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] h3 {
  font-size: var(--dsh-ct-h3-size);
  line-height: var(--dsh-ct-h3-line);
  font-weight: 650;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] :where(h4, h5, h6) {
  font-size: var(--dsh-ct-font-size);
  line-height: var(--dsh-ct-line-height);
  font-weight: 600;
  margin-block: calc(var(--dsh-ct-heading-top) * 0.75) var(--dsh-ct-heading-bottom);
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] p {
  margin-block: var(--dsh-ct-paragraph-gap);
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] :where(p, li, blockquote, th, td) {
  font-size: var(--dsh-ct-font-size);
  line-height: var(--dsh-ct-line-height);
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] :where(p, li) {
  text-wrap: pretty;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] :where(ul, ol) {
  margin-block: var(--dsh-ct-paragraph-gap);
  padding-inline-start: 20px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] li:not(:first-child) {
  margin-top: 3px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] li > p {
  margin-block: 4px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] blockquote {
  margin-block: var(--dsh-ct-paragraph-gap);
  padding-inline-start: 12px;
  border-inline-start-color: var(--dsw-alias-border-l3);
  color: var(--dsw-alias-label-secondary);
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] :where(pre, .md-code-block) {
  margin-block: 12px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] :not(pre) > code {
  border-radius: 5px;
  padding-inline: 4px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] hr {
  margin-block: 20px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='assistant-step'] :where(th, td) {
  padding-block: 8px;
  padding-inline: 12px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow] [data-disclosure-row] {
  height: 22px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow] [data-disclosure-row] > span {
  font-size: 13px;
  line-height: 22px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='user'] [data-time-hover-root] > div:first-child {
  max-width: min(var(--dsh-ct-user-width), 78%);
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
  [data-chat-flow-kind='user'] [data-time-hover-root] > div:first-child > div:not([data-align]) {
  padding: var(--dsh-ct-user-padding-y) var(--dsh-ct-user-padding-x);
  border-radius: 18px;
  font-size: var(--dsh-ct-user-size);
  line-height: var(--dsh-ct-user-line);
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact']) [data-turn-tail] {
  gap: 10px;
}

body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact']) [data-composer-card] {
  gap: 10px;
  padding-top: 8px;
  border-radius: var(--dsh-ct-composer-radius);
  font-size: var(--dsh-ct-font-size);
  line-height: var(--dsh-ct-line-height);
}

.dsh-chat-tidy-settings {
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  gap: 10px;
  padding: 16px 0;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-primary);
}

.dsh-chat-tidy-settings__copy {
  flex: none;
  min-width: 0;
}

.dsh-chat-tidy-settings__title {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.dsh-chat-tidy-settings__description {
  max-width: none;
  margin-top: 2px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.dsh-chat-tidy-settings__modes {
  box-sizing: border-box;
  display: inline-grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2px;
  width: 100%;
  padding: 3px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: var(--dsw-alias-bg-module-platform);
}

.dsh-chat-tidy-settings__mode {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 30px;
  padding: 4px 10px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
}

.dsh-chat-tidy-settings__mode:hover:not([data-selected]) {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.dsh-chat-tidy-settings__mode[data-selected] {
  background: var(--dsw-alias-bg-base);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 1px 3px color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent);
}

.dsh-chat-tidy-settings__mode:focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 1px;
}

.dsh-chat-tidy-settings__hint {
  color: var(--dsw-alias-state-business-primary);
  font-size: 10px;
  line-height: 14px;
}

@media (max-width: 700px) {
  body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact']) {
    --dsh-ct-content-width: 100%;
  }

  body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
    [data-chat-flow-kind='user'] [data-time-hover-root] > div:first-child {
    max-width: 88%;
  }

}

@media (max-width: 560px) {
  body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
    [role='dialog']:has(.dsh-chat-tidy-settings) {
    flex-direction: column;
  }

  body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
    [role='dialog']:has(.dsh-chat-tidy-settings) > nav {
    box-sizing: border-box;
    flex: none;
    width: 100%;
    padding: 14px 14px 8px;
    border-right: 0;
    border-bottom: 1px solid var(--dsw-alias-border-l2);
  }

  body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
    [role='dialog']:has(.dsh-chat-tidy-settings) > nav > :last-child {
    flex-direction: row;
    gap: 4px;
    overflow-x: auto;
    padding-bottom: 2px;
    scrollbar-width: thin;
  }

  body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
    [role='dialog']:has(.dsh-chat-tidy-settings) > nav > :last-child > * {
    flex: none;
  }

  body:is([data-dsh-chat-tidy='balanced'], [data-dsh-chat-tidy='compact'])
    [role='dialog']:has(.dsh-chat-tidy-settings) > :not(nav) {
    width: 100%;
    min-width: 0;
    min-height: 0;
  }

  .dsh-chat-tidy-settings__modes {
    grid-template-columns: 1fr;
  }

  .dsh-chat-tidy-settings__mode {
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dsh-chat-tidy-settings__mode {
    transition: none;
  }
}
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
