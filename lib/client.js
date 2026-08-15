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
  CHAT_MODES: () => CHAT_MODES,
  DEFAULT_MODE: () => DEFAULT_MODE,
  MODE_ATTRIBUTE: () => MODE_ATTRIBUTE,
  STORAGE_KEY: () => STORAGE_KEY,
  STYLE_MARKER: () => STYLE_MARKER,
  TIDY_CHAT_CSS: () => TIDY_CHAT_CSS,
  TidyChatController: () => TidyChatController,
  TidyChatRow: () => TidyChatRow,
  adoptStyles: () => adoptStyles,
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(index_exports);

// src/client/TidyChatRow.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var OPTIONS = [
  { id: "balanced", label: "mode.balanced" },
  { id: "compact", label: "mode.compact" },
  { id: "original", label: "mode.original" }
];
function TidyChatRow({ t, getMode, setMode, subscribe }) {
  const mode = (0, import_react.useSyncExternalStore)(subscribe, getMode, getMode);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-chat-tidy-settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dsh-chat-tidy-settings__copy", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-chat-tidy-settings__title", children: t("settings.title") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dsh-chat-tidy-settings__description", children: t("settings.description") })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "dsh-chat-tidy-settings__modes",
        role: "group",
        "aria-label": t("settings.groupLabel"),
        children: OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            className: "dsh-chat-tidy-settings__mode",
            "data-selected": mode === option.id || void 0,
            "aria-pressed": mode === option.id,
            onClick: () => {
              setMode(option.id);
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(option.label) }),
              option.id === "balanced" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dsh-chat-tidy-settings__hint", children: t("mode.balanced.hint") })
            ]
          },
          option.id
        ))
      }
    )
  ] });
}

// src/client/preferences.ts
var STORAGE_KEY = "dsh-chat-tidy:mode";
var CHAT_MODES = ["balanced", "compact", "original"];
var DEFAULT_MODE = "balanced";
function resolveMode(value) {
  return CHAT_MODES.includes(value) ? value : DEFAULT_MODE;
}
function readMode(storage) {
  try {
    return resolveMode(storage.getItem(STORAGE_KEY));
  } catch {
    return DEFAULT_MODE;
  }
}
function writeMode(storage, mode) {
  try {
    storage.setItem(STORAGE_KEY, mode);
  } catch {
  }
}

// src/client/controller.ts
var MODE_ATTRIBUTE = "data-dsh-chat-tidy";
var TidyChatController = class {
  constructor(document2, storage, browser) {
    this.document = document2;
    this.storage = storage;
    this.browser = browser;
    this.previousAttribute = document2.body.getAttribute(MODE_ATTRIBUTE);
    this.mode = readMode(storage);
    this.applyMode();
    browser.addEventListener("storage", this.onStorage);
  }
  listeners = /* @__PURE__ */ new Set();
  previousAttribute;
  mode;
  /** @returns The current mode. */
  getMode = () => this.mode;
  /**
   * Select and persist a presentation mode.
   * @param mode - Supported mode selected in Settings.
   */
  setMode = (mode) => {
    if (mode === this.mode) return;
    this.mode = mode;
    writeMode(this.storage, mode);
    this.applyMode();
    this.emit();
  };
  /**
   * Subscribe to preference changes.
   * @param listener - React external-store listener.
   * @returns Subscription disposer.
   */
  subscribe = (listener) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  /** Remove browser listeners and restore the pre-plugin body marker. */
  dispose() {
    this.browser.removeEventListener("storage", this.onStorage);
    if (this.previousAttribute === null) this.document.body.removeAttribute(MODE_ATTRIBUTE);
    else this.document.body.setAttribute(MODE_ATTRIBUTE, this.previousAttribute);
    this.listeners.clear();
  }
  onStorage = (event) => {
    const storageEvent = event;
    if (storageEvent.key !== STORAGE_KEY) return;
    const next = resolveMode(storageEvent.newValue);
    if (next === this.mode) return;
    this.mode = next;
    this.applyMode();
    this.emit();
  };
  applyMode() {
    this.document.body.setAttribute(MODE_ATTRIBUTE, this.mode);
  }
  emit() {
    for (const listener of this.listeners) listener();
  }
};

// src/client/locales.ts
var NS = "dsh-chat-tidy";
var en = {
  "settings.title": "Chat typography",
  "settings.description": "Refine message width, type scale, and vertical rhythm without hiding agent activity.",
  "settings.groupLabel": "Chat typography mode",
  "mode.balanced": "Balanced",
  "mode.compact": "Compact",
  "mode.original": "Original",
  "mode.balanced.hint": "Recommended"
};
var zh = {
  "settings.title": "\u804A\u5929\u6392\u7248",
  "settings.description": "\u7EDF\u4E00\u6D88\u606F\u5BBD\u5EA6\u3001\u5B57\u53F7\u5C42\u7EA7\u4E0E\u5782\u76F4\u8282\u594F\uFF0C\u4E0D\u9690\u85CF Agent \u6D3B\u52A8\u4FE1\u606F\u3002",
  "settings.groupLabel": "\u804A\u5929\u6392\u7248\u6A21\u5F0F",
  "mode.balanced": "\u5E73\u8861",
  "mode.compact": "\u7D27\u51D1",
  "mode.original": "\u539F\u59CB",
  "mode.balanced.hint": "\u63A8\u8350"
};

// src/client/styles.ts
var STYLE_MARKER = "dsh-chat-tidy";
var TIDY_CHAT_CSS = String.raw`
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
var inject = ["slots", "locale"];
function apply(ctx) {
  ctx.effect(() => adoptStyles(document), "dsh-chat-tidy: stylesheet");
  const controller = new TidyChatController(document, window.localStorage, window);
  ctx.effect(() => () => {
    controller.dispose();
  }, "dsh-chat-tidy: preference controller");
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-chat-tidy: dictionaries");
  ctx.slots.inject("settings.general.item", () => ctx.slots.register({
    name: "settings.general.item",
    id: "dsh-chat-tidy",
    order: 25,
    locale: NS,
    inject: () => ({
      getMode: controller.getMode,
      setMode: controller.setMode,
      subscribe: controller.subscribe
    })
  }, TidyChatRow));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
