/** Model-driven presentation on native semantic anchors; native nodes are never moved. */
import { type TurnPlan } from './model.ts';
import { type Translate } from './locales.ts';
/** Reader choices live only for the current plugin lifetime, partitioned by session. */
export interface Choices {
    readonly turns: Map<number, boolean>;
    readonly groups: Map<string, boolean>;
}
/**
 * Attach reversible controls to one conversation column. Payload classification
 * comes exclusively from session snapshots; DOM observation only finds mounts.
 */
export declare class Disclosure {
    private readonly root;
    private readonly choices;
    private t;
    private readonly controls;
    private readonly hidden;
    private readonly ids;
    private readonly observer;
    private plans;
    private scheduled;
    private disposed;
    private timer;
    private readonly prefix;
    private nextId;
    private restoreFrame;
    private readonly cancelRestore;
    constructor(root: HTMLElement, choices: Choices, t: Translate);
    /** Update the projection and locale without replacing native row instances. */
    update(plans: readonly TurnPlan[], t: Translate): void;
    /** Restore all visibility and remove plugin controls, observers and timers. */
    dispose(): void;
    private schedule;
    private label;
    private tick;
    private makeControl;
    private controlledId;
    private togglePreservingPosition;
    private readerInside;
    private render;
}
