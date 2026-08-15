import type { ComponentType } from 'react'
import { TidyChatRow } from './TidyChatRow.tsx'
import type { TidyChatRowProps } from './TidyChatRow.tsx'
import { TidyChatController } from './controller.ts'
import type { TidyChatControllerFace } from './controller.ts'
import { en, NS, zh } from './locales.ts'
import { adoptStyles } from './styles.ts'

/** Client plugin name, shared with the browser bundle id. */
export const name = 'dsh-chat-tidy'

/** Required client services: the General Settings slot and locale registry. */
export const inject = ['slots', 'locale']

interface ClientLocale {
  register(namespace: string, dictionaries: { zh: object; en: object }): () => void
}

interface SlotRegistrationOptions {
  name: string
  id: string
  order: number
  locale: string
  inject: () => TidyChatControllerFace
}

interface ClientSlots {
  inject(name: string, mount: () => () => void): void
  register(options: SlotRegistrationOptions, component: ComponentType<TidyChatRowProps>): () => void
}

interface ClientContext {
  effect(factory: () => void | (() => void), label: string): void
  locale: ClientLocale
  slots: ClientSlots
}

/**
 * Mount Tidy Chat's scoped stylesheet, preference controller, dictionaries,
 * and Settings row.
 * @param ctx - DSH browser client context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => adoptStyles(document), 'dsh-chat-tidy: stylesheet')

  const controller = new TidyChatController(document, window.localStorage, window)
  ctx.effect(() => () => { controller.dispose() }, 'dsh-chat-tidy: preference controller')
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-chat-tidy: dictionaries')

  ctx.slots.inject('settings.general.item', () => ctx.slots.register({
    name: 'settings.general.item',
    id: 'dsh-chat-tidy',
    order: 25,
    locale: NS,
    inject: (): TidyChatControllerFace => ({
      getMode: controller.getMode,
      setMode: controller.setMode,
      subscribe: controller.subscribe,
    }),
  }, TidyChatRow))
}

export { TidyChatRow } from './TidyChatRow.tsx'
export { TidyChatController, MODE_ATTRIBUTE } from './controller.ts'
export { CHAT_MODES, DEFAULT_MODE, STORAGE_KEY } from './preferences.ts'
export { TIDY_CHAT_CSS, STYLE_MARKER, adoptStyles } from './styles.ts'
