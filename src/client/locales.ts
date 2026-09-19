/** Copy follows the Harness locale; timers are excluded from live announcements. */
export const en = {
  working: 'Working', waiting: 'Waiting for you', worked: 'Worked', stopped: 'Stopped', failed: 'Failed', details: 'Work details',
  elapsed: '{state} for {duration}', ended: '{state} after {duration}', timed: '{state} · {duration}', thoughts: 'thought', command: 'ran a command', file: 'worked with a file', search: 'performed a search', webOnce: 'used the web', commands: 'ran {count} commands', files: 'worked with {count} files',
  searches: 'performed {count} searches', web: 'used the web {count} times', separator: ', ', join: ' and ',
  show: 'Show work details', hide: 'Hide work details', showActivity: 'Show activity', hideActivity: 'Hide activity',
}

/** Simplified Chinese dictionary. */
export const zh: Record<keyof typeof en, string> = {
  working: '工作中', waiting: '等待你的操作', worked: '已完成', stopped: '已停止', failed: '发生错误', details: '工作过程',
  elapsed: '{state} · {duration}', ended: '{state} · {duration}', timed: '{state} · {duration}', thoughts: '思考', command: '运行了 1 条命令', file: '处理了 1 个文件操作', search: '进行了 1 次搜索', webOnce: '使用了网页工具', commands: '运行了 {count} 条命令', files: '处理了 {count} 个文件操作',
  searches: '进行了 {count} 次搜索', web: '使用了 {count} 次网页工具', separator: '、', join: '，',
  show: '展开工作过程', hide: '收起工作过程', showActivity: '展开活动详情', hideActivity: '收起活动详情',
}

/** Namespace-bound translation provided by the host locale service. */
export type Translate = (key: keyof typeof en, params?: Record<string, unknown>) => string

/** Summarize action categories without copying commands, paths or tool output. */
export function activityLabel(thoughts: number, tools: readonly string[], t: Translate): string {
  const categories = new Map<'commands' | 'files' | 'searches' | 'web', number>()
  for (const tool of tools) {
    const category = tool === 'bash' || tool === 'pwsh' ? 'commands'
      : tool === 'glob' || tool === 'grep' ? 'searches'
        : tool === 'web_search' || tool === 'web_fetch' ? 'web' : 'files'
    categories.set(category, (categories.get(category) ?? 0) + 1)
  }
  const singular = { commands: 'command', files: 'file', searches: 'search', web: 'webOnce' } as const
  const labels = [...categories].map(([key, count]) => t(count === 1 ? singular[key] : key, { count }))
  if (thoughts > 0) labels.unshift(t('thoughts'))
  const label = labels.join(t('join'))
  return label.charAt(0).toUpperCase() + label.slice(1)
}
