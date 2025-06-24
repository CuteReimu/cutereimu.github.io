---
title: git revert -m 撤销合并提交
order: 4
category: 编程日记
tags:
  - Git
icon: b:git-alt
---

在 Git 中，`git revert -m` 命令中的 `-m` 选项（全称 `--mainline`）用于指定撤销合并提交时要保留的主线分支。这个选项**仅在撤销合并提交（merge commit）时**需要用到。

<!-- more -->

::: tip 为什么需要 `-m` 选项？

合并提交（merge commit）有**两个父提交**：
1. **父提交1（parent 1）**：接收合并的分支（通常是主干分支，如 `main/master`）
2. **父提交2（parent 2）**：被合并的分支（如 `feature-branch`）

当撤销合并提交时，Git 需要知道：应该保留哪个父分支的更改，丢弃哪个分支的更改？

:::

对于这样一条revert命令：

```bash
git revert -m <parent_number> <merge_commit_hash>
```

`-m`参数的含义：
- `-m 1`：保留**第一个父分支**（接收合并的分支）的更改，丢弃被合并分支的更改\
  （常用场景：撤销误合并到主干的特性分支）
- `-m 2`：保留**第二个父分支**（被合并的分支）的更改，丢弃主干分支的更改\
  （较少使用，通常用于撤销反向合并）

举个例子，假设你的提交历史如下：

```git-graph
commit id:"A"
commit id:"B"
commit id:"C"
branch feature
commit id:"D"
commit id:"E"
checkout main
merge feature id:"M"
```

图中，`M` 是合并提交，有两个父提交：
- 父提交1：`C`（main 分支的提交）
- 父提交2：`E`（feature 分支的提交）

要撤销这次合并（即丢弃 feature 分支的更改）：

```bash
git revert -m 1 M
```

这里 `-m 1` 明确告诉 Git：保留父提交1（main 分支）的代码状态，丢弃父提交2（feature 分支）引入的所有更改。

完成撤销后，Git会自动生成一个新的提交，该提交抵消了合并引入的更改。再使用`git push`将更改推送到远程仓库即可。

::: note 注意

- 普通提交（只有一个父节点）不需要 `-m` 选项
- 撤销合并提交时如果不加 `-m`，Git 会报错：`error: Commit M is a merge but no -m option was given.`

:::

---

在团队协作中，撤销已推送到远程的**合并**提交时，**始终使用**`git revert -m 1 <merge_commit_hash>`，这是最安全且可追溯的方式。