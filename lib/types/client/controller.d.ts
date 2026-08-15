import type { ChatMode, PreferenceStorage } from './preferences.ts';
/** Body data attribute that scopes every Tidy Chat rule. */
export declare const MODE_ATTRIBUTE = "data-dsh-chat-tidy";
/** Read/subscription face injected into the Settings row. */
export interface TidyChatControllerFace {
    getMode(): ChatMode;
    setMode(mode: ChatMode): void;
    subscribe(listener: () => void): () => void;
}
/**
 * Own the persisted preference, body scope marker, and cross-tab updates.
 * The previous marker is restored at disposal so plugin reload and uninstall
 * leave the host document unchanged.
 */
export declare class TidyChatController implements TidyChatControllerFace {
    private readonly document;
    private readonly storage;
    private readonly browser;
    private readonly listeners;
    private readonly previousAttribute;
    private mode;
    constructor(document: Document, storage: PreferenceStorage, browser: Pick<Window, 'addEventListener' | 'removeEventListener'>);
    /** @returns The current mode. */
    getMode: () => ChatMode;
    /**
     * Select and persist a presentation mode.
     * @param mode - Supported mode selected in Settings.
     */
    setMode: (mode: ChatMode) => void;
    /**
     * Subscribe to preference changes.
     * @param listener - React external-store listener.
     * @returns Subscription disposer.
     */
    subscribe: (listener: () => void) => (() => void);
    /** Remove browser listeners and restore the pre-plugin body marker. */
    dispose(): void;
    private readonly onStorage;
    private applyMode;
    private emit;
}
