/** Process controls inherit Harness colors and Codex's measured activity rhythm. */
export const PROCESS_CSS = String.raw`
body [data-ct-hidden] {
  display: none !important;
}

body [data-chat-flow] [data-ct-owned] {
  min-width: 0;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 13px;
  line-height: 22px;
}

body [data-chat-flow] [data-ct-owned='turn'] {
  margin-block: 12px 4px;
  padding-block-end: 14px;
  border-bottom: 1px solid var(--dsw-alias-border-l2);
}

body [data-chat-flow] [data-ct-owned] > button {
  appearance: none;
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  max-width: 100%;
  margin: 0;
  padding: 2px 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: start;
  cursor: pointer;
}

body [data-chat-flow] [data-ct-owned] > button:disabled {
  opacity: 1;
  cursor: default;
}

body [data-chat-flow] [data-ct-owned] > button:not(:disabled):hover {
  color: var(--dsw-alias-label-primary);
}

body [data-chat-flow] [data-ct-owned] > button:focus-visible {
  outline: 2px solid var(--dsw-alias-label-primary);
  outline-offset: 4px;
  border-radius: 4px;
}

body [data-chat-flow] [data-ct-chevron] {
  display: inline-block;
  flex-shrink: 0;
  font-size: 18px;
  transition: transform 150ms ease;
}

body [data-chat-flow] [data-ct-chevron][hidden] {
  display: none;
}

body [data-chat-flow] [data-ct-owned] > button[aria-expanded='true'] [data-ct-chevron] {
  transform: rotate(90deg);
}

@media (prefers-reduced-motion: reduce) {
  body [data-chat-flow] [data-ct-chevron] { transition: none; }
}
`
