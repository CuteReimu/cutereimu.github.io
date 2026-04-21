---
title: git log 命令如何筛选
order: 6
category: 编程日记
tags:
  - Git
icon: b:git-alt
date: 2026-04-21
toc: false
---
`git log` 命令是查看 Git 提交历史的强大工具，最常见的是**根据提交信息（commit message）的关键词**来查找提交，这主要通过 `--grep` 选项实现。

除了 `--grep`，`git log` 还提供了其他几种实用的筛选方式，可以灵活组合，精准定位历史记录。

<!-- more -->

### 按提交信息筛选 (`--grep`)

这是最直接对应“commit 内容”的方式，可以在提交信息中搜索特定模式。

**基本用法**：使用 `--grep` 选项搜索包含特定关键词的提交。

```bash
# 搜索提交信息中包含 "fix bug" 的提交
git log --grep="fix bug"
```

`--grep` 参数非常灵活，支持更多高级用法：

- **不区分大小写**：添加 `-i` 参数，让搜索忽略大小写。
   ```bash
   git log --grep="fix bug" -i
   ```

- **组合多个关键词**：可以多次使用 `--grep` 来查找提交信息中包含任意一个关键词的提交。
   ```bash
   # 搜索提交信息中包含 "feature" 或 "enhancement" 的提交
   git log --grep="feature" --grep="enhancement"
   ```

- **要求同时匹配多个关键词**：如果想查找提交信息中包含**所有**指定关键词的提交，可以添加 `--all-match` 选项。
   ```bash
   # 搜索提交信息中同时包含 "auth" 和 "security" 的提交
   git log --grep="auth" --grep="security" --all-match
   ```

- **排除特定关键词**：使用 `--invert-grep` 参数，可以反转匹配，筛选出提交信息中**不包含**指定关键词的提交。
   ```bash
   # 搜索提交信息中不包含 "WIP" 的提交
   git log --grep="WIP" --invert-grep
   ```

- **使用正则表达式**：`--grep` 也支持强大的正则表达式，实现更复杂的模式匹配。
   ```bash
   # 搜索提交信息中引用 "ISSUE-" 后跟数字的提交
   git log --grep='ISSUE-[0-9]+'
   ```

   ::: note 注意

   `git log --grep` 默认使用的正则引擎是**POSIX 基本正则表达式（BRE）**，它的一些规则和我们常用的正则表达式有些出入。不过，Git 也提供了强大的方法来支持更现代的正则语法，我们可以这样操作来启用不同的正则表达式引擎：
   - **POSIX BRE**：`git log --grep` 的默认引擎。它有一些特殊的规则，比如要表示“或”不能直接用 `|`，需要转义成 `\|`；要表示量词比如 `{n,m}` 也需要写成 `\{n,m\}`。
   - **POSIX ERE**：通过 `-E` 或 `--extended-regexp` 启用，语法更符合我们的直觉。
   - **PCRE**：通过 `-P` 或 `--perl-regexp` 启用，支持正则表达式中更高级的功能（如 `\d`、`\s` 和 `?=` 等正向先行断言）。
   - **固定字符串**：通过 `-F` 或 `--fixed-strings` 启用，将模式视为普通字符串进行搜索。

   另外，也可以通过 `git config --global grep.patternType` 永久修改默认的引擎类型。

   :::

### 按其他信息筛选

`git log`也可以按照其它信息筛选，比如作者、时间或具体的代码变更等。

- **按作者/提交者筛选 (`--author`, `--committer`)**：按作者（撰写人）或提交者（将变更提交到仓库的人）过滤。`--author` 非常灵活，支持部分匹配、完整姓名或邮箱地址。
   ```bash
   # 按作者名筛选
   git log --author="John Doe"
   # 按邮箱筛选
   git log --author="john.doe@example.com"
   ```

- **按提交范围/哈希值筛选**：可以指定一个提交范围，或者直接用哈希值定位到某个具体的提交。
   ```bash
   # 查看最近3次提交
   git log -n 3
   # 查看特定哈希值的提交（可以只使用前几位）
   git log 1a2b3c4
   ```

- **按时间筛选 (`--since`, `--until`)**：筛选特定时间范围内的提交。Git 支持多种日期格式，非常方便。
   ```bash
   # 查看最近两周的提交
   git log --since="2 weeks ago"
   # 查看2023年全年的提交
   git log --since="2023-01-01" --until="2023-12-31"
   ```

- **按分支筛选**：如果只关心特定分支的提交，可以直接将分支名作为参数。
   ```bash
   # 查看 dev 分支的提交历史
   git log dev
   ```

- **按文件/目录路径筛选**：查看影响了特定文件或目录的提交。注意要在路径前使用 `--` ，避免路径名与分支名混淆。
   ```bash
   # 查看 README.md 文件的修改历史
   git log -- README.md

   # 查看 src 目录，但是排除其中的 .pb.go 文件
   git log -- src ':!src/*.pb.go'
   ```

- **按代码变更内容筛选 (`-S`, `-G`)**：这是更深层次的筛选，用于查找增加或删除了特定字符串（如函数名、特定代码）的提交。
   ```bash
   # 查找增加或删除了 "some_function" 这个字符串的提交
   git log -S"some_function"
   ```

### 简洁地显示提交历史

如果想将每个提交压缩成一行，简洁地显示提交历史，只需加上 `--oneline` 选项即可。

如果只想看最新的几个提交，可以加上 `-n` 参数，例如 `git log -n 5` 或者 `git log -1`。

### 组合筛选

以上选项都可以灵活组合，形成更精准的查询，让你能高效地定位到目标提交。

```bash
# 示例：查看 John 在 2023 年提交的、包含 "bugfix" 关键词的、对 src/ 目录下文件的修改，并以单行格式显示
git log --oneline --author="John" --since="2023-01-01" --until="2023-12-31" --grep="bugfix" -- src/
```

总的来说，`git log` 的筛选功能非常强大。理解并熟练运用 `--grep`、`--author`、`-S` 等选项，就能高效地定位到任何你想要的提交记录。
