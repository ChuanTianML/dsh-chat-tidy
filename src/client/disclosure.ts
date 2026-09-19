/** Model-driven presentation on native semantic anchors; native nodes are never moved. */
import { duration, type Address, type TurnPlan } from './model.ts'
import { activityLabel, type Translate } from './locales.ts'

/** Reader choices live only for the current plugin lifetime, partitioned by session. */
export interface Choices {
  readonly turns: Map<number, boolean>
  readonly groups: Map<string, boolean>
}

interface Control {
  readonly element: HTMLDivElement
  readonly button: HTMLButtonElement
  readonly label: HTMLSpanElement
  readonly chevron: HTMLSpanElement
}

let instance = 0

/**
 * Attach reversible controls to one conversation column. Payload classification
 * comes exclusively from session snapshots; DOM observation only finds mounts.
 */
export class Disclosure {
  private readonly controls = new Map<string, Control>()
  private readonly hidden = new Set<HTMLElement>()
  private readonly ids = new Map<HTMLElement, string>()
  private readonly observer: MutationObserver
  private plans: readonly TurnPlan[] = []
  private scheduled = false
  private disposed = false
  private timer: ReturnType<typeof setInterval> | undefined
  private readonly prefix = `dsh-ct-${++instance}`
  private nextId = 0
  private restoreFrame: number | undefined
  private readonly cancelRestore = (): void => {
    if (this.restoreFrame !== undefined) this.root.ownerDocument.defaultView?.cancelAnimationFrame(this.restoreFrame)
    this.restoreFrame = undefined
  }

  constructor(
    private readonly root: HTMLElement,
    private readonly choices: Choices,
    private t: Translate,
  ) {
    this.observer = new MutationObserver(records => {
      // Ignore text changes and insertion/removal of our own controls. Native
      // React mounts and streaming updates trigger one coalesced attachment.
      if (records.some(record => {
        const target = record.target instanceof Element ? record.target : record.target.parentElement
        if (target?.closest('[data-ct-owned]')) return false
        return [...record.addedNodes, ...record.removedNodes].some(node =>
          !(node instanceof Element && node.hasAttribute('data-ct-owned')))
      })) this.schedule()
    })
    this.observer.observe(root, { subtree: true, childList: true })
    for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) root.addEventListener(event, this.cancelRestore, { passive: true })
  }

  /** Update the projection and locale without replacing native row instances. */
  update(plans: readonly TurnPlan[], t: Translate): void {
    this.plans = plans
    this.t = t
    const ticking = plans.some(plan => plan.state === 'working' || plan.state === 'waiting')
    if (ticking && this.timer === undefined) this.timer = setInterval(() => this.tick(), 1000)
    if (!ticking && this.timer !== undefined) {
      clearInterval(this.timer)
      this.timer = undefined
    }
    this.render()
  }

  /** Restore all visibility and remove plugin controls, observers and timers. */
  dispose(): void {
    if (this.disposed) return
    this.disposed = true
    this.observer.disconnect()
    this.cancelRestore()
    for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) this.root.removeEventListener(event, this.cancelRestore)
    if (this.timer !== undefined) clearInterval(this.timer)
    for (const element of this.hidden) element.removeAttribute('data-ct-hidden')
    for (const [element, id] of this.ids) if (element.id === id) element.removeAttribute('id')
    for (const control of this.controls.values()) control.element.remove()
    this.hidden.clear()
    this.ids.clear()
    this.controls.clear()
  }

  private schedule(): void {
    if (this.scheduled || this.disposed) return
    this.scheduled = true
    queueMicrotask(() => {
      this.scheduled = false
      if (!this.disposed) this.render()
    })
  }

  private label(plan: TurnPlan): string {
    const end = plan.state === 'working' || plan.state === 'waiting' ? Date.now() : plan.end
    const elapsed = duration(plan.start, end)
    const state = this.t(plan.state)
    const format = plan.state === 'failed' || plan.state === 'stopped' ? 'ended'
      : plan.state === 'waiting' || plan.state === 'details' ? 'timed' : 'elapsed'
    return elapsed === null ? state : this.t(format, { state, duration: elapsed })
  }

  private tick(): void {
    for (const plan of this.plans) {
      if (plan.state !== 'working' && plan.state !== 'waiting') continue
      const control = this.controls.get(`turn:${plan.id}`)
      if (control !== undefined) control.label.textContent = this.label(plan)
    }
  }

  private makeControl(key: string, kind: 'turn' | 'group', toggle: () => void): Control {
    const previous = this.controls.get(key)
    if (previous !== undefined) return previous
    const doc = this.root.ownerDocument
    const element = doc.createElement('div')
    element.dataset.ctOwned = kind
    const button = doc.createElement('button')
    button.type = 'button'
    const label = doc.createElement('span')
    const chevron = doc.createElement('span')
    chevron.dataset.ctChevron = ''
    chevron.setAttribute('aria-hidden', 'true')
    chevron.textContent = '›'
    button.append(label, chevron)
    button.addEventListener('click', toggle)
    element.append(button)
    const control = { element, button, label, chevron }
    this.controls.set(key, control)
    return control
  }

  private controlledId(element: HTMLElement): string {
    if (element.id) return element.id
    const id = `${this.prefix}-${++this.nextId}`
    element.id = id
    this.ids.set(element, id)
    return id
  }

  private togglePreservingPosition(control: Control, change: () => void): void {
    const scrollport = this.root.querySelector<HTMLElement>('[data-conversation-scroll]')
    const top = control.element.getBoundingClientRect().top
    this.cancelRestore()
    change()
    this.render()
    if (scrollport === null) return
    const restore = () => {
      if (!this.disposed && control.element.isConnected) scrollport.scrollTop += control.element.getBoundingClientRect().top - top
    }
    restore()
    // The native view follows height changes in ResizeObserver. Restore the
    // clicked anchor after that layout cycle, then let its normal scroll
    // listener retain the reader position. A new reader gesture cancels this.
    const view = this.root.ownerDocument.defaultView
    if (view?.requestAnimationFrame !== undefined) {
      this.restoreFrame = view.requestAnimationFrame(() => {
        this.restoreFrame = view.requestAnimationFrame(() => {
          this.restoreFrame = undefined
          restore()
        })
      })
    }
  }

  private readerInside(elements: readonly HTMLElement[]): boolean {
    const doc = this.root.ownerDocument
    const selection = doc.getSelection()
    return elements.some(element =>
      (doc.activeElement !== doc.body && element.contains(doc.activeElement))
      || (selection !== null && !selection.isCollapsed
        && (element.contains(selection.anchorNode) || element.contains(selection.focusNode))))
  }

  private render(): void {
    if (this.disposed) return
    const flow = this.root.querySelector<HTMLElement>('[data-chat-flow]')
    const wanted = new Set<string>()
    const conceal = new Set<HTMLElement>()
    if (flow !== null) {
      const rows = new Map([...flow.querySelectorAll<HTMLElement>('[data-chat-flow-key]')]
        .map(element => [element.dataset.chatFlowKey!, element]))
      const resolve = (address: Address): HTMLElement | undefined => {
        const row = rows.get(address.key)
        return address.reasoning === undefined ? row
          : row?.querySelectorAll<HTMLElement>('[data-variant="think"]')[address.reasoning]
      }
      for (const plan of this.plans) {
        const fold = plan.fold.map(resolve).filter((element): element is HTMLElement => element !== undefined)
        const first = plan.firstKey === undefined ? undefined : rows.get(plan.firstKey)
        // An unmatched settled turn cannot suppress content. First-token waits
        // may have no row yet, so their header is anchored to the live tail.
        const active = plan.state === 'working' || plan.state === 'waiting'
        if (first === undefined && !active) continue
        const turnKey = `turn:${plan.id}`
        const choice = this.choices.turns.get(plan.id)
        if (plan.autoCollapse && choice === undefined && this.readerInside(fold)) this.choices.turns.set(plan.id, true)
        const expanded = this.choices.turns.get(plan.id) ?? !plan.autoCollapse
        const collapsible = !active && fold.length > 0
        const header = this.makeControl(turnKey, 'turn', () => {
          const current = this.plans.find(item => item.id === plan.id)
          if (current === undefined || current.state === 'working' || current.state === 'waiting') return
          this.togglePreservingPosition(header, () => {
            this.choices.turns.set(plan.id, !(this.choices.turns.get(plan.id) ?? !current.autoCollapse))
          })
        })
        wanted.add(turnKey)
        header.label.textContent = this.label(plan)
        header.element.dataset.ctState = plan.state
        header.button.disabled = !collapsible
        header.button.setAttribute('aria-label', `${this.t(plan.state)}${collapsible ? ` — ${this.t(expanded ? 'hide' : 'show')}` : ''}`)
        header.button.setAttribute('aria-expanded', String(expanded))
        header.button.setAttribute('aria-controls', fold.map(element => this.controlledId(element)).join(' '))
        header.chevron.hidden = !collapsible
        const beforeFirst = first?.previousElementSibling
        const anchor = beforeFirst instanceof HTMLElement && beforeFirst.dataset.ctOwned === 'group'
          ? beforeFirst
          : first ?? [...flow.children].find(element => element.getAttribute('role') === 'status') ?? null
        if (header.element.nextElementSibling !== anchor || header.element.parentElement !== flow) flow.insertBefore(header.element, anchor)
        if (!expanded) for (const element of fold) conceal.add(element)
        for (const group of plan.groups) {
          const elements = group.addresses.map(resolve).filter((element): element is HTMLElement => element !== undefined)
          const anchor = elements[0]
          // A partially loaded/remounted group never conceals unmatched rows.
          if (anchor === undefined || elements.length !== group.addresses.length) continue
          const groupKey = `group:${group.id}`
          const open = this.choices.groups.get(group.id) ?? false
          const control = this.makeControl(groupKey, 'group', () => {
            this.togglePreservingPosition(control, () => {
              this.choices.groups.set(group.id, !(this.choices.groups.get(group.id) ?? false))
            })
          })
          wanted.add(groupKey)
          control.label.textContent = activityLabel(group.thoughts, group.tools, this.t)
          control.button.setAttribute('aria-label', `${control.label.textContent} — ${this.t(open ? 'hideActivity' : 'showActivity')}`)
          control.button.setAttribute('aria-expanded', String(open))
          control.button.setAttribute('aria-controls', elements.map(element => this.controlledId(element)).join(' '))
          // Controls are siblings of native React nodes, never their owners.
          if (control.element.nextElementSibling !== anchor) anchor.before(control.element)
          if (!expanded) conceal.add(control.element)
          if (!open) for (const element of elements) conceal.add(element)
        }
      }
    }
    for (const element of this.hidden) if (!conceal.has(element)) element.removeAttribute('data-ct-hidden')
    for (const element of conceal) if (!this.hidden.has(element)) element.setAttribute('data-ct-hidden', '')
    this.hidden.clear()
    for (const element of conceal) this.hidden.add(element)
    for (const [key, control] of this.controls) {
      if (wanted.has(key)) continue
      control.element.remove()
      this.controls.delete(key)
    }
    for (const [element, id] of this.ids) {
      if (this.root.contains(element)) continue
      if (element.id === id) element.removeAttribute('id')
      this.ids.delete(element)
    }
  }
}
