/** Public header-slot subscription, scoped to its own conversation column. */
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Disclosure, type Choices } from './disclosure.ts'
import { project, type Snapshot } from './model.ts'
import type { Translate } from './locales.ts'

/** Standard and injected props supplied by Harness's session header slot. */
export interface BridgeProps {
  readonly sessionId: string
  readonly useSession: <T>(selector: (snapshot: Snapshot) => T) => T
  readonly t: Translate
  readonly choices: Choices
}

/** Mount the presentation controller without replacing a native view or renderer. */
export function Bridge({ useSession, sessionId, t, choices }: BridgeProps) {
  const marker = useRef<HTMLSpanElement>(null)
  const controller = useRef<Disclosure | null>(null)
  const snapshot = useSession(value => value)
  useLayoutEffect(() => {
    const root = marker.current?.closest('[data-slot="conversation.session.header"]')?.parentElement
    if (root === null || root === undefined) return
    const mounted = new Disclosure(root, choices, t)
    controller.current = mounted
    return () => { mounted.dispose(); controller.current = null }
  }, [sessionId, choices])
  useLayoutEffect(() => { controller.current?.update(project(snapshot), t) }, [snapshot, t])
  // Session changes remount the controller even if a host reuses its snapshot.
  useEffect(() => { controller.current?.update(project(snapshot), t) }, [sessionId])
  return <span ref={marker} data-ct-bridge="" hidden />
}
