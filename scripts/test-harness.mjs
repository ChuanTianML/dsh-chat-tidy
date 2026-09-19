/** Run the built plugin inside Harness's real ModuleLoader and React assembly. */
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { spawnSync } from 'node:child_process'

const plugin = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const harness = resolve(process.env.DSH_HARNESS_ROOT ?? join(plugin, '../deepseek_harness'))
const stem = `tidy-release-${process.pid}`
const support = join(harness, `apps/web/tests/${stem}-boot.ts`)
const test = join(harness, `apps/web/tests/${stem}.snapshot.ts`)
let boot = readFileSync(join(harness, 'apps/web/tests/assembled-boot.ts'), 'utf8')
boot = boot.replace('const PLUGINS: readonly (WebBootEntry & { bundlePath: string })[] = [', `const PLUGINS: readonly (WebBootEntry & { bundlePath: string })[] = [
  { id: 'dsh-chat-tidy', bundlePath: ${JSON.stringify(relative(harness, join(plugin, 'lib/client.js')))}, url: '/plugins/chat-tidy.js', rev: 'release', inject: ['@deepseek-ai/dsh-client-runtime', '@deepseek-ai/dsh-client-ui-conversation', '@deepseek-ai/dsh-client-locale'] },`)
const spec = readFileSync(join(plugin, 'integration/assembled.snapshot.ts'), 'utf8')
  .replace("'./assembled-boot.ts'", JSON.stringify(`./${stem}-boot.ts`))
try {
  writeFileSync(support, boot)
  writeFileSync(test, spec)
  const result = spawnSync('pnpm', ['exec', 'vitest', 'run', '--config', 'vitest.web.config.ts', relative(harness, test)], { cwd: harness, stdio: 'inherit' })
  process.exitCode = result.status ?? 1
} finally {
  unlinkSync(support)
  unlinkSync(test)
}
