# dsh-chat-tidy

先看答案，需要时再展开工作过程。

Tidy Chat 为 DeepSeek Harness Web 提供受 Codex 启发的工作过程折叠、实时计时、紧凑排版和完整的 Markdown 表格样式。原有的 Think 和工具卡片仍然保留，可以逐层展开查看。

[English](README.md)

## Tidy Work · 0.4.0 新功能

- **工作中：** 顶部显示“工作中”和已用时间。进度说明保持可见，连续的思考和受支持的工具调用归入可展开的活动摘要。
- **完成后：** 默认收起中间过程，保留最终答案。点击“已完成”展开整轮，再展开活动组和原生卡片，即可查看详细内容。
- **需要关注时：** 失败的工具调用、中断后的输出、审批和提问界面、未知工具及第三方内容保留可见。只有正常完成、能确认最终答案且有起始时间的回合，才会默认收起。

计时来自会话记录中的开始与结束时间，刷新后仍能恢复真实时长，不会把并行工具的耗时相加。手动展开的选择会在插件运行期间保留，切换会话或收到新内容不会重置。如果正在选择文字或操作原有卡片，完成时不会突然收起正在阅读的内容。

界面文案跟随 Harness 的中英文设置，支持键盘操作、可见焦点和减少动态效果。

### 实际效果

**工作中：** 顶部显示耗时，进度说明保持可见。

![运行中的计时与活动摘要](docs/images/tidy-work-working.png)

**完成后：** 中间过程收进一行，最终答案留在页面上。

![完成后收起过程，保留最终答案](docs/images/tidy-work-completed.png)

**查看详情：** 逐级展开，仍然使用 Harness 原有的 Think 和工具卡片。

![展开后的进度说明与原生工具卡片](docs/images/tidy-work-expanded.png)

以上均为独立本地环境中真实 Harness Web 页面的 Chrome 原始截图。对话、命令和结果均为演示数据，不含私人对话、凭据或个人路径。运行中的示例使用本地无密钥适配器，不代表真实模型性能。复现方式见[截图夹具](integration/README.md)。

## 更适合对话的排版

![应用 Tidy Chat 的 DSH Web 对话页面](docs/images/hero.png)

正文使用 14 / 22 px，标题采用 600 字重，段落间距为 11 px，保留 Harness 原有的 748 px 阅读栏。排版指标来自 Codex 桌面端测量，详细对照见 [DESIGN.md](DESIGN.md)。

### Tidy Tables

表格拥有圆角边框、主题色表头和行列分隔线，单元格内边距为 8 × 12 px。短表格填满阅读栏，宽表格保留横向滚动，不改写内容或对齐方式。

![Tidy Tables 生效前后对比](docs/images/tidy-tables.png)

## 安装

```sh
dsh plugin --profile web add dsh-chat-tidy
```

也可以从 GitHub 安装：

```sh
dsh plugin --profile web add github:ChuanTianML/dsh-chat-tidy
```

重启 `dsh web` 并刷新页面即可生效。仓库已提交验证过的构建产物，GitHub 安装无需额外执行依赖构建脚本。

本地开发版：

```sh
dsh plugin --profile web add -w /absolute/path/to/dsh-chat-tidy
```

## 工作方式与兼容性

插件通过公开的会话插槽订阅状态，在原生页面的语义锚点上添加展示控件。不会替换 Chat 视图、移动或复制原生 React 节点，也不会修改模型输出和会话日志。插件在本机读取会话投影来识别回合及最终回答，不发起网络请求，不写入浏览器存储。

禁用或卸载后，所有原始内容恢复显示，控件、监听器、计时器和样式同时移除。没有额外的设置开关；展开选择只保存在内存中，刷新页面后重置。

当前活动分组支持思考，以及原生 `bash`、`pwsh`、`read`、`write`、`edit`、`glob`、`grep`、`web_search`、`web_fetch` 工具。其他工具保持原有展示。缺失语义锚点时，对应内容继续可见。

- 面向提供公开 Chat 投影及会话标题工具插槽的 DSH `>=0.1.0-rc.6`。
- 颜色沿用 Harness 的主题变量，支持浅色、深色和基于这些变量的主题插件。
- 多个排版插件的样式可能相互覆盖，建议只启用一个。
- 工作过程折叠仅作用于原生 Chat 流，其他会话视图保持原样。

## 开发与验证

需要 Node `^22.19` 或 `>=24`，以及 pnpm 11。

```sh
pnpm install
pnpm run check
pnpm run pack:check
DSH_HARNESS_ROOT=/absolute/path/to/deepseek_harness pnpm run test:harness
```

最后一项检查需要已构建的 Harness 仓库：通过真实 ModuleLoader 加载双方的浏览器产物，在 jsdom 中运行无密钥集成测试；临时测试文件在结束后清理。页面外观另行进行浏览器验收。

验证记录见 [VALIDATION.md](VALIDATION.md)，安全问题报告方式见 [SECURITY.md](SECURITY.md)。MIT 许可。
