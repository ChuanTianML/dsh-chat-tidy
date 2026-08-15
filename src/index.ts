/**
 * Host entry for dsh-chat-tidy.
 *
 * The feature lives entirely in the Web client. The bundle patch mounts this
 * no-op entry so DSH discovers and serves the package's client bundle.
 */

/** Stable Cordis loader name. */
export const name = 'dsh-chat-tidy'

/** Mount the host half; no host services are required. */
export function apply(): void {}
