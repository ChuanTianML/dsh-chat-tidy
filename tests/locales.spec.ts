import { describe, expect, it } from 'vitest'
import { activityLabel, en, zh, type Translate } from '../src/client/locales.ts'

const translate = (dict: typeof en): Translate => (key, params = {}) =>
  dict[key].replace(/\{(\w+)\}/g, (_, name: string) => String(params[name]))

describe('activity summary copy', () => {
  it('uses singular and plural English forms', () => {
    expect(activityLabel(0, ['bash'], translate(en))).toBe('Ran a command')
    expect(activityLabel(1, ['bash', 'bash'], translate(en))).toBe('Thought and ran 2 commands')
    expect(activityLabel(0, ['read'], translate(en))).toBe('Worked with a file')
    expect(activityLabel(0, ['grep'], translate(en))).toBe('Performed a search')
    expect(activityLabel(0, ['web_fetch'], translate(en))).toBe('Used the web')
  })
  it('uses host-localized Chinese categories', () => {
    expect(activityLabel(1, ['bash'], translate(zh))).toBe('思考，运行了 1 条命令')
  })
})
