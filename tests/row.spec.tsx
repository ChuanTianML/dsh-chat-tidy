import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { TidyChatRow } from '../src/client/TidyChatRow.tsx'
import { TidyChatController, MODE_ATTRIBUTE } from '../src/client/controller.ts'
import { zh } from '../src/client/locales.ts'
import { STORAGE_KEY } from '../src/client/preferences.ts'

const dictionary: Record<string, string> = zh

describe('TidyChatRow', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.body.removeAttribute(MODE_ATTRIBUTE)
  })

  afterEach(() => {
    window.localStorage.clear()
    document.body.removeAttribute(MODE_ATTRIBUTE)
  })

  it('renders an accessible three-mode selector and updates the live document', () => {
    const controller = new TidyChatController(document, window.localStorage, window)
    render(<TidyChatRow
      t={key => dictionary[key] ?? key}
      getMode={controller.getMode}
      setMode={controller.setMode}
      subscribe={controller.subscribe}
    />)

    const group = screen.getByRole('group', { name: '聊天排版模式' })
    expect(group.querySelectorAll('button')).toHaveLength(3)
    expect(screen.getByRole('button', { name: /平衡/u }).getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: '紧凑' }))
    expect(document.body.getAttribute(MODE_ATTRIBUTE)).toBe('compact')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('compact')
    expect(screen.getByRole('button', { name: '紧凑' }).getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: '原始' }))
    expect(document.body.getAttribute(MODE_ATTRIBUTE)).toBe('original')
    controller.dispose()
  })
})
