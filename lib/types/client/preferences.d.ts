/** Persisted presentation choices for Tidy Chat. */
/** Browser storage key for the selected chat presentation. */
export declare const STORAGE_KEY = "dsh-chat-tidy:mode";
/** Available presentation modes. */
export declare const CHAT_MODES: readonly ["balanced", "compact", "original"];
/** A selected chat presentation mode. */
export type ChatMode = typeof CHAT_MODES[number];
/** The first-run mode: restrained typography without hiding information. */
export declare const DEFAULT_MODE: ChatMode;
/** Minimal storage face used by the preference controller and tests. */
export interface PreferenceStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
/**
 * Resolve untrusted persisted text into one supported mode.
 * @param value - Stored value or null when absent.
 * @returns A supported mode, defaulting to Balanced.
 */
export declare function resolveMode(value: string | null): ChatMode;
/**
 * Read the current mode without letting disabled browser storage break UI load.
 * @param storage - Browser storage face.
 * @returns The saved mode or the first-run default.
 */
export declare function readMode(storage: PreferenceStorage): ChatMode;
/**
 * Persist a mode when browser storage is available.
 * @param storage - Browser storage face.
 * @param mode - Supported mode to save.
 */
export declare function writeMode(storage: PreferenceStorage, mode: ChatMode): void;
