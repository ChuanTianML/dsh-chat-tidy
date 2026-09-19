import { existsSync, writeFileSync, unlinkSync } from 'node:fs'
import { setTimeout as delay } from 'node:timers/promises'
import { it } from 'vitest'
import { CallId, createAssistantMessage, createToolResultMessage, createUserMessage, LlmAdapter } from '@deepseek-ai/dsh-llm'
import type { GenerateOptions, StreamChunk } from '@deepseek-ai/dsh-llm'
import { Session, SessionId, SESSION_FORMAT_VERSION } from '@deepseek-ai/dsh-session'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import type {} from '@deepseek-ai/dsh-workspace'
import { launchWebScaffold, seedSession } from './scaffold.ts'

const plugin = process.env.TIDY_PLUGIN_ROOT!
const control = process.env.TIDY_DEMO_CONTROL!
const source = { provider: 'deepseek-official', model: 'deepseek-v4-flash' }
const answer = 'The release page is ready.\n\n- Improved the heading hierarchy and tightened the reading rhythm.\n- Kept keyboard focus visible and checked narrow screens.\n- Confirmed that the existing interactions still work.\n\n| Check | Result |\n| --- | --- |\n| Typography & spacing | Passed |\n| Keyboard navigation | Passed |\n| Responsive layout | Passed |\n\nAll changes are limited to presentation. The original content is preserved.'

function fixture(): string {
  const session = Session.create(SessionId('tidy-demo-source'))
  session.append('turn/start', { turn: 1 })
  const user = session.append('user/message', createUserMessage({ content: [{ type: 'text', text: 'Review the release page. Improve readability, check keyboard navigation, and verify the responsive layout.' }], source: { kind: 'user' } }), { surfaceOp: 'append' })
  session.append('session/title', { title: 'Release page review', messageSeqs: [user.seq], source: { kind: 'fallback' } })
  const messages = [
    ['I’ll review the page structure first, then check the interactions and narrow-screen layout.', 'Map the heading hierarchy and identify repeated spacing.', 'printf "Heading hierarchy: passed\\nSpacing: passed\\n"'],
    ['The reading rhythm is consistent. I’m checking keyboard focus and the compact layout next.', 'Verify that disclosure buttons remain reachable without changing native controls.', 'printf "Keyboard navigation: passed\\nResponsive layout: passed\\n"'],
  ]
  for (const [index, [commentary, thought, command]] of messages.entries()) {
    const step = index + 1
    const callId = CallId(`demo-check-${step}`)
    const args = JSON.stringify({ command, description: step === 1 ? 'Check typography and spacing' : 'Check focus and responsive layout' })
    session.append('step/start', { turn: 1, step })
    session.append('assistant/message', { turn: 1, step, message: createAssistantMessage({ source, content: [
      { type: 'text', text: commentary! }, { type: 'reasoning', text: thought! },
      { type: 'tool-call', id: callId, name: 'bash', arguments: args },
    ] }) }, { surfaceOp: 'append' })
    const call = session.append('tool/call', { turn: 1, step, callId, name: 'bash', arguments: args })
    session.append('tool/result', { turn: 1, step, message: createToolResultMessage({ callId, isError: false, content: [{ type: 'text', text: step === 1 ? 'Heading hierarchy: passed\nSpacing: passed' : 'Keyboard navigation: passed\nResponsive layout: passed' }] }) }, { surfaceOp: 'append', sourceEventSeqs: [call.seq] })
    session.append('step/end', { turn: 1, step })
  }
  session.append('step/start', { turn: 1, step: 3 })
  session.append('assistant/message', { turn: 1, step: 3, message: createAssistantMessage({ source, content: [{ type: 'reasoning', text: 'Summarize the verified presentation changes.' }, { type: 'text', text: answer }] }) }, { surfaceOp: 'append' })
  session.append('step/end', { turn: 1, step: 3 })
  session.append('turn/end', { turn: 1, reason: { kind: 'completed' } })
  const start = Date.now() - 300000
  return [JSON.stringify({ type: 'session', version: SESSION_FORMAT_VERSION, id: '{{sessionId}}', createdAt: start, cwd: '{{cwd}}' }),
    ...session.events.map(event => JSON.stringify({ ...event, time: start + Math.round(event.seq / (session.events.length - 1) * 145000) })), ''].join('\n')
}

class DemoAdapter extends LlmAdapter {
  private step = 0
  override listModels(provider: string) { return Promise.resolve([{ provider, id: 'deepseek-v4-flash', name: 'DeepSeek-V4-Flash', contextWindow: 128000 }]) }
  override async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    const current = this.step++ % 3
    if (current < 2) {
      const commentary = current === 0
        ? 'I’ll check the release page in three passes: readability, keyboard navigation, and narrow-screen layout.'
        : 'The typography checks passed. I’m verifying focus visibility and the responsive layout now.'
      yield { type: 'block-start', index: 0, blockType: 'text' }
      yield { type: 'block-end', index: 0, block: { type: 'text', text: commentary } }
      yield { type: 'block-start', index: 1, blockType: 'reasoning' }
      yield { type: 'block-end', index: 1, block: { type: 'reasoning', text: current === 0 ? 'Inspect the heading hierarchy and spacing.' : 'Check keyboard access and keep the reading column within the viewport.' } }
      yield { type: 'block-start', index: 2, blockType: 'tool-call' }
      yield { type: 'block-end', index: 2, block: { type: 'tool-call', id: CallId(`live-check-${this.step}`), name: 'bash', arguments: JSON.stringify({ command: current === 0 ? 'printf "Typography: passed\\nSpacing: passed\\n"' : 'printf "Keyboard focus: passed\\nResponsive layout: passed\\n"', description: current === 0 ? 'Check typography and spacing' : 'Check keyboard focus and layout' }) } }
      yield { type: 'finish', reason: { kind: 'tool-calls' } }
      return
    }
    yield { type: 'block-start', index: 0, blockType: 'reasoning' }
    yield { type: 'reasoning-delta', index: 0, text: 'Comparing the final checks and preparing the review summary.' }
    while (!existsSync(`${control}/finish`)) await delay(200, undefined, { signal: options.signal })
    yield { type: 'block-end', index: 0, block: { type: 'reasoning', text: 'Comparing the final checks and preparing the review summary.' } }
    yield { type: 'block-start', index: 1, blockType: 'text' }
    yield { type: 'block-end', index: 1, block: { type: 'text', text: answer } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}

it('serves a synthetic local demonstration until stopped', async () => {
  const scaffold = await launchWebScaffold({ extraOverlayPath: `${plugin}/cordis.patch.yml`, extraInstallAnchor: `${plugin}/package.json`, keylessAdapter: new DemoAdapter() })
  try {
    await scaffold.ctx.settings.mutate(settingsNamespace('locale'), [{ op: 'set', path: ['preference'], value: 'en' }])
    const id = await seedSession(scaffold, fixture(), 'tidy-work-demo')
    const workspace = await scaffold.ctx.workspaceRegistry.create(scaffold.workspaceCwd, 'Tidy Work demo')
    await workspace.attachSession(id)
    writeFileSync(`${control}/ready.json`, JSON.stringify({ url: scaffold.baseUrl, sessionId: id }))
    while (!existsSync(`${control}/stop`)) {
      if (existsSync(`${control}/refresh`)) { scaffold.ctx.clientModules.rebuilt('dsh-chat-tidy'); unlinkSync(`${control}/refresh`) }
      await delay(250)
    }
  } finally { await scaffold.close() }
}, 3600000)
