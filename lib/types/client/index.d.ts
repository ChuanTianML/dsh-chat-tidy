import type { ComponentType } from 'react';
import type { TidyChatRowProps } from './TidyChatRow.tsx';
import type { TidyChatControllerFace } from './controller.ts';
/** Client plugin name, shared with the browser bundle id. */
export declare const name = "dsh-chat-tidy";
/** Required client services: the General Settings slot and locale registry. */
export declare const inject: string[];
interface ClientLocale {
    register(namespace: string, dictionaries: {
        zh: object;
        en: object;
    }): () => void;
}
interface SlotRegistrationOptions {
    name: string;
    id: string;
    order: number;
    locale: string;
    inject: () => TidyChatControllerFace;
}
interface ClientSlots {
    inject(name: string, mount: () => () => void): void;
    register(options: SlotRegistrationOptions, component: ComponentType<TidyChatRowProps>): () => void;
}
interface ClientContext {
    effect(factory: () => void | (() => void), label: string): void;
    locale: ClientLocale;
    slots: ClientSlots;
}
/**
 * Mount Tidy Chat's scoped stylesheet, preference controller, dictionaries,
 * and Settings row.
 * @param ctx - DSH browser client context.
 */
export declare function apply(ctx: ClientContext): void;
export { TidyChatRow } from './TidyChatRow.tsx';
export { TidyChatController, MODE_ATTRIBUTE } from './controller.ts';
export { CHAT_MODES, DEFAULT_MODE, STORAGE_KEY } from './preferences.ts';
export { TIDY_CHAT_CSS, STYLE_MARKER, adoptStyles } from './styles.ts';
