import { afterEach, describe, expect, it } from 'vitest'
import { adoptStyles, TIDY_CHAT_CSS, STYLE_MARKER } from '../src/client/styles.ts'

describe('Tidy Chat stylesheet', () => {
  afterEach(() => {
    document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`).forEach(element => { element.remove() })
  })

  it('scopes conversation changes to the active mode and stable DSH anchors', () => {
    expect(TIDY_CHAT_CSS).toContain("body[data-dsh-chat-tidy='balanced']")
    expect(TIDY_CHAT_CSS).toContain("[data-chat-flow-kind='assistant-step']")
    expect(TIDY_CHAT_CSS).toContain(':where(p, li, blockquote, th, td)')
    expect(TIDY_CHAT_CSS).toContain('[data-composer-card]')
    expect(TIDY_CHAT_CSS).toContain("[role='dialog']:has(.dsh-chat-tidy-settings)")
    expect(TIDY_CHAT_CSS).toContain('var(--dsw-alias-label-primary)')
    expect(TIDY_CHAT_CSS).not.toMatch(/(?:^|\n)\s*\.markdown\s/u)
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
