import { afterEach, describe, expect, it } from 'vitest'
import { adoptStyles, TIDY_CHAT_CSS, STYLE_MARKER } from '../src/client/styles.ts'

describe('Tidy Chat stylesheet', () => {
  afterEach(() => {
    document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`).forEach(element => { element.remove() })
  })

  it('targets stable DSH anchors and carries no mode gate', () => {
    expect(TIDY_CHAT_CSS).toContain("[data-chat-flow-kind='assistant-step']")
    expect(TIDY_CHAT_CSS).toContain(':where(p, li, blockquote, th, td)')
    expect(TIDY_CHAT_CSS).toContain('[data-composer-card]')
    expect(TIDY_CHAT_CSS).toContain('var(--dsw-alias-label-secondary)')
    expect(TIDY_CHAT_CSS).not.toContain('data-dsh-chat-tidy')
    expect(TIDY_CHAT_CSS).not.toMatch(/(?:^|\n)\s*\.markdown\s/u)
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
