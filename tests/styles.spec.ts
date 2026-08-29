import { afterEach, describe, expect, it } from 'vitest'
import { adoptStyles, TIDY_CHAT_CSS, STYLE_MARKER, TIDY_TABLE_SHELL_SELECTOR } from '../src/client/styles.ts'

describe('Tidy Chat stylesheet', () => {
  afterEach(() => {
    document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`).forEach(element => { element.remove() })
    document.body.replaceChildren()
  })

  it('targets stable DSH anchors and carries no mode gate', () => {
    expect(TIDY_CHAT_CSS).toContain("[data-chat-flow-kind='assistant-step']")
    expect(TIDY_CHAT_CSS).toContain(':where(p, li, blockquote, th, td)')
    expect(TIDY_CHAT_CSS).toContain('[data-composer-card]')
    expect(TIDY_CHAT_CSS).toContain('var(--dsw-alias-label-secondary)')
    expect(TIDY_CHAT_CSS).not.toContain('data-dsh-chat-tidy')
    expect(TIDY_CHAT_CSS).not.toMatch(/(?:^|\n)\s*\.markdown\s/u)
  })

  it('turns a rendered Markdown table into a theme-owned component', () => {
    expect(TIDY_CHAT_CSS).toContain('border-radius: var(--dsh-ct-table-radius)')
    expect(TIDY_CHAT_CSS).toContain('background: var(--dsw-alias-markdown-code-block-banner)')
    expect(TIDY_CHAT_CSS).toContain('border-inline-end: 1px solid var(--dsw-alias-border-l2)')
    expect(TIDY_CHAT_CSS).toContain('min-width: 100%')
    expect(TIDY_CHAT_CSS).toContain('overflow-x: auto')
    expect(TIDY_CHAT_CSS).not.toContain('tableScroll')
  })

  it('finds the table shell without depending on its generated class', () => {
    document.body.innerHTML = `
      <section data-chat-flow-kind="assistant-step">
        <div data-slot="conversation.chat.node">
          <div><div class="_tableScroll_first"><table><tbody><tr><td>Cell</td></tr></tbody></table></div></div>
        </div>
      </section>
    `
    const shell = document.querySelector(TIDY_TABLE_SHELL_SELECTOR)

    expect(shell).not.toBeNull()
    shell?.setAttribute('class', '_tableScroll_changed')
    expect(document.querySelector(TIDY_TABLE_SHELL_SELECTOR)).toBe(shell)
  })

  it('every conversation rule outranks the CSS-module defaults', () => {
    const selectors = TIDY_CHAT_CSS.split('\n')
      .filter(line => line.includes('[data-'))
      .map(line => line.trim())

    expect(selectors.length).toBeGreaterThan(0)
    for (const selector of selectors) expect(selector.startsWith('body ')).toBe(true)
  })

  it('reference-counts one stylesheet per document', () => {
    const releaseFirst = adoptStyles(document)
    const releaseSecond = adoptStyles(document)

    expect(document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`)).toHaveLength(1)
    releaseFirst()
    expect(document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`)).toHaveLength(1)
    releaseSecond()
    expect(document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`)).toHaveLength(0)
  })
})
