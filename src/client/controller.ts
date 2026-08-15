import { readMode, resolveMode, STORAGE_KEY, writeMode } from './preferences.ts'
import type { ChatMode, PreferenceStorage } from './preferences.ts'

/** Body data attribute that scopes every Tidy Chat rule. */
export const MODE_ATTRIBUTE = 'data-dsh-chat-tidy'

/** Read/subscription face injected into the Settings row. */
export interface TidyChatControllerFace {
  getMode(): ChatMode
  setMode(mode: ChatMode): void
  subscribe(listener: () => void): () => void
}

/**
 * Own the persisted preference, body scope marker, and cross-tab updates.
 * The previous marker is restored at disposal so plugin reload and uninstall
 * leave the host document unchanged.
 */
export class TidyChatController implements TidyChatControllerFace {
  private readonly listeners = new Set<() => void>()
  private readonly previousAttribute: string | null
  private mode: ChatMode

  constructor(
    private readonly document: Document,
    private readonly storage: PreferenceStorage,
    private readonly browser: Pick<Window, 'addEventListener' | 'removeEventListener'>,
  ) {
    this.previousAttribute = document.body.getAttribute(MODE_ATTRIBUTE)
    this.mode = readMode(storage)
    this.applyMode()
    browser.addEventListener('storage', this.onStorage)
  }

  /** @returns The current mode. */
  getMode = (): ChatMode => this.mode

  /**
   * Select and persist a presentation mode.
   * @param mode - Supported mode selected in Settings.
   */
  setMode = (mode: ChatMode): void => {
    if (mode === this.mode) return
    this.mode = mode
    writeMode(this.storage, mode)
    this.applyMode()
    this.emit()
  }

  /**
   * Subscribe to preference changes.
   * @param listener - React external-store listener.
   * @returns Subscription disposer.
   */
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  /** Remove browser listeners and restore the pre-plugin body marker. */
  dispose(): void {
    this.browser.removeEventListener('storage', this.onStorage)
    if (this.previousAttribute === null) this.document.body.removeAttribute(MODE_ATTRIBUTE)
    else this.document.body.setAttribute(MODE_ATTRIBUTE, this.previousAttribute)
    this.listeners.clear()
  }

  private readonly onStorage = (event: Event): void => {
    const storageEvent = event as StorageEvent
    if (storageEvent.key !== STORAGE_KEY) return
    const next = resolveMode(storageEvent.newValue)
    if (next === this.mode) return
    this.mode = next
    this.applyMode()
    this.emit()
  }

  private applyMode(): void {
    this.document.body.setAttribute(MODE_ATTRIBUTE, this.mode)
  }

  private emit(): void {
    for (const listener of this.listeners) listener()
  }
}
