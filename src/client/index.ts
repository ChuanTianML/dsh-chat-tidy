import type { ComponentType } from 'react'
import { adoptStyles } from './styles.ts'
import { Bridge, type BridgeProps } from './bridge.tsx'
import type { Choices } from './disclosure.ts'
import { en, zh } from './locales.ts'

/** Client plugin name, shared with the browser bundle id. */
export const name = 'dsh-chat-tidy'

/** Public services required by the browser plugin. */
export const inject = ['slots', 'locale']

/** Minimal structural face of the public Harness plugin APIs used here. */
export interface ClientContext {
  effect(factory: () => void | (() => void), label: string): void
  locale: { register(namespace: string, dictionaries: { en: typeof en; zh: typeof zh }): () => void }
  slots: {
    inject(name: string, factory: () => () => void): void
    register(options: {
      name: string; id: string; order: number; locale: string
      inject: (sessionId: string) => { choices: Choices }
    }, component: ComponentType<BridgeProps>): () => void
  }
}

/**
 * Add typography and turn disclosure without replacing native renderers.
 * Disabling the plugin removes its controls and restores every native row.
 * @param ctx - DSH browser client context.
 */
export function apply(ctx: ClientContext): void {
  const sessions = new Map<string, Choices>()
  ctx.effect(() => adoptStyles(document), 'dsh-chat-tidy: stylesheet')
  ctx.effect(() => ctx.locale.register(name, { en, zh }), 'dsh-chat-tidy: dictionaries')
  ctx.effect(() => () => { sessions.clear() }, 'dsh-chat-tidy: reader choices')
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities', id: name, order: 200, locale: name,
    inject: sessionId => {
      let choices = sessions.get(sessionId)
      if (choices === undefined) {
        choices = { turns: new Map(), groups: new Map() }
        sessions.set(sessionId, choices)
      }
      return { choices }
    },
  }, Bridge))
}

export { TIDY_CHAT_CSS, STYLE_MARKER, adoptStyles } from './styles.ts'
