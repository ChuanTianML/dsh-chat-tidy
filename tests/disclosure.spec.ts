import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Disclosure, type Choices } from '../src/client/disclosure.ts'
import { en, zh, type Translate } from '../src/client/locales.ts'
import { project } from '../src/client/model.ts'
import { assistant, snapshot, thought, text, tool, turn } from './fixtures.ts'

const translate = (dict = en): Translate => (key, params = {}) => dict[key].replace(/\{(\w+)\}/g, (_, name: string) => String(params[name]))
let controller: Disclosure
let root: HTMLElement
let choices: Choices

function row(key: string): HTMLElement { return root.querySelector(`[data-chat-flow-key="${key}"]`)! }
function hidden(element: HTMLElement): boolean { return element.closest('[data-ct-hidden]') !== null }
function button(kind: string): HTMLButtonElement { return root.querySelector(`[data-ct-owned="${kind}"] button`)! }

beforeEach(() => {
  document.body.innerHTML = `<main><div data-conversation-scroll><div data-chat-flow>
    <div data-chat-flow-key="progress"><p>Checking the code.</p></div>
    <div data-chat-flow-key="think"><div data-variant="think"><button>Think</button><p>Inspect the tests.</p></div></div>
    <div data-chat-flow-key="tool"><button>Bash</button><pre>All tests passed.</pre></div>
    <div data-chat-flow-key="answer"><div><div data-variant="think"><button>Think</button><p>Summarize.</p></div><p id="final-answer">All checks passed.</p></div></div>
  </div></div></main>`
  root = document.querySelector('main')!
  choices = { turns: new Map(), groups: new Map() }
  controller = new Disclosure(root, choices, translate())
})
afterEach(() => { controller.dispose(); document.body.innerHTML = ''; vi.useRealTimers() })

describe('native row presentation', () => {

  it('restores the clicked anchor after native bottom-follow and cancels on a new gesture', () => {
    vi.useFakeTimers()
    controller.update(project(snapshot()), translate())
    const header = button('turn').parentElement!
    let top = 220
    vi.spyOn(header, 'getBoundingClientRect').mockImplementation(() => ({ top }) as DOMRect)
    const scrollport = root.querySelector<HTMLElement>('[data-conversation-scroll]')!
    button('turn').click()
    top = 100
    vi.advanceTimersByTime(40)
    expect(scrollport.scrollTop).toBe(-120)
    button('turn').click()
    root.dispatchEvent(new Event('wheel'))
    top = 20
    vi.advanceTimersByTime(40)
    expect(scrollport.scrollTop).toBe(-120)
  })

  it('keeps selected text visible when the turn completes', () => {
    const owner = turn({ status: 'open', end: undefined })
    controller.update(project(snapshot(owner)), translate())
    const range = document.createRange()
    range.selectNodeContents(row('progress'))
    document.getSelection()!.addRange(range)
    controller.update(project(snapshot()), translate())
    expect(hidden(row('progress'))).toBe(false)
    document.getSelection()!.removeAllRanges()
  })

  it('reveals a newly failed tool without waiting for a click', () => {
    const owner = turn()
    controller.update(project(snapshot(owner)), translate())
    expect(hidden(row('tool'))).toBe(true)
    controller.update(project(snapshot(owner, [
      assistant('think', [thought], owner), tool('tool', owner, { isError: true }),
      assistant('answer', [thought, text], owner, 20),
    ])), translate())
    expect(hidden(row('tool'))).toBe(false)
  })

  it('preserves an expanded Think when prose arrives in the same native assistant row', () => {
    const owner = turn({ status: 'open', end: undefined })
    controller.update(project(snapshot(owner, [assistant('think', [thought], owner)])), translate())
    button('group').click()
    controller.update(project(snapshot(owner, [assistant('think', [thought, text], owner)])), translate())
    expect(button('group').getAttribute('aria-expanded')).toBe('true')
    expect(hidden(row('think').querySelector('[data-variant]')!)).toBe(false)
  })

  it('leaves a second conversation column untouched', () => {
    const other = root.cloneNode(true) as HTMLElement
    document.body.append(other)
    controller.update(project(snapshot()), translate())
    expect(other.querySelector('[data-ct-owned], [data-ct-hidden]')).toBeNull()
    other.remove()
  })

  it('drops timers and scheduled work when disposed during a stream', async () => {
    vi.useFakeTimers()
    const owner = turn({ status: 'open', end: undefined })
    controller.update(project(snapshot(owner)), translate())
    row('progress').append(document.createTextNode('More text'))
    controller.dispose()
    await Promise.resolve()
    expect(vi.getTimerCount()).toBe(0)
    expect(root.querySelector('[data-ct-owned], [data-ct-hidden]')).toBeNull()
  })

  it('keeps the final answer visible, with nested access to the original tool and reasoning nodes', () => {
    const original = row('tool')
    controller.update(project(snapshot()), translate())
    expect(button('turn').textContent).toContain('Worked for 2m 25s')
    expect(hidden(row('progress'))).toBe(true)
    expect(hidden(document.getElementById('final-answer')!)).toBe(false)
    expect(hidden(row('answer').querySelector('[data-variant]')!)).toBe(true)
    button('turn').click()
    expect(hidden(row('progress'))).toBe(false)
    expect(hidden(row('tool'))).toBe(true)
    button('group').click()
    expect(hidden(row('tool'))).toBe(false)
    expect(row('tool')).toBe(original)
    expect(button('group').getAttribute('aria-expanded')).toBe('true')
    for (const id of button('group').getAttribute('aria-controls')!.split(' ')) expect(document.getElementById(id)).not.toBeNull()
  })

  it('retains both disclosure choices across updates and column remounts', () => {
    controller.update(project(snapshot()), translate())
    button('turn').click(); button('group').click()
    controller.update(project(snapshot()), translate())
    expect(hidden(row('tool'))).toBe(false)
    controller.dispose()
    controller = new Disclosure(root, choices, translate())
    controller.update(project(snapshot()), translate())
    expect(hidden(row('tool'))).toBe(false)
  })

  it('does not conceal a focused native control on completion', () => {
    const owner = turn({ status: 'open', end: undefined })
    controller.update(project(snapshot(owner)), translate())
    button('group').click()
    row('tool').querySelector('button')!.focus()
    controller.update(project(snapshot()), translate())
    expect(hidden(row('tool'))).toBe(false)
    expect(choices.turns.get(1)).toBe(true)
  })

  it('shows live timing and commentary, then uses logged end time', () => {
    vi.useFakeTimers(); vi.setSystemTime(11000)
    const owner = turn({ status: 'open', end: undefined })
    controller.update(project(snapshot(owner)), translate())
    expect(button('turn').disabled).toBe(true)
    expect(button('turn').textContent).toContain('Working for 10s')
    expect(hidden(row('progress'))).toBe(false)
    vi.advanceTimersByTime(2000)
    expect(button('turn').textContent).toContain('Working for 12s')
    controller.update(project(snapshot()), translate())
    expect(button('turn').textContent).toContain('Worked for 2m 25s')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('updates locale without resetting reader choices', () => {
    controller.update(project(snapshot()), translate())
    button('turn').click()
    controller.update(project(snapshot()), translate(zh))
    expect(button('turn').textContent).toContain('已完成 · 2m 25s')
    expect(hidden(row('progress'))).toBe(false)
  })

  it('reattaches after native React replaces a streamed child and restores removed rows', async () => {
    controller.update(project(snapshot()), translate())
    const old = row('tool')
    const replacement = old.cloneNode(true) as HTMLElement
    replacement.removeAttribute('data-ct-hidden'); replacement.removeAttribute('id')
    old.replaceWith(replacement)
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(hidden(replacement)).toBe(true)
    expect(old.hasAttribute('data-ct-hidden')).toBe(false)
    expect(old.id).toBe('')
  })

  it('restores a native view completely on disable, preserving existing ids and event listeners', () => {
    const clicked = vi.fn()
    row('tool').querySelector('button')!.addEventListener('click', clicked)
    const original = root.innerHTML
    controller.update(project(snapshot()), translate())
    controller.dispose()
    expect(root.innerHTML).toBe(original)
    row('tool').querySelector('button')!.click()
    expect(clicked).toHaveBeenCalledOnce()
  })

  it('does not create orphaned controls when an alternative view replaces Chat', async () => {
    controller.update(project(snapshot()), translate())
    root.querySelector('[data-chat-flow]')!.remove()
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(root.querySelector('[data-ct-owned]')).toBeNull()
  })
})
