import { describe, expect, it } from 'vitest'
import { duration, project } from '../src/client/model.ts'
import { assistant, snapshot, text, thought, tool, turn } from './fixtures.ts'

describe('logged turn disclosure', () => {

  it('groups trailing reasoning with the next tool across mixed native rows', () => {
    const owner = turn()
    const rows = [assistant('progress', [text, thought], owner), tool('tool', owner), assistant('answer', [thought, text], owner, 20)]
    const [plan] = project(snapshot(owner, rows))
    expect(plan?.groups[0]).toMatchObject({ thoughts: 2, tools: ['bash'], addresses: [
      { key: 'progress', reasoning: 0 }, { key: 'tool' }, { key: 'answer', reasoning: 0 },
    ] })
  })

  it('splits groups at each interleaved commentary block', () => {
    const owner = turn()
    const rows = [assistant('mixed', [thought, text, thought, text, thought], owner), tool('tool', owner)]
    const [plan] = project(snapshot(owner, rows))
    expect(plan?.groups).toHaveLength(3)
    expect(plan?.groups[2]).toMatchObject({ thoughts: 1, tools: ['bash'] })
  })

  it('folds completed work while keeping mixed final Markdown independent', () => {
    const [plan] = project(snapshot())
    expect(plan?.autoCollapse).toBe(true)
    expect(plan?.fold).toContainEqual({ key: 'progress' })
    expect(plan?.fold).toContainEqual({ key: 'answer', reasoning: 0 })
    expect(plan?.fold).not.toContainEqual({ key: 'answer' })
    expect(plan?.groups[0]).toMatchObject({ thoughts: 2, tools: ['bash'], addresses: [{ key: 'think' }, { key: 'tool' }, { key: 'answer', reasoning: 0 }] })
  })

  it.each(['aborted', 'blocked', 'error', 'max-tokens', 'interrupted', 'future-end-reason'])('does not auto-collapse %s', kind => {
    const owner = turn({ end: { time: 146000, data: { reason: { kind } } } })
    const [plan] = project(snapshot(owner))
    expect(plan?.autoCollapse).toBe(false)
    expect(plan?.fold).not.toContainEqual({ key: 'answer' })
    expect(plan?.fold).not.toContainEqual({ key: 'progress' })
  })

  it('never infers a final answer from streaming prose', () => {
    const owner = turn({ status: 'open', end: undefined })
    const [plan] = project(snapshot(owner))
    expect(plan).toMatchObject({ state: 'working', autoCollapse: false })
    expect(plan?.fold).not.toContainEqual({ key: 'progress' })
    expect(plan?.fold).not.toContainEqual({ key: 'answer' })
  })

  it('keeps a first-token timer even before any assistant row exists', () => {
    const owner = turn({ status: 'open', end: undefined })
    expect(project(snapshot(owner, []))[0]).toMatchObject({ state: 'working', start: 1000, groups: [] })
  })

  it('keeps pending tools visible even if the running status is already false', () => {
    const owner = turn({ status: 'open', end: undefined })
    const [plan] = project({ ...snapshot(owner), running: false, pending: [{ kind: 'question' }] })
    expect(plan?.state).toBe('waiting')
    expect(plan?.fold).not.toContainEqual({ key: 'tool' })
  })

  it('keeps tools visible while a question or approval is pending', () => {
    const owner = turn({ status: 'open', end: undefined })
    const [plan] = project({ ...snapshot(owner), pending: [{ kind: 'approval' }] })
    expect(plan?.state).toBe('waiting')
    expect(plan?.fold).not.toContainEqual({ key: 'tool' })
  })

  it.each([
    { isError: true }, { call: { name: 'ask_user_question' } },
    { call: { name: 'custom_widget' } }, { call: { name: 'spawn_agent' } },
    { subCalls: [{ kind: 'tool-result', call: { name: 'bash' }, isError: true, subCalls: [] }] },
  ])('retains errors and interactive/unknown tools: %j', overrides => {
    const owner = turn()
    const rows = [assistant('think', [thought], owner), tool('special', owner, overrides), assistant('answer', [text], owner, 20)]
    expect(project(snapshot(owner, rows))[0]?.fold).not.toContainEqual({ key: 'special' })
  })

  it('does not hide unknown/image blocks in a commentary node', () => {
    const owner = turn()
    const rows = [assistant('image', [thought, { kind: 'image' }], owner), assistant('answer', [thought, text], owner, 20)]
    expect(project(snapshot(owner, rows))[0]?.fold).not.toContainEqual({ key: 'image' })
  })

  it('leaves unknown node kinds and context as grouping barriers', () => {
    const owner = turn()
    const rows = [assistant('think', [thought], owner), { key: 'unknown', kind: 'future', data: {}, location: { kind: 'turn', turn: owner } }, tool('bash', owner)]
    const [plan] = project(snapshot(owner, rows))
    expect(plan?.groups).toHaveLength(2)
    expect(plan?.fold).not.toContainEqual({ key: 'unknown' })
    expect(plan?.autoCollapse).toBe(false)
  })

  it('does not collapse incomplete paged history or a turn without a closing answer', () => {
    expect(project(snapshot(turn({ start: undefined })))[0]?.autoCollapse).toBe(false)
    expect(project(snapshot(turn({ data: { get: () => null } })))[0]?.autoCollapse).toBe(false)
  })

  it('leaves malformed extension payloads visible', () => {
    const owner = turn()
    const rows = [assistant('bad', [null, 42], owner), tool('badtool', owner, { subCalls: null }), assistant('answer', [thought, text], owner, 20)]
    expect(project(snapshot(owner, rows))[0]?.fold).toEqual([{ key: 'answer', reasoning: 0 }])
  })

  it('does not alter its input', () => {
    const data = snapshot()
    const before = JSON.stringify(data.chat.order.map(key => data.chat.nodes.get(key)))
    project(data)
    expect(JSON.stringify(data.chat.order.map(key => data.chat.nodes.get(key)))).toBe(before)
  })

  it.each([[1000, 146000, '2m 25s'], [1000, 1000, '0s'], [1000, 0, '0s'], [0, 3600000, '60m'], [undefined, 100, null], [0, NaN, null]])('formats %s → %s as %s', (start, end, expected) => {
    expect(duration(start as number | undefined, end as number | undefined)).toBe(expected)
  })
})
