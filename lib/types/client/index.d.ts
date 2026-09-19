import type { ComponentType } from 'react';
import { type BridgeProps } from './bridge.tsx';
import type { Choices } from './disclosure.ts';
import { en, zh } from './locales.ts';
/** Client plugin name, shared with the browser bundle id. */
export declare const name = "dsh-chat-tidy";
/** Public services required by the browser plugin. */
export declare const inject: string[];
/** Minimal structural face of the public Harness plugin APIs used here. */
export interface ClientContext {
    effect(factory: () => void | (() => void), label: string): void;
    locale: {
        register(namespace: string, dictionaries: {
            en: typeof en;
            zh: typeof zh;
        }): () => void;
    };
    slots: {
        inject(name: string, factory: () => () => void): void;
        register(options: {
            name: string;
            id: string;
            order: number;
            locale: string;
            inject: (sessionId: string) => {
                choices: Choices;
            };
        }, component: ComponentType<BridgeProps>): () => void;
    };
}
/**
 * Add typography and turn disclosure without replacing native renderers.
 * Disabling the plugin removes its controls and restores every native row.
 * @param ctx - DSH browser client context.
 */
export declare function apply(ctx: ClientContext): void;
export { TIDY_CHAT_CSS, STYLE_MARKER, adoptStyles } from './styles.ts';
