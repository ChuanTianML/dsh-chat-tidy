import type { Node, Snapshot, Turn } from '../src/client/model.ts'

export function turn(overrides: Partial<Turn> = {}): Turn {
  return {
    turn: 1, status: 'closed', start: { time: 1000 },
    end: { time: 146000, data: { reason: { kind: 'completed' } } },
    data: { get: () => ({ closing: { finalNode: { seq: 20 } } }) }, ...overrides,
  }
}

export function assistant(key: string, blocks: unknown[], owner: Turn, seq = 10): Node {
  return { key, kind: 'assistant-step', location: { kind: 'step', turn: owner }, data: {
    status: 'settled', blocks, finalNode: { seq },
  } }
}

export function tool(key: string, owner: Turn, overrides: Record<string, unknown> = {}): Node {
  return { key, kind: 'tool-call', location: { kind: 'step', turn: owner }, data: { root: {
    kind: 'tool-result', call: { name: 'bash' }, isError: false, subCalls: [], ...overrides,
  } } }
}

export function snapshot(owner = turn(), rows: Node[] = [
  assistant('progress', [{ kind: 'text', text: 'Checking the code.' }], owner),
  assistant('think', [{ kind: 'reasoning', text: 'Inspect the tests.' }], owner),
  tool('tool', owner),
  assistant('answer', [{ kind: 'reasoning', text: 'Summarize.' }, { kind: 'text', text: 'All checks passed.' }], owner, 20),
]): Snapshot {
  return { chat: { order: rows.map(row => row.key), nodes: new Map(rows.map(row => [row.key, row])), timeline: { turns: new Map([[owner.turn, owner]]) } }, pending: [], running: owner.status === 'open' }
}

export const text = { kind: 'text', text: 'Answer' }
export const thought = { kind: 'reasoning', text: 'Reasoning' }
