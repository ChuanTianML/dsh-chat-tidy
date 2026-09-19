// @vitest-environment jsdom
// Copied by scripts/test-harness.mjs beside the host's assembled test helper.
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { installAssembledBootEnv, mountAssembledApp } from './assembled-boot.ts'

installAssembledBootEnv()

describe('Chat Tidy built-bundle integration', () => {
  it('groups native history without hiding the final answer or truncation notice', async () => {
    mountAssembledApp()
    const tree = await screen.findByRole('tree', { name: 'Sessions' }, { timeout: 10_000 })
    fireEvent.click(await within(tree).findByText('Fixture 历史会话'))
    await screen.findByText(/条目 3：这一条写到一半被/, undefined, { timeout: 10_000 })
    await waitFor(() => expect(document.querySelector('[data-ct-owned="turn"]')).not.toBeNull())
    expect(document.querySelector('[data-slot-error]')).toBeNull()
    const controls = [...document.querySelectorAll<HTMLButtonElement>('[data-ct-owned="turn"] button')]
    const completed = controls.filter(button => button.textContent?.startsWith('Worked'))
    expect(completed.length).toBeGreaterThan(0)
    const closed = completed.find(button => button.getAttribute('aria-expanded') === 'false')!
    expect(closed).toBeDefined()
    fireEvent.click(closed)
    expect(closed.getAttribute('aria-expanded')).toBe('true')
    const group = [...document.querySelectorAll<HTMLButtonElement>('[data-ct-owned="group"] button')]
      .find(button => !button.closest('[data-ct-hidden]'))!
    expect(group).toBeDefined()
    fireEvent.click(group)
    expect(group.getAttribute('aria-expanded')).toBe('true')
    for (const id of group.getAttribute('aria-controls')!.split(' ')) {
      const native = document.getElementById(id)!
      expect(native).not.toBeNull()
      expect(native.closest('[data-ct-hidden]')).toBeNull()
      expect(native.matches('[data-chat-flow-key], [data-variant="think"]')).toBe(true)
    }
    const interrupted = screen.getByText(/条目 3：这一条写到一半被/)
    expect(interrupted.closest('[data-ct-hidden]')).toBeNull()
    expect(document.querySelectorAll('style[data-plugin="dsh-chat-tidy"]')).toHaveLength(1)
  })
})
