import { type Choices } from './disclosure.ts';
import { type Snapshot } from './model.ts';
import type { Translate } from './locales.ts';
/** Standard and injected props supplied by Harness's session header slot. */
export interface BridgeProps {
    readonly sessionId: string;
    readonly useSession: <T>(selector: (snapshot: Snapshot) => T) => T;
    readonly t: Translate;
    readonly choices: Choices;
}
/** Mount the presentation controller without replacing a native view or renderer. */
export declare function Bridge({ useSession, sessionId, t, choices }: BridgeProps): import("react").JSX.Element;
