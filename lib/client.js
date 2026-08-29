window.__ModuleLoader__.load({ id: 'dsh-chat-tidy', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.ts
var index_exports = {};
__export(index_exports, {
  STYLE_MARKER: () => STYLE_MARKER,
  TIDY_CHAT_CSS: () => TIDY_CHAT_CSS,
  adoptStyles: () => adoptStyles,
  apply: () => apply,
  name: () => name
});
module.exports = __toCommonJS(index_exports);

// src/client/styles.ts
var STYLE_MARKER = "dsh-chat-tidy";
var TIDY_TABLE_SHELL_SELECTOR = "body [data-chat-flow-kind='assistant-step'] [data-slot='conversation.chat.node'] :where(div):has(> table)";
var TIDY_CHAT_CSS = String.raw`
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
`;
var records = /* @__PURE__ */ new WeakMap();
function adoptStyles(document2) {
  const current = records.get(document2);
  if (current !== void 0) {
    current.references += 1;
    return () => {
      releaseStyles(document2);
    };
  }
  const element = document2.createElement("style");
  element.dataset.plugin = STYLE_MARKER;
  element.textContent = TIDY_CHAT_CSS;
  document2.head.appendChild(element);
  records.set(document2, { element, references: 1 });
  return () => {
    releaseStyles(document2);
  };
}
function releaseStyles(document2) {
  const record = records.get(document2);
  if (record === void 0) return;
  record.references -= 1;
  if (record.references > 0) return;
  record.element.remove();
  records.delete(document2);
}

// src/client/index.ts
var name = "dsh-chat-tidy";
function apply(ctx) {
  ctx.effect(() => adoptStyles(document), "dsh-chat-tidy: stylesheet");
}
return module.exports; } });
//# sourceMappingURL=client.js.map
