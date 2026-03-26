---
title: claude-mem 安装踩坑
icon: b:claude
date: 2026-03-25
category: AI
tags:
  - AI
  - Claude Code
order: 2
toc: false
---

Claude Code 有个第三方插件叫 [claude-mem](https://claude-mem.ai/)，可以让 Claude 记住之前的对话内容。

整个安装过程按理来说应该是全自动的，但可能会遇到一些坑，下面是我踩过的坑，仅供参考。

<!-- more -->

## 安装插件

**首先，需要确保已经安装了 Node.js 18.0.0 以上版本。**

除此之外，以下两个工具如果没有，在安装插件时会自动安装，一般来说无需单独处理：
- Bun（但我遇到了自动安装失败的情况）
- SQLite 3（内嵌在插件里了）

安装插件的时候，按照官方文档，应该执行：

```claude
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

在安装时，有三个选项：“为本用户安装”、“为本项目安装”、“Local”，一定要选择“**为本用户安装**”，否则后续有些服务可能启动失败。

## 确定是否启动成功

安装成功后，一般来说会正常启动，我们可以检查一下：

```bash
# claude-mem 默认是 37777 端口监听的
curl http://localhost:37777/health
```

如果请求失败了，那就说明启动失败了，可以前往`~/.claude/logs`目录下查看日志，看看是什么原因导致启动失败了。

于是尝试到插件目录下面手动重启：

```bash
cd ~/.claude/plugins/marketplaces/thedotmack
npm run worker:restart
```

结果重启失败了，查看了一下`worker:restart`对应的命令，直接执行：

```bash
bun plugin/scripts/worker-service.cjs restart
```

结果发现原来是`bun`没有安装成功，于是将其安装后再试，还是失败，尝试直接前台启动：

```bash
bun plugin/scripts/worker-service.cjs
```

发现前台能够启动成功。

那大概率是插件安装有问题，于是我卸载后重新安装就好了。至此，worker 总算启动成功了。

## 到底有没有用？

在 Claude Code 中简单进行提问，然后在终端执行以下命令，可以查看到底有没有成功记录记忆：

```bash
sqlite3 ~/.claude-mem/claude-mem.db "SELECT count(*) FROM observations;"
```

结果输出`0`，说明没有成功记录。继续前往前往`~/.claude/logs`目录下查看日志，发现大部分都成功了，但有这样一个日志：

```
[INFO][SDK][session-20] ← Response received (33 chars) {promptNumber=2} Not logged in · Please run /login
```

这就很奇怪了，明明 Claude Code 已经登录了，为什么这里会返回没登录。然后去 claude-mem 仓库下以及网上找了很多原因，都不对。最后终于找到了，在配置文件 `~/.claude-mem/settings.json` 中：

```json
{
  "CLAUDE_MEM_MODEL": "sonnet"
}
```

安装的时候它把 `CLAUDE_MEM_MODEL` 默认填了一个错误的值，导致它一直无法正确连接到 Claude Code，修改为正确的值（例如`sonnet`）后就行了。

除此之外，你还可以修改 `CLAUDE_MEM_MODE` 为 `code--zh`，让它默认使用中文。

修改好之后重启：

```bash :no-line-numbers
# 重启
cd ~/.claude/plugins/marketplaces/thedotmack
npm run worker:restart

# 看看是否有记录了
sqlite3 ~/.claude-mem/claude-mem.db "SELECT count(*) FROM observations;"
```

发现有记录了，说明成功了。