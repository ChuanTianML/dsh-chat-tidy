import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TidyChatController, MODE_ATTRIBUTE } from '../src/client/controller.ts'
import { STORAGE_KEY } from '../src/client/preferences.ts'

describe('TidyChatController', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.body.removeAttribute(MODE_ATTRIBUTE)
  })

  afterEach(() => {
    window.localStorage.clear()
    document.body.removeAttribute(MODE_ATTRIBUTE)
  })

  it('applies the default, persists selection, and notifies subscribers', () => {
    const controller = new TidyChatController(document, window.localStorage, window)
    const listener = vi.fn()
    const unsubscribe = controller.subscribe(listener)

    expect(controller.getMode()).toBe('balanced')
    expect(document.body.getAttribute(MODE_ATTRIBUTE)).toBe('balanced')

    controller.setMode('compact')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('compact')
    expect(document.body.getAttribute(MODE_ATTRIBUTE)).toBe('compact')
    expect(listener).toHaveBeenCalledTimes(1)

    controller.setMode('compact')
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    controller.dispose()
    expect(document.body.hasAttribute(MODE_ATTRIBUTE)).toBe(false)
  })

  it('follows cross-tab storage events and restores an existing marker', () => {
    document.body.setAttribute(MODE_ATTRIBUTE, 'host-value')
    const controller = new TidyChatController(document, window.localStorage, window)
    const listener = vi.fn()
    controller.subscribe(listener)

    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: 'original',
    }))

    expect(controller.getMode()).toBe('original')
    expect(document.body.getAttribute(MODE_ATTRIBUTE)).toBe('original')
    expect(listener).toHaveBeenCalledTimes(1)

    controller.dispose()
    expect(document.body.getAttribute(MODE_ATTRIBUTE)).toBe('host-value')
  })
})
