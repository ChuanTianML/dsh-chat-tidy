import { describe, expect, it } from 'vitest'
import {
  DEFAULT_MODE, readMode, resolveMode, STORAGE_KEY, writeMode,
} from '../src/client/preferences.ts'

describe('Tidy Chat preferences', () => {
  it('defaults absent and invalid values to Balanced', () => {
    expect(resolveMode(null)).toBe(DEFAULT_MODE)
    expect(resolveMode('spacious')).toBe(DEFAULT_MODE)
    expect(resolveMode('compact')).toBe('compact')
    expect(resolveMode('original')).toBe('original')
  })

  it('reads and writes the namespaced storage key', () => {
    const values = new Map<string, string>()
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value) },
    }

    expect(readMode(storage)).toBe('balanced')
    writeMode(storage, 'compact')
    expect(values.get(STORAGE_KEY)).toBe('compact')
    expect(readMode(storage)).toBe('compact')
  })

  it('keeps the visual preference usable when storage is disabled', () => {
    const storage = {
      getItem: (): string | null => { throw new Error('blocked') },
      setItem: (): void => { throw new Error('blocked') },
    }

    expect(readMode(storage)).toBe('balanced')
    expect(() => { writeMode(storage, 'compact') }).not.toThrow()
  })
})
