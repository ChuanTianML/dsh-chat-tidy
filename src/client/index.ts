import { adoptStyles } from './styles.ts'

/** Client plugin name, shared with the browser bundle id. */
export const name = 'dsh-chat-tidy'

interface ClientContext {
  effect(factory: () => void | (() => void), label: string): void
}

/**
 * Mount Tidy Chat's conversation stylesheet. Disabling or uninstalling the
 * plugin restores the DSH defaults; there is no in-app switch.
 * @param ctx - DSH browser client context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => adoptStyles(document), 'dsh-chat-tidy: stylesheet')
}

export { TIDY_CHAT_CSS, STYLE_MARKER, adoptStyles } from './styles.ts'
