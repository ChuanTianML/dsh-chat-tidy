import { type Choices } from './disclosure.ts';
import { type Snapshot } from './model.ts';
import type { Translate } from './locales.ts';
/** Newer hosts keep Chat in its own store and own their process disclosure. */
export type SessionSnapshot = Snapshot | {
    readonly running: boolean;
    readonly chat?: undefined;
};
/** Standard and injected props supplied by Harness's session header slot. */
export interface BridgeProps {
    readonly sessionId: string;
    readonly useSession: <T>(selector: (snapshot: SessionSnapshot) => T) => T;
    readonly t: Translate;
    readonly choices: Choices;
}
/** Mount the presentation controller without replacing a native view or renderer. */
export declare function Bridge({ useSession, ...props }: BridgeProps): import("react").JSX.Element | null;
