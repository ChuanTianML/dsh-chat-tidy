/** Read-only subset of the Harness conversation subscription used by this plugin. */
export interface Turn {
    readonly turn: number;
    readonly status: 'open' | 'closed' | 'unknown';
    readonly start?: {
        readonly time: number;
    };
    readonly end?: {
        readonly time: number;
        readonly data: {
            readonly reason: {
                readonly kind: string;
            };
        };
    };
    readonly data: {
        get(key: 'turn-tail'): unknown;
    };
}
/** A native Chat node; unknown plugin payloads remain visible. */
export interface Node {
    readonly key: string;
    readonly kind: string;
    readonly data: unknown;
    readonly location: {
        readonly kind: string;
        readonly turn?: Turn;
    };
}
/** The public session fields consumed by the header slot subscription. */
export interface Snapshot {
    readonly chat: {
        readonly order: readonly string[];
        readonly nodes: {
            get(key: string): Node | undefined;
        };
        readonly timeline: {
            readonly turns: ReadonlyMap<number, Turn>;
        };
    };
    readonly running: boolean;
    readonly pending: readonly unknown[];
}
/** A native element address: an entire row or one reasoning disclosure in that row. */
export interface Address {
    readonly key: string;
    readonly reasoning?: number;
}
/** Consecutive non-interactive activity, preserving the native row order. */
export interface ActivityGroup {
    readonly id: string;
    readonly addresses: readonly Address[];
    readonly thoughts: number;
    readonly tools: readonly string[];
}
/** Presentation decisions for one logged turn. */
export interface TurnPlan {
    readonly id: number;
    readonly firstKey?: string;
    readonly start?: number;
    readonly end?: number;
    readonly state: 'working' | 'waiting' | 'worked' | 'stopped' | 'failed' | 'details';
    readonly autoCollapse: boolean;
    readonly fold: readonly Address[];
    readonly groups: readonly ActivityGroup[];
}
/**
 * Derive folding from logged turn boundaries and the host's closing-assistant
 * identity. Streaming text is never guessed to be a final answer.
 * @param snapshot - current immutable public session snapshot.
 * @returns ordered turn plans; unsupported content is left untouched.
 */
export declare function project(snapshot: Snapshot): TurnPlan[];
/** Format logged elapsed time without adding overlapping tool durations. */
export declare function duration(start: number | undefined, end: number | undefined): string | null;
