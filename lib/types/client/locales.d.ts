/** Copy follows the Harness locale; timers are excluded from live announcements. */
export declare const en: {
    working: string;
    waiting: string;
    worked: string;
    stopped: string;
    failed: string;
    details: string;
    elapsed: string;
    ended: string;
    timed: string;
    thoughts: string;
    command: string;
    file: string;
    search: string;
    webOnce: string;
    commands: string;
    files: string;
    searches: string;
    web: string;
    separator: string;
    join: string;
    show: string;
    hide: string;
    showActivity: string;
    hideActivity: string;
};
/** Simplified Chinese dictionary. */
export declare const zh: Record<keyof typeof en, string>;
/** Namespace-bound translation provided by the host locale service. */
export type Translate = (key: keyof typeof en, params?: Record<string, unknown>) => string;
/** Summarize action categories without copying commands, paths or tool output. */
export declare function activityLabel(thoughts: number, tools: readonly string[], t: Translate): string;
