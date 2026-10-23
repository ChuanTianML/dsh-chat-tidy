/** Seed synthetic acceptance sessions using a separately installed published Harness. */
import process from 'node:process'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { resolve, join } from 'node:path'
import { URL, pathToFileURL } from 'node:url'

const hostRoot = process.env.TIDY_HOST_ROOT
const validationRoot = process.env.TIDY_VALIDATION_ROOT
if (!hostRoot || !validationRoot) throw new Error('Set TIDY_HOST_ROOT and a fresh TIDY_VALIDATION_ROOT')
const require = createRequire(join(resolve(hostRoot), 'package.json'))
const load = name => import(pathToFileURL(require.resolve(name)).href)
const { Context } = await load('@deepseek-ai/cordis')
const { Session, SessionId, SESSION_FORMAT_VERSION } = await load('@deepseek-ai/dsh-session')
const { createAssistantMessage, createUserMessage } = await load('@deepseek-ai/dsh-llm')
const Persistence = await load('@deepseek-ai/dsh-session-persistence-jsonl')
const root = resolve(validationRoot)
await mkdir(root) // Refuse an existing directory rather than writing into a user's profile.
const cwd = join(root, 'workspace')
const sessions = join(root, 'sessions')
await mkdir(cwd)
const answer = await readFile(new URL('./issues-answer.md', import.meta.url), 'utf8')
const ctx = new Context()
try {
  await ctx.plugin(Persistence, { root: sessions, compression: 'none' })
  for (const [id, reason] of [
    ['tidy-issues-completed', { kind: 'completed' }],
    ['tidy-issues-stopped', { kind: 'aborted', reason: { kind: 'user' } }],
  ]) {
    const meta = { version: SESSION_FORMAT_VERSION, id: SessionId(id), createdAt: Date.now() - 120000,
      isSeeded: false, delegationDepth: 0, cwd }
    const session = Session.create(meta.id, [], meta)
    session.append('turn/start', { turn: 1 })
    const user = session.append('user/message', createUserMessage({ content: [{ type: 'text',
      text: 'Verify paragraph spacing, final-answer visibility, and wide table geometry.' }],
    source: { kind: 'user' } }), { surfaceOp: 'append' })
    session.append('session/title', { title: id, messageSeqs: [user.seq], source: { kind: 'fallback' } })
    const blocks = [{ type: 'reasoning', text: 'Inspect spacing and preserve the original answer.' },
      { type: 'text', text: answer }]
    session.append('step/start', { turn: 1, step: 1 })
    const chunks = blocks.flatMap((block, index) => [
      { type: 'block-start', index, blockType: block.type }, { type: 'block-end', index, block },
    ])
    chunks.push({ type: 'finish', reason: { kind: 'stop' } })
    session.append('assistant/message', { turn: 1, step: 1,
      message: createAssistantMessage({ source: { provider: 'deepseek-official', model: 'deepseek-v4-flash' }, content: blocks }),
      stream: chunks.map((chunk, index) => ({ type: 'chunk', time: Date.now() - 60000 + index, chunk })),
    }, { surfaceOp: 'append' })
    session.append('step/end', { turn: 1, step: 1 })
    session.append('turn/end', { turn: 1, reason })
    const handle = await ctx.sessionPersistence.create(meta)
    try { await handle.append(session.snapshotEvents()) } finally { await handle.close() }
  }
} finally { await ctx.fiber.dispose() }
await writeFile(join(root, 'overlay.yml'), [
  { id: 'web-runtime', config: { openBrowser: false, printUrl: true } },
  { id: 'session-telemetry-otel', disabled: true },
  { id: 'session-log-deepseek', config: { enabled: false } },
  { id: 'session-persistence-jsonl', config: { root: sessions, compression: 'none' } },
  { id: 'workspace-controller', config: { documentsDirectory: join(root, 'Documents') } },
].map(row => `- ${JSON.stringify(row)}`).join('\n') + '\n')
process.stdout.write(`Synthetic sessions and overlay ready in ${root}\n`)
