# Changelog

All notable changes to this project are documented here.

## 0.2.0 - 2026-08-15

### Changed

- Retargeted every metric to values measured from the Codex desktop client: body 14 / 22 px, headings 24 / 20 / 17 / 17 / 15 / 15 px at weight 600, heading margins 20 px / 10 px, block rhythm 11 px, list indent 21 px, table cells 14 / 22 px.
- Kept the reading column at DSH's 748 px default, since Codex measures ≈730 px.
- Reversed two over-tightenings from 0.1.0: list item gap 3 px → 8 px, `hr` margin 20 px → 28 px.
- Replaced the blockquote border with Codex's rounded 4 px bar.
- Scoped every rule with a leading `body` type selector instead of a plugin-owned body attribute.

### Removed

- The Balanced / Compact / Original mode switch, its Settings row, its locale namespace, its `localStorage` persistence, and its cross-tab listener. Disabling the plugin is the off switch.
- The React dependency; the client bundle is now a stylesheet only.

### Documentation

- Added seven before/after captures under `docs/images/`, all taken from one seeded session in the real assembled Web app where the only difference between panes is this stylesheet: the applied page, the same viewport side by side, full reply height, the heading ladder with its computed styles, the blockquote bar and table cells at 1:1, the built-in dark theme, and a 700 px viewport.
- Recorded the measured effect on vertical space: the same reply renders 1411 px tall by default and 1127 px with Tidy Chat.

## 0.1.0 - 2026-08-15

### Added

- Balanced, Compact, and Original chat-presentation modes.
- Scoped typography, spacing, content-width, user-bubble, activity-row, and composer refinements.
- A localized Settings → General selector with browser-local persistence and cross-tab synchronization.
- Full lifecycle cleanup, responsive layout, reduced-motion behavior, automated tests, and CI.
- Verified prebuilt `lib/` bundles so GitHub installs need no dependency build approval.
