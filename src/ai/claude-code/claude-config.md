---
title: Claude Code 配置文件
icon: b:claude
date: 2026-03-26
category: AI
tags:
  - AI
  - Claude Code
order: 1
isOriginal: true
toc:
  levels: 2
---

[原文链接在这里](https://platform.uno/blog/configuring-claude-code-for-real-net-projects/)，翻译过程中我进行了适当调整，使文章能够适合不同语言的项目。AI 发展迅速，请注意本文的时效性。

::: note 要点

Claude Code 开箱即用。但它对你的项目并不熟悉，有时候实现的功能完全不符合预期。**解决方法并非改进 Prompt，而是配置。**

:::

Claude Code 的配置分布在几个文件中。一旦你理解了每个文件的作用，这个工具就能按照你预想的方式运行。需要配置的文件包含以下这些：

| 等级 | 文件                    | 目的              |
|----|-----------------------|-----------------|
| 用户 | `settings.json`       | 基线权限，全局拒绝规则     |
| 用户 | `CLAUDE.md`           | 全局指令、堆栈标识、会话工作流 |
| 项目 | `.mcp.json`           | MCP 服务器注册表      |
| 项目 | `CLAUDE.md`           | 项目说明、架构、文档参考    |
| 项目 | `settings.json`       | 项目权限、钩子         |
| 项目 | `settings.local.json` | 个人权限（不提交）       |

## .claude/

这指的不是某个配置文件，而是一个文件夹，其中包含`settings.json`和`settings.local.json`等文件。你可以类比`.vscode/`或者`.idea/`。它存在于两个层级：`~/.claude/`用户级和`your-repo/.claude/`项目级。

## settings.json

规则引擎。它控制着 Claude Code 的权限：它可以读取或写入哪些文件，可以运行哪些 bash 命令，以及哪些操作会被禁止。

你还可以配置钩子：在特定操作后自动触发的命令（例如每次 Claude 写入文件时执行一个命令）。

它位于项目目录下的`.claude/settings.json`中，是一个项目级规则，而`~/.claude/settings.json`是全局默认值。提交项目目录下的那个文件，供团队成员共享。

## settings.local.json

格式相同，功能相同，但不应被提交。Claude Code 将会自动 “gitignore” 它。这里存放的是特定于你本地的环境变量、API 密钥和实验性权限。这些东西你不想分享给团队其他成员。

在优先级链中，本地配置优先。如果共享配置禁止某项操作，而本地配置允许，则本地配置优先。

企业级策略仍然优先于所有其他策略。

## CLAUDE.md

`CLAUDE.md`是一个自由格式的 Markdown 文件，Claude Code 会在每次会话开始时读取它。没有模式，也没有强制机制。只有用浅显易懂的语言编写的指导，用来塑造智能体的思维方式。

但它必须保持简洁。Claude Code 会将你的`CLAUDE.md`封装在一个系统提醒中，告诉模型忽略与当前任务无关的指令。随着指令数量的增加，Claude 不仅会忽略新增的指令，还会统一忽略所有指令。普遍认为指令长度应少于 300 行。越短越好。

::: warning 注意

**不要在这里编写代码风格规则**。那是`.editorconfig`的用途。Claude 是一个上下文学习器。如果你的代码库遵循某种模式，它会在读取你的文件时自动识别。你应该关注 Claude 无法推断的内容：你的技术栈标识、脚手架规则、框架层面的决策以及工作流程预期。

:::

一些值得一提的模式：
- **每次进行实质性更改后都提交更改**，并附上描述性消息。这样可以轻松回滚。
- **对于复杂的功能，请先编写一个 Markdown 格式的规范文档**。然后创建一个新的会话，根据规范文档进行实现。保持上下文清晰。
- **在会话结束时，让 Claude 总结会话内容**，并提出改进项目文档的建议。持续改进循环。

对于任何不具有普遍适用性的内容（例如数据库模式、组件模式、设计标记），不要直接内联，而是改用链接形式提供。例如，添加一个“开始之前阅读`docs/ARCHITECTURE.md`”的`Key References`章节，既能让 Claude 了解相关内容，又不会增加指令文件的体积。

::: info 逐步披露

告诉 Claude 如何查找信息，而不是全部信息本身。

:::

位置很重要。`~/.claude/CLAUDE.md`全局适用。脚手架规则放在这里，因为创建新项目时，项目目录中还没有配置文件。仓库根目录下的`CLAUDE.md`只适用于该特定项目。项目级规则与用户级规则冲突时，项目级规则优先。

## .mcp.json

在这里，你可以通过模型上下文协议连接外部功能。

其中，**远程服务器**为 Claude Code 提供访问最新文档的权限：文档搜索、文档获取、代理规则和使用最佳实践。**本地应用 MCP** 连接到你正在运行的应用程序，并为代理提供运行时可见性：屏幕截图、可视化树快照、指针点击、键盘输入和元素数据上下文检查。

远程 MCP 帮助你编写符合规范的代码。应用 MCP 则验证代码在运行时是否真正有效。**设计时的知识 vs 运行时的真实情况**。

`.mcp.json`位于项目根目录，而不是`.claude/`目录下。提交更改。当团队成员克隆仓库并打开 Claude Code 时，系统会提示他们批准服务器。之后一切就能正常运行了。

## 快速参考

### 用户级别：~/.claude/

| 文件              | 路径                        | 是否提交 | 目的              |
|-----------------|---------------------------|------|-----------------|
| `settings.json` | `~/.claude/settings.json` | 不提交  | 基线权限，全局拒绝规则     |
| `CLAUDE.md`     | `~/.claude/CLAUDE.md`     | 不提交  | 全局指令、堆栈标识、会话工作流 |

### 项目级别：代码仓库根目录

| 文件                    | 路径                                   | 是否提交 | 目的           |
|-----------------------|--------------------------------------|------|--------------|
| `.mcp.json`           | `my-app/.mcp.json`                   | 提交   | MCP 服务器注册表   |
| `CLAUDE.md`           | `my-app/CLAUDE.md`                   | 提交   | 项目说明、架构、文档参考 |
| `settings.json`       | `my-app/.claude/settings.json`       | 提交   | 项目权限、钩子      |
| `settings.local.json` | `my-app/.claude/settings.local.json` | 不提交  | 个人权限         |

### 完整结构

::: file-tree
- ~
  - .claude
    - settings.json
    - CLAUDE.md
:::

::: file-tree
- my-app
  - .mcp.json
  - CLAUDE.md
  - .claude
    - settings.json
    - settings.local.json
  - docs
    - ARCHITECTURE.md
    - DESIGN-BRIEF.md
  - src/
  - …
:::
