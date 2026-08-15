import type { TidyChatControllerFace } from './controller.ts';
/** Translation function supplied by the Settings slot locale seat. */
export type Translate = (key: string) => string;
/** Settings-row props composed by the DSH slot renderer. */
export interface TidyChatRowProps extends TidyChatControllerFace {
    t: Translate;
}
/**
 * Render the Settings → General preference row.
 * @param props - Locale and controller faces supplied by the slot entry.
 * @returns The preference row.
 */
export declare function TidyChatRow({ t, getMode, setMode, subscribe }: TidyChatRowProps): import("react").JSX.Element;
