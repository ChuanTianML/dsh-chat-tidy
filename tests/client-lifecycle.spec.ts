import { afterEach, describe, expect, it } from 'vitest'
import { apply, name } from '../src/client/index.ts'
import { STYLE_MARKER } from '../src/client/styles.ts'

type ClientContext = Parameters<typeof apply>[0]

function mountClient() {
  const disposers: Array<() => void> = []

  const context: ClientContext = {
    effect(factory) {
      const disposer = factory()
      if (typeof disposer === 'function') disposers.push(disposer)
    },
  }

  return {
    dispose: () => {
      for (const disposer of disposers.reverse()) disposer()
    },
    context,
  }
}

describe('Tidy Chat client lifecycle', () => {
  afterEach(() => {
    document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`).forEach(element => { element.remove() })
  })

  it('mounts one stylesheet and removes it on disposal', () => {
    const mounted = mountClient()
    apply(mounted.context)

    expect(name).toBe('dsh-chat-tidy')
    expect(document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`)).toHaveLength(1)

    mounted.dispose()
    expect(document.head.querySelectorAll(`[data-plugin='${STYLE_MARKER}']`)).toHaveLength(0)
  })
})
