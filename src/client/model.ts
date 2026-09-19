/** Read-only subset of the Harness conversation subscription used by this plugin. */
export interface Turn {
  readonly turn: number
  readonly status: 'open' | 'closed' | 'unknown'
  readonly start?: { readonly time: number }
  readonly end?: { readonly time: number; readonly data: { readonly reason: { readonly kind: string } } }
  readonly data: { get(key: 'turn-tail'): unknown }
}

/** A native Chat node; unknown plugin payloads remain visible. */
export interface Node {
  readonly key: string
  readonly kind: string
  readonly data: unknown
  readonly location: { readonly kind: string; readonly turn?: Turn }
}

/** The public session fields consumed by the header slot subscription. */
export interface Snapshot {
  readonly chat: {
    readonly order: readonly string[]
    readonly nodes: { get(key: string): Node | undefined }
    readonly timeline: { readonly turns: ReadonlyMap<number, Turn> }
  }
  readonly running: boolean
  readonly pending: readonly unknown[]
}

/** A native element address: an entire row or one reasoning disclosure in that row. */
export interface Address {
  readonly key: string
  readonly reasoning?: number
}

/** Consecutive non-interactive activity, preserving the native row order. */
export interface ActivityGroup {
  readonly id: string
  readonly addresses: readonly Address[]
  readonly thoughts: number
  readonly tools: readonly string[]
}

/** Presentation decisions for one logged turn. */
export interface TurnPlan {
  readonly id: number
  readonly firstKey?: string
  readonly start?: number
  readonly end?: number
  readonly state: 'working' | 'waiting' | 'worked' | 'stopped' | 'failed' | 'details'
  readonly autoCollapse: boolean
  readonly fold: readonly Address[]
  readonly groups: readonly ActivityGroup[]
}

/** Object narrowing at the merge-extensible node-payload boundary. */
function record(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' ? value as Record<string, unknown> : undefined
}

// Only known, non-interactive native tools are grouped. Third-party widgets,
// question/approval/plan tools and subagents retain their original visibility.
const PASSIVE_TOOLS = new Set(['bash', 'pwsh', 'read', 'write', 'edit', 'glob', 'grep', 'web_search', 'web_fetch'])

function passiveTool(value: unknown): string[] | null {
  const root = record(value)
  if (root === undefined || root.isError === true) return null
  const name = root.kind === 'tool-result' ? record(root.call)?.name : root.name
  if (typeof name !== 'string' || !PASSIVE_TOOLS.has(name) || !Array.isArray(root.subCalls)) return null
  const names = [name]
  for (const child of root.subCalls) {
    const childNames = passiveTool(child)
    if (childNames === null) return null
    names.push(...childNames)
  }
  return names
}

/**
 * Derive folding from logged turn boundaries and the host's closing-assistant
 * identity. Streaming text is never guessed to be a final answer.
 * @param snapshot - current immutable public session snapshot.
 * @returns ordered turn plans; unsupported content is left untouched.
 */
export function project(snapshot: Snapshot): TurnPlan[] {
  const byTurn = new Map<number, Node[]>()
  for (const key of snapshot.chat.order) {
    const node = snapshot.chat.nodes.get(key)
    if (node?.location.turn === undefined) continue
    const id = node.location.turn.turn
    const list = byTurn.get(id) ?? []
    list.push(node)
    byTurn.set(id, list)
  }
  const plans: TurnPlan[] = []
  for (const turn of snapshot.chat.timeline.turns.values()) {
    const nodes = byTurn.get(turn.turn) ?? []
    const active = turn.status === 'open' && snapshot.running
    const waiting = turn.status === 'open' && snapshot.pending.length > 0
    const reason = turn.end?.data.reason.kind
    const tail = record(turn.data.get('turn-tail'))
    const closing = record(record(tail?.closing)?.finalNode)?.seq
    const completed = reason === 'completed' && turn.status === 'closed'
    const fold: Address[] = []
    const groups: ActivityGroup[] = []
    let addresses: Address[] = []
    let tools: string[] = []
    let thoughts = 0
    let hasFinal = false
    const flush = () => {
      const first = addresses[0]
      if (first !== undefined) groups.push({
        id: `${turn.turn}:${first.key}:${first.reasoning ?? 0}`,
        addresses, tools, thoughts,
      })
      addresses = []
      tools = []
      thoughts = 0
    }
    for (const node of nodes) {
      const data = record(node.data)
      if (node.kind === 'tool-call' && !waiting) {
        const names = passiveTool(data?.root)
        if (names !== null) {
          const address = { key: node.key }
          addresses.push(address)
          tools.push(...names)
          fold.push(address)
          continue
        }
      }
      if (node.kind !== 'assistant-step' || data?.status === 'interrupted' || !Array.isArray(data?.blocks)) {
        flush()
        continue
      }
      const blocks = data.blocks.map(record)
      if (blocks.some(block => block === undefined || !['text', 'reasoning', 'tool-call'].includes(String(block.kind)))) {
        flush()
        continue
      }
      const hasText = blocks.some(block => block?.kind === 'text' && typeof block.text === 'string' && block.text.trim() !== '')
      const isFinal = completed && closing !== undefined && record(data.finalNode)?.seq === closing && hasText
      hasFinal ||= isFinal
      const reasonings = blocks.filter(block => block?.kind === 'reasoning')
      if (!hasText) {
        if (reasonings.length > 0) {
          const address = { key: node.key }
          addresses.push(address)
          thoughts += reasonings.length
          fold.push(address)
        }
        continue
      }
      // Text is a visible barrier. Trailing reasoning can still share its
      // summary with the next native tool row, without moving either node.
      if (!isFinal && completed) fold.push({ key: node.key })
      let index = 0
      for (const block of blocks) {
        if (block?.kind === 'text') {
          if (typeof block.text === 'string' && block.text.trim() !== '') flush()
          continue
        }
        if (block?.kind !== 'reasoning') continue
        const address = { key: node.key, reasoning: index++ }
        addresses.push(address)
        thoughts += 1
        fold.push(address)
      }
    }
    flush()
    if (fold.length === 0 && !active && !waiting) continue
    plans.push({
      id: turn.turn,
      firstKey: nodes.find(node => !['user', 'turn-tail'].includes(node.kind))?.key,
      start: turn.start?.time,
      end: turn.end?.time,
      state: waiting ? 'waiting' : active ? 'working' : completed ? 'worked'
        : reason === 'error' ? 'failed' : reason !== undefined ? 'stopped' : 'details',
      autoCollapse: completed && hasFinal && turn.start !== undefined,
      fold, groups,
    })
  }
  return plans
}

/** Format logged elapsed time without adding overlapping tool durations. */
export function duration(start: number | undefined, end: number | undefined): string | null {
  if (start === undefined || end === undefined || !Number.isFinite(start) || !Number.isFinite(end)) return null
  const seconds = Math.floor(Math.max(0, end - start) / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m${seconds % 60 ? ` ${seconds % 60}s` : ''}`
}
