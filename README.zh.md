# dsh-chat-tidy

Tidy Chat 用来改善 DeepSeek Harness Web 对话页的排版节奏。它会收敛字体层级、消息宽度、段落间距、用户气泡、Agent 活动行和输入框，但保留 DSH 原有的 Markdown 渲染、主题、工具调用、推理内容和会话行为。

[English](README.md)

## 改善内容

- 标题使用更克制的 21 / 18 / 16 px 层级，不再像普通 Markdown 文章那样忽大忽小。
- 推荐模式的正文统一为 15 px / 25 px。
- 收紧段落、列表、代码块、表格、工具行和回合之间的垂直间距。
- 阅读区略微加宽并保持居中，输入框降低膨胀感。
- 支持窄屏、浅色、深色和基于 DSH token 的第三方主题。
- 在**设置 → 通用 → 聊天排版**中提供「平衡」「紧凑」「原始」三种模式。

首次安装默认启用「平衡」。选择「原始」即可立即恢复 DSH 原始排版，不需要卸载插件。

## 设计边界

Tidy Chat 是展示层插件，不是另一套聊天客户端。它不会：

- 重新解析或清洗 Markdown；
- 替换 `conversation.chat.node` 渲染器；
- 隐藏推理、上下文注入或工具调用；
- 使用 MutationObserver 改写 React DOM；
- 修改模型输出、会话日志或 Host 数据。

所有样式都受 `body[data-dsh-chat-tidy]` 和 DSH 语义锚点约束，包括 `data-chat-flow`、`data-chat-flow-kind`、`data-disclosure-row` 与 `data-composer-card`。颜色继续使用 `--dsw-*` token，因此内置主题和 token 型主题插件仍然拥有配色控制权。精确字号与生命周期见 [DESIGN.md](DESIGN.md)。

## 安装

从社区目录安装：

```sh
dsh plugin --profile web add github:ChuanTianML/dsh-chat-tidy
```

重启 `dsh web`，然后打开**设置 → 通用 → 聊天排版**。

GitHub 仓库已经包含校验过的 Host 与 Client 构建产物，安装时不需要执行依赖构建脚本，也不需要修改 pnpm 的 `allowBuilds` 策略。

本地开发安装：

```sh
dsh plugin --profile web add -w /absolute/path/to/dsh-chat-tidy
```

Web profile 本身是 pnpm workspace 根目录，因此本地路径安装需要 `-w`。

## 三种模式

| 模式 | 正文 | 标题 | 内容宽度 | 用途 |
| --- | --- | --- | --- | --- |
| 平衡 | 15/25 | 21/18/16 | 760 px | 推荐的日常阅读模式 |
| 紧凑 | 14/23 | 19/17/15 | 820 px | 较长的技术会话 |
| 原始 | DSH 默认 | DSH 默认 | DSH 默认 | 一键回退或对照 |

选择结果保存在当前浏览器的 `dsh-chat-tidy:mode`。即使浏览器禁止 localStorage，页面也会继续使用仅当前会话有效的「平衡」模式，不会阻断 DSH 启动。

## 兼容性

- **DSH 内置浅色/深色主题：**支持。
- **dsh-skin：**兼容；Tidy Chat 负责几何与排版，dsh-skin 负责颜色。
- **dsh-ux：**两个插件都会修改聊天字号和流间距，建议只启用其中一个布局插件，以免规则竞争。
- **其他对话视图：**只有复用 DSH 语义 chat-flow 锚点的视图才会应用 Tidy Chat 样式。

当前版本面向 DSH `>=0.1.0-rc.6`。如果未来 DSH 删除某个语义锚点，对应规则会自然失效，不会阻断页面渲染。

## 开发与验证

需要 Node `^22.19` 或 `>=24`，以及 pnpm 11。

```sh
pnpm install
pnpm run check
pnpm run pack:check
```

`pnpm run check` 会执行严格类型检查、ESLint、Vitest、Host/Client 双端构建与生成产物新鲜度检查。测试覆盖偏好值校验、存储失败、跨标签页同步、样式引用计数、设置项可访问性、slot 注册和完整卸载清理。

0.1.0 的真实 Web profile 安装验证与浏览器测量结果见 [VALIDATION.md](VALIDATION.md)。

## 隐私与安全

插件不会发起网络请求，只在 localStorage 保存排版模式。安全问题请按 [SECURITY.md](SECURITY.md) 的方式报告。

## 许可证

MIT
