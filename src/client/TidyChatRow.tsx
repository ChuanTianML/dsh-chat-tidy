import { useSyncExternalStore } from 'react'
import type { ChatMode } from './preferences.ts'
import type { TidyChatControllerFace } from './controller.ts'

/** Translation function supplied by the Settings slot locale seat. */
export type Translate = (key: string) => string

/** Settings-row props composed by the DSH slot renderer. */
export interface TidyChatRowProps extends TidyChatControllerFace {
  t: Translate
}

const OPTIONS: readonly { id: ChatMode; label: string }[] = [
  { id: 'balanced', label: 'mode.balanced' },
  { id: 'compact', label: 'mode.compact' },
  { id: 'original', label: 'mode.original' },
]

/**
 * Render the Settings → General preference row.
 * @param props - Locale and controller faces supplied by the slot entry.
 * @returns The preference row.
 */
export function TidyChatRow({ t, getMode, setMode, subscribe }: TidyChatRowProps) {
  const mode = useSyncExternalStore(subscribe, getMode, getMode)
  return (
    <div className="dsh-chat-tidy-settings">
      <div className="dsh-chat-tidy-settings__copy">
        <div className="dsh-chat-tidy-settings__title">{t('settings.title')}</div>
        <div className="dsh-chat-tidy-settings__description">{t('settings.description')}</div>
      </div>
      <div
        className="dsh-chat-tidy-settings__modes"
        role="group"
        aria-label={t('settings.groupLabel')}
      >
        {OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            className="dsh-chat-tidy-settings__mode"
            data-selected={mode === option.id || undefined}
            aria-pressed={mode === option.id}
            onClick={() => { setMode(option.id) }}
          >
            <span>{t(option.label)}</span>
            {option.id === 'balanced' && (
              <span className="dsh-chat-tidy-settings__hint">{t('mode.balanced.hint')}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
