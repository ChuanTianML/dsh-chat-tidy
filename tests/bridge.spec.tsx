import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { Bridge, type BridgeProps, type SessionSnapshot } from '../src/client/bridge.tsx'
import { snapshot } from './fixtures.ts'

const t: BridgeProps['t'] = key => key
const choices = () => ({ turns: new Map<number, boolean>(), groups: new Map<string, boolean>() })

function Column({ props }: { props: BridgeProps }) {
  return <section>
    <div data-slot="conversation.session.header"><Bridge {...props} /></div>
    <div data-chat-flow="">
      <div data-chat-flow-key="progress">Progress</div>
      <div data-chat-flow-key="think"><div data-variant="think">Reasoning</div></div>
      <div data-chat-flow-key="tool">Tool</div>
      <div data-chat-flow-key="answer"><div data-variant="think">Final reasoning</div><p>Final answer</p></div>
    </div>
  </section>
}

afterEach(cleanup)

describe('public session subscription compatibility', () => {
  it('leaves native process presentation untouched when the Session no longer publishes Chat', () => {
    const state = { running: false }
    const useSession: BridgeProps['useSession'] = selector => selector(state)
    const listen = vi.spyOn(window, 'setInterval')
    const mounted = render(<Column props={{ sessionId: 'native', useSession, t, choices: choices() }} />)
    expect(mounted.container.querySelector('[data-ct-owned]')).toBeNull()
    expect(mounted.container.querySelector('[data-ct-hidden]')).toBeNull()
    expect(listen).not.toHaveBeenCalled()
    expect(mounted.getByText('Final answer')).toBeDefined()
  })

  it('restores legacy rows if the public Chat projection leaves the Session snapshot', () => {
    let state: SessionSnapshot = snapshot()
    const useSession: BridgeProps['useSession'] = selector => selector(state)
    const props = { sessionId: 'legacy', useSession, t, choices: choices() }
    const mounted = render(<Column props={props} />)
    expect(mounted.container.querySelector('[data-ct-owned="turn"]')).not.toBeNull()
    expect(mounted.container.querySelector('[data-ct-hidden]')).not.toBeNull()
    state = { running: false }
    mounted.rerender(<Column props={props} />)
    expect(mounted.container.querySelector('[data-ct-owned]')).toBeNull()
    expect(mounted.container.querySelector('[data-ct-hidden]')).toBeNull()
    expect(mounted.container.querySelector('[id^="dsh-ct-"]')).toBeNull()
  })
})
