/** Client plugin name, shared with the browser bundle id. */
export declare const name = "dsh-chat-tidy";
interface ClientContext {
    effect(factory: () => void | (() => void), label: string): void;
}
/**
 * Mount Tidy Chat's conversation stylesheet. Disabling or uninstalling the
 * plugin restores the DSH defaults; there is no in-app switch.
 * @param ctx - DSH browser client context.
 */
export declare function apply(ctx: ClientContext): void;
export { TIDY_CHAT_CSS, STYLE_MARKER, adoptStyles } from './styles.ts';
