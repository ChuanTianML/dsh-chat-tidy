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
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(index_exports);

// src/client/process-styles.ts
var PROCESS_CSS = String.raw`
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
`;

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
${PROCESS_CSS}
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
  const record2 = records.get(document2);
  if (record2 === void 0) return;
  record2.references -= 1;
  if (record2.references > 0) return;
  record2.element.remove();
  records.delete(document2);
}

// src/client/bridge.tsx
var import_react = require("react");

// src/client/model.ts
function record(value) {
  return value !== null && typeof value === "object" ? value : void 0;
}
var PASSIVE_TOOLS = /* @__PURE__ */ new Set(["bash", "pwsh", "read", "write", "edit", "glob", "grep", "web_search", "web_fetch"]);
function passiveTool(value) {
  const root = record(value);
  if (root === void 0 || root.isError === true) return null;
  const name2 = root.kind === "tool-result" ? record(root.call)?.name : root.name;
  if (typeof name2 !== "string" || !PASSIVE_TOOLS.has(name2) || !Array.isArray(root.subCalls)) return null;
  const names = [name2];
  for (const child of root.subCalls) {
    const childNames = passiveTool(child);
    if (childNames === null) return null;
    names.push(...childNames);
  }
  return names;
}
function project(snapshot) {
  const byTurn = /* @__PURE__ */ new Map();
  for (const key of snapshot.chat.order) {
    const node = snapshot.chat.nodes.get(key);
    if (node?.location.turn === void 0) continue;
    const id = node.location.turn.turn;
    const list = byTurn.get(id) ?? [];
    list.push(node);
    byTurn.set(id, list);
  }
  const plans = [];
  for (const turn of snapshot.chat.timeline.turns.values()) {
    const nodes = byTurn.get(turn.turn) ?? [];
    const active = turn.status === "open" && snapshot.running;
    const waiting = turn.status === "open" && snapshot.pending.length > 0;
    const reason = turn.end?.data.reason.kind;
    const tail = record(turn.data.get("turn-tail"));
    const closing = record(record(tail?.closing)?.finalNode)?.seq;
    const completed = reason === "completed" && turn.status === "closed";
    const fold = [];
    const groups = [];
    let addresses = [];
    let tools = [];
    let thoughts = 0;
    let hasFinal = false;
    const flush = () => {
      const first = addresses[0];
      if (first !== void 0) groups.push({
        id: `${turn.turn}:${first.key}:${first.reasoning ?? 0}`,
        addresses,
        tools,
        thoughts
      });
      addresses = [];
      tools = [];
      thoughts = 0;
    };
    for (const node of nodes) {
      const data = record(node.data);
      if (node.kind === "tool-call" && !waiting) {
        const names = passiveTool(data?.root);
        if (names !== null) {
          const address = { key: node.key };
          addresses.push(address);
          tools.push(...names);
          fold.push(address);
          continue;
        }
      }
      if (node.kind !== "assistant-step" || data?.status === "interrupted" || !Array.isArray(data?.blocks)) {
        flush();
        continue;
      }
      const blocks = data.blocks.map(record);
      if (blocks.some((block) => block === void 0 || !["text", "reasoning", "tool-call"].includes(String(block.kind)))) {
        flush();
        continue;
      }
      const hasText = blocks.some((block) => block?.kind === "text" && typeof block.text === "string" && block.text.trim() !== "");
      const isFinal = completed && closing !== void 0 && record(data.finalNode)?.seq === closing && hasText;
      hasFinal ||= isFinal;
      const reasonings = blocks.filter((block) => block?.kind === "reasoning");
      if (!hasText) {
        if (reasonings.length > 0) {
          const address = { key: node.key };
          addresses.push(address);
          thoughts += reasonings.length;
          fold.push(address);
        }
        continue;
      }
      if (!isFinal && completed) fold.push({ key: node.key });
      let index = 0;
      for (const block of blocks) {
        if (block?.kind === "text") {
          if (typeof block.text === "string" && block.text.trim() !== "") flush();
          continue;
        }
        if (block?.kind !== "reasoning") continue;
        const address = { key: node.key, reasoning: index++ };
        addresses.push(address);
        thoughts += 1;
        fold.push(address);
      }
    }
    flush();
    if (fold.length === 0 && !active && !waiting) continue;
    plans.push({
      id: turn.turn,
      firstKey: nodes.find((node) => !["user", "turn-tail"].includes(node.kind))?.key,
      start: turn.start?.time,
      end: turn.end?.time,
      state: waiting ? "waiting" : active ? "working" : completed ? "worked" : reason === "error" ? "failed" : reason !== void 0 ? "stopped" : "details",
      autoCollapse: completed && hasFinal && turn.start !== void 0,
      fold,
      groups
    });
  }
  return plans;
}
function duration(start, end) {
  if (start === void 0 || end === void 0 || !Number.isFinite(start) || !Number.isFinite(end)) return null;
  const seconds = Math.floor(Math.max(0, end - start) / 1e3);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m${seconds % 60 ? ` ${seconds % 60}s` : ""}`;
}

// src/client/locales.ts
var en = {
  working: "Working",
  waiting: "Waiting for you",
  worked: "Worked",
  stopped: "Stopped",
  failed: "Failed",
  details: "Work details",
  elapsed: "{state} for {duration}",
  ended: "{state} after {duration}",
  timed: "{state} \xB7 {duration}",
  thoughts: "thought",
  command: "ran a command",
  file: "worked with a file",
  search: "performed a search",
  webOnce: "used the web",
  commands: "ran {count} commands",
  files: "worked with {count} files",
  searches: "performed {count} searches",
  web: "used the web {count} times",
  separator: ", ",
  join: " and ",
  show: "Show work details",
  hide: "Hide work details",
  showActivity: "Show activity",
  hideActivity: "Hide activity"
};
var zh = {
  working: "\u5DE5\u4F5C\u4E2D",
  waiting: "\u7B49\u5F85\u4F60\u7684\u64CD\u4F5C",
  worked: "\u5DF2\u5B8C\u6210",
  stopped: "\u5DF2\u505C\u6B62",
  failed: "\u53D1\u751F\u9519\u8BEF",
  details: "\u5DE5\u4F5C\u8FC7\u7A0B",
  elapsed: "{state} \xB7 {duration}",
  ended: "{state} \xB7 {duration}",
  timed: "{state} \xB7 {duration}",
  thoughts: "\u601D\u8003",
  command: "\u8FD0\u884C\u4E86 1 \u6761\u547D\u4EE4",
  file: "\u5904\u7406\u4E86 1 \u4E2A\u6587\u4EF6\u64CD\u4F5C",
  search: "\u8FDB\u884C\u4E86 1 \u6B21\u641C\u7D22",
  webOnce: "\u4F7F\u7528\u4E86\u7F51\u9875\u5DE5\u5177",
  commands: "\u8FD0\u884C\u4E86 {count} \u6761\u547D\u4EE4",
  files: "\u5904\u7406\u4E86 {count} \u4E2A\u6587\u4EF6\u64CD\u4F5C",
  searches: "\u8FDB\u884C\u4E86 {count} \u6B21\u641C\u7D22",
  web: "\u4F7F\u7528\u4E86 {count} \u6B21\u7F51\u9875\u5DE5\u5177",
  separator: "\u3001",
  join: "\uFF0C",
  show: "\u5C55\u5F00\u5DE5\u4F5C\u8FC7\u7A0B",
  hide: "\u6536\u8D77\u5DE5\u4F5C\u8FC7\u7A0B",
  showActivity: "\u5C55\u5F00\u6D3B\u52A8\u8BE6\u60C5",
  hideActivity: "\u6536\u8D77\u6D3B\u52A8\u8BE6\u60C5"
};
function activityLabel(thoughts, tools, t) {
  const categories = /* @__PURE__ */ new Map();
  for (const tool of tools) {
    const category = tool === "bash" || tool === "pwsh" ? "commands" : tool === "glob" || tool === "grep" ? "searches" : tool === "web_search" || tool === "web_fetch" ? "web" : "files";
    categories.set(category, (categories.get(category) ?? 0) + 1);
  }
  const singular = { commands: "command", files: "file", searches: "search", web: "webOnce" };
  const labels = [...categories].map(([key, count]) => t(count === 1 ? singular[key] : key, { count }));
  if (thoughts > 0) labels.unshift(t("thoughts"));
  const label = labels.join(t("join"));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

// src/client/disclosure.ts
var instance = 0;
var Disclosure = class {
  constructor(root, choices, t) {
    this.root = root;
    this.choices = choices;
    this.t = t;
    this.observer = new MutationObserver((records2) => {
      if (records2.some((record2) => {
        const target = record2.target instanceof Element ? record2.target : record2.target.parentElement;
        if (target?.closest("[data-ct-owned]")) return false;
        return [...record2.addedNodes, ...record2.removedNodes].some((node) => !(node instanceof Element && node.hasAttribute("data-ct-owned")));
      })) this.schedule();
    });
    this.observer.observe(root, { subtree: true, childList: true });
    for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) root.addEventListener(event, this.cancelRestore, { passive: true });
  }
  controls = /* @__PURE__ */ new Map();
  hidden = /* @__PURE__ */ new Set();
  ids = /* @__PURE__ */ new Map();
  observer;
  plans = [];
  scheduled = false;
  disposed = false;
  timer;
  prefix = `dsh-ct-${++instance}`;
  nextId = 0;
  restoreFrame;
  cancelRestore = () => {
    if (this.restoreFrame !== void 0) this.root.ownerDocument.defaultView?.cancelAnimationFrame(this.restoreFrame);
    this.restoreFrame = void 0;
  };
  /** Update the projection and locale without replacing native row instances. */
  update(plans, t) {
    this.plans = plans;
    this.t = t;
    const ticking = plans.some((plan) => plan.state === "working" || plan.state === "waiting");
    if (ticking && this.timer === void 0) this.timer = setInterval(() => this.tick(), 1e3);
    if (!ticking && this.timer !== void 0) {
      clearInterval(this.timer);
      this.timer = void 0;
    }
    this.render();
  }
  /** Restore all visibility and remove plugin controls, observers and timers. */
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.observer.disconnect();
    this.cancelRestore();
    for (const event of ["wheel", "touchstart", "pointerdown", "keydown"]) this.root.removeEventListener(event, this.cancelRestore);
    if (this.timer !== void 0) clearInterval(this.timer);
    for (const element of this.hidden) element.removeAttribute("data-ct-hidden");
    for (const [element, id] of this.ids) if (element.id === id) element.removeAttribute("id");
    for (const control of this.controls.values()) control.element.remove();
    this.hidden.clear();
    this.ids.clear();
    this.controls.clear();
  }
  schedule() {
    if (this.scheduled || this.disposed) return;
    this.scheduled = true;
    queueMicrotask(() => {
      this.scheduled = false;
      if (!this.disposed) this.render();
    });
  }
  label(plan) {
    const end = plan.state === "working" || plan.state === "waiting" ? Date.now() : plan.end;
    const elapsed = duration(plan.start, end);
    const state = this.t(plan.state);
    const format = plan.state === "failed" || plan.state === "stopped" ? "ended" : plan.state === "waiting" || plan.state === "details" ? "timed" : "elapsed";
    return elapsed === null ? state : this.t(format, { state, duration: elapsed });
  }
  tick() {
    for (const plan of this.plans) {
      if (plan.state !== "working" && plan.state !== "waiting") continue;
      const control = this.controls.get(`turn:${plan.id}`);
      if (control !== void 0) control.label.textContent = this.label(plan);
    }
  }
  makeControl(key, kind, toggle) {
    const previous = this.controls.get(key);
    if (previous !== void 0) return previous;
    const doc = this.root.ownerDocument;
    const element = doc.createElement("div");
    element.dataset.ctOwned = kind;
    const button = doc.createElement("button");
    button.type = "button";
    const label = doc.createElement("span");
    const chevron = doc.createElement("span");
    chevron.dataset.ctChevron = "";
    chevron.setAttribute("aria-hidden", "true");
    chevron.textContent = "\u203A";
    button.append(label, chevron);
    button.addEventListener("click", toggle);
    element.append(button);
    const control = { element, button, label, chevron };
    this.controls.set(key, control);
    return control;
  }
  controlledId(element) {
    if (element.id) return element.id;
    const id = `${this.prefix}-${++this.nextId}`;
    element.id = id;
    this.ids.set(element, id);
    return id;
  }
  togglePreservingPosition(control, change) {
    const scrollport = this.root.querySelector("[data-conversation-scroll]");
    const top = control.element.getBoundingClientRect().top;
    this.cancelRestore();
    change();
    this.render();
    if (scrollport === null) return;
    const restore = () => {
      if (!this.disposed && control.element.isConnected) scrollport.scrollTop += control.element.getBoundingClientRect().top - top;
    };
    restore();
    const view = this.root.ownerDocument.defaultView;
    if (view?.requestAnimationFrame !== void 0) {
      this.restoreFrame = view.requestAnimationFrame(() => {
        this.restoreFrame = view.requestAnimationFrame(() => {
          this.restoreFrame = void 0;
          restore();
        });
      });
    }
  }
  readerInside(elements) {
    const doc = this.root.ownerDocument;
    const selection = doc.getSelection();
    return elements.some((element) => doc.activeElement !== doc.body && element.contains(doc.activeElement) || selection !== null && !selection.isCollapsed && (element.contains(selection.anchorNode) || element.contains(selection.focusNode)));
  }
  render() {
    if (this.disposed) return;
    const flow = this.root.querySelector("[data-chat-flow]");
    const wanted = /* @__PURE__ */ new Set();
    const conceal = /* @__PURE__ */ new Set();
    if (flow !== null) {
      const rows = new Map([...flow.querySelectorAll("[data-chat-flow-key]")].map((element) => [element.dataset.chatFlowKey, element]));
      const resolve = (address) => {
        const row = rows.get(address.key);
        return address.reasoning === void 0 ? row : row?.querySelectorAll('[data-variant="think"]')[address.reasoning];
      };
      for (const plan of this.plans) {
        const fold = plan.fold.map(resolve).filter((element) => element !== void 0);
        const first = plan.firstKey === void 0 ? void 0 : rows.get(plan.firstKey);
        const active = plan.state === "working" || plan.state === "waiting";
        if (first === void 0 && !active) continue;
        const turnKey = `turn:${plan.id}`;
        const choice = this.choices.turns.get(plan.id);
        if (plan.autoCollapse && choice === void 0 && this.readerInside(fold)) this.choices.turns.set(plan.id, true);
        const expanded = this.choices.turns.get(plan.id) ?? !plan.autoCollapse;
        const collapsible = !active && fold.length > 0;
        const header = this.makeControl(turnKey, "turn", () => {
          const current = this.plans.find((item) => item.id === plan.id);
          if (current === void 0 || current.state === "working" || current.state === "waiting") return;
          this.togglePreservingPosition(header, () => {
            this.choices.turns.set(plan.id, !(this.choices.turns.get(plan.id) ?? !current.autoCollapse));
          });
        });
        wanted.add(turnKey);
        header.label.textContent = this.label(plan);
        header.element.dataset.ctState = plan.state;
        header.button.disabled = !collapsible;
        header.button.setAttribute("aria-label", `${this.t(plan.state)}${collapsible ? ` \u2014 ${this.t(expanded ? "hide" : "show")}` : ""}`);
        header.button.setAttribute("aria-expanded", String(expanded));
        header.button.setAttribute("aria-controls", fold.map((element) => this.controlledId(element)).join(" "));
        header.chevron.hidden = !collapsible;
        const beforeFirst = first?.previousElementSibling;
        const anchor = beforeFirst instanceof HTMLElement && beforeFirst.dataset.ctOwned === "group" ? beforeFirst : first ?? [...flow.children].find((element) => element.getAttribute("role") === "status") ?? null;
        if (header.element.nextElementSibling !== anchor || header.element.parentElement !== flow) flow.insertBefore(header.element, anchor);
        if (!expanded) for (const element of fold) conceal.add(element);
        for (const group of plan.groups) {
          const elements = group.addresses.map(resolve).filter((element) => element !== void 0);
          const anchor2 = elements[0];
          if (anchor2 === void 0 || elements.length !== group.addresses.length) continue;
          const groupKey = `group:${group.id}`;
          const open = this.choices.groups.get(group.id) ?? false;
          const control = this.makeControl(groupKey, "group", () => {
            this.togglePreservingPosition(control, () => {
              this.choices.groups.set(group.id, !(this.choices.groups.get(group.id) ?? false));
            });
          });
          wanted.add(groupKey);
          control.label.textContent = activityLabel(group.thoughts, group.tools, this.t);
          control.button.setAttribute("aria-label", `${control.label.textContent} \u2014 ${this.t(open ? "hideActivity" : "showActivity")}`);
          control.button.setAttribute("aria-expanded", String(open));
          control.button.setAttribute("aria-controls", elements.map((element) => this.controlledId(element)).join(" "));
          if (control.element.nextElementSibling !== anchor2) anchor2.before(control.element);
          if (!expanded) conceal.add(control.element);
          if (!open) for (const element of elements) conceal.add(element);
        }
      }
    }
    for (const element of this.hidden) if (!conceal.has(element)) element.removeAttribute("data-ct-hidden");
    for (const element of conceal) if (!this.hidden.has(element)) element.setAttribute("data-ct-hidden", "");
    this.hidden.clear();
    for (const element of conceal) this.hidden.add(element);
    for (const [key, control] of this.controls) {
      if (wanted.has(key)) continue;
      control.element.remove();
      this.controls.delete(key);
    }
    for (const [element, id] of this.ids) {
      if (this.root.contains(element)) continue;
      if (element.id === id) element.removeAttribute("id");
      this.ids.delete(element);
    }
  }
};

// src/client/bridge.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function Bridge({ useSession, sessionId, t, choices }) {
  const marker = (0, import_react.useRef)(null);
  const controller = (0, import_react.useRef)(null);
  const snapshot = useSession((value) => value);
  (0, import_react.useLayoutEffect)(() => {
    const root = marker.current?.closest('[data-slot="conversation.session.header"]')?.parentElement;
    if (root === null || root === void 0) return;
    const mounted = new Disclosure(root, choices, t);
    controller.current = mounted;
    return () => {
      mounted.dispose();
      controller.current = null;
    };
  }, [sessionId, choices]);
  (0, import_react.useLayoutEffect)(() => {
    controller.current?.update(project(snapshot), t);
  }, [snapshot, t]);
  (0, import_react.useEffect)(() => {
    controller.current?.update(project(snapshot), t);
  }, [sessionId]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { ref: marker, "data-ct-bridge": "", hidden: true });
}

// src/client/index.ts
var name = "dsh-chat-tidy";
var inject = ["slots", "locale"];
function apply(ctx) {
  const sessions = /* @__PURE__ */ new Map();
  ctx.effect(() => adoptStyles(document), "dsh-chat-tidy: stylesheet");
  ctx.effect(() => ctx.locale.register(name, { en, zh }), "dsh-chat-tidy: dictionaries");
  ctx.effect(() => () => {
    sessions.clear();
  }, "dsh-chat-tidy: reader choices");
  ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
    name: "conversation.session.header.utilities",
    id: name,
    order: 200,
    locale: name,
    inject: (sessionId) => {
      let choices = sessions.get(sessionId);
      if (choices === void 0) {
        choices = { turns: /* @__PURE__ */ new Map(), groups: /* @__PURE__ */ new Map() };
        sessions.set(sessionId, choices);
      }
      return { choices };
    }
  }, Bridge));
}
return module.exports; } });
//# sourceMappingURL=client.js.map
