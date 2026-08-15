import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apply, name } from '../src/client/index.ts'
import { TidyChatRow } from '../src/client/TidyChatRow.tsx'
import { MODE_ATTRIBUTE } from '../src/client/controller.ts'
import { NS } from '../src/client/locales.ts'
import { STYLE_MARKER } from '../src/client/styles.ts'

type ClientContext = Parameters<typeof apply>[0]
type Entry = {
  options: {
    name: string
    id: string
    order: number
    locale: string
    inject: () => object
  }
  component: unknown
}

function mountClient() {
  const disposers: Array<() => void> = []
  const entries: Entry[] = []
  const unregisterLocale = vi.fn()
  const unregisterSlot = vi.fn()
  const registerLocale = vi.fn(() => unregisterLocale)

  const context: ClientContext = {
    effect(factory) {
      const disposer = factory()
      if (typeof disposer === 'function') disposers.push(disposer)
    },
    locale: { register: registerLocale },
    slots: {
      inject(_slotName, mount) {
        disposers.push(mount())
      },
      register(options, component) {
        entries.push({ options, component })
        return unregisterSlot
      },
    },
  }

  return {
    entries,
    registerLocale,
    unregisterLocale,
    unregisterSlot,
    dispose: () => {
      for (const disposer of disposers.reverse()) disposer()
    },
    context,
  }
}

describe('Tidy Chat client lifecycle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.body.removeAttribute(MODE_ATTRIBUTE)
  })

  afterEach(() => {
    document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`).forEach(element => { element.remove() })
    window.localStorage.clear()
    document.body.removeAttribute(MODE_ATTRIBUTE)
  })

  it('exports the loader name and mounts one scoped Settings contribution', () => {
    const mounted = mountClient()
    apply(mounted.context)

    expect(name).toBe('dsh-chat-tidy')
    expect(document.body.getAttribute(MODE_ATTRIBUTE)).toBe('balanced')
    expect(document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`)).toHaveLength(1)
    expect(mounted.registerLocale).toHaveBeenCalledWith(NS, expect.objectContaining({ zh: expect.any(Object), en: expect.any(Object) }))
    expect(mounted.entries).toHaveLength(1)
    expect(mounted.entries[0]?.options).toMatchObject({
      name: 'settings.general.item',
      id: 'dsh-chat-tidy',
      order: 25,
      locale: NS,
    })
    expect(mounted.entries[0]?.component).toBe(TidyChatRow)
    expect(mounted.entries[0]?.options.inject()).toMatchObject({
      getMode: expect.any(Function),
      setMode: expect.any(Function),
      subscribe: expect.any(Function),
    })

    mounted.dispose()
    expect(mounted.unregisterLocale).toHaveBeenCalledTimes(1)
    expect(mounted.unregisterSlot).toHaveBeenCalledTimes(1)
    expect(document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`)).toHaveLength(0)
    expect(document.body.hasAttribute(MODE_ATTRIBUTE)).toBe(false)
  })
})
