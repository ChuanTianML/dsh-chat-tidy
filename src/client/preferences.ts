/** Persisted presentation choices for Tidy Chat. */

/** Browser storage key for the selected chat presentation. */
export const STORAGE_KEY = 'dsh-chat-tidy:mode'

/** Available presentation modes. */
export const CHAT_MODES = ['balanced', 'compact', 'original'] as const

/** A selected chat presentation mode. */
export type ChatMode = typeof CHAT_MODES[number]

/** The first-run mode: restrained typography without hiding information. */
export const DEFAULT_MODE: ChatMode = 'balanced'

/** Minimal storage face used by the preference controller and tests. */
export interface PreferenceStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

/**
 * Resolve untrusted persisted text into one supported mode.
 * @param value - Stored value or null when absent.
 * @returns A supported mode, defaulting to Balanced.
 */
export function resolveMode(value: string | null): ChatMode {
  return CHAT_MODES.includes(value as ChatMode) ? value as ChatMode : DEFAULT_MODE
}

/**
 * Read the current mode without letting disabled browser storage break UI load.
 * @param storage - Browser storage face.
 * @returns The saved mode or the first-run default.
 */
export function readMode(storage: PreferenceStorage): ChatMode {
  try {
    return resolveMode(storage.getItem(STORAGE_KEY))
  } catch {
    return DEFAULT_MODE
  }
}

/**
 * Persist a mode when browser storage is available.
 * @param storage - Browser storage face.
 * @param mode - Supported mode to save.
 */
export function writeMode(storage: PreferenceStorage, mode: ChatMode): void {
  try {
    storage.setItem(STORAGE_KEY, mode)
  } catch {
    // A visual preference remains session-local when storage is unavailable.
  }
}
