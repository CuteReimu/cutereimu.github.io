---
title: git 如何生成和应用补丁
order: 8
category: 编程日记
tags:
  - Git
icon: b:git-alt
date: 2026-08-25
toc: false
---

Git 可以一键生成补丁文件，补丁文件记录了代码的修改内容，可以方便地在不同的代码库之间传递和应用这些修改。

<!-- more -->

将多个提交打包成一个补丁文件，以及如何应用它，是Git中非常实用的技能，尤其在需要离线分享代码或进行代码审查时。

## 方法一：使用 `git format-patch` + `git am`

git 官方推荐，能完整保留每个提交的作者、日期和提交信息。

`git format-patch` 会为每个提交生成一个独立的 `.patch` 文件。但我们可以通过 `--stdout` 选项将它们合并到一个文件中。

基本命令格式如下：

```bash
git format-patch <commit-range> --stdout > all-changes.patch
```

关键是 `<commit-range>` 参数，它用来指定你想要的提交范围。常见的几种用法有：

*   **最近N次提交**：例如，最近3次提交：
    ```bash
    git format-patch -3 --stdout > last-3-commits.patch
    ```


*   **两个提交之间的所有提交**：包含 commit-B，但不包含 commit-A：
    ```bash
    git format-patch <commit-A>..<commit-B> --stdout > changes.patch
    ```


*   **某次提交之后的所有新提交**：例如，从 `abc123` 之后到当前HEAD的所有提交：
    ```bash
    git format-patch abc123 --stdout > all-after-abc.patch
    ```

::: note 补充说明

如果你不指定 `--stdout`，`git format-patch` 会为范围内的每个提交生成一个单独的 `.patch` 文件。这在应用时，可以使用 `git am *.patch` 来一次性全部应用。

:::

接下来，我们只需要使用 `git am`（apply mailbox）命令就可以应用补丁文件：

```bash
git am -3 all-changes.patch
```

这个命令会读取补丁文件，并依次为每个提交创建新的提交，完整保留作者、日期和提交信息。注意这个`-3`参数，它的意思是让 Git 启用“三方合并”能力，方便使用可视化工具来解决冲突。

## ⚡ 方法二：使用 `git diff` (不保留提交历史)

`git diff` 生成的补丁只包含文件的变动，不包含提交元数据。

```bash
git diff <commit-A> <commit-B> > changes.patch
```

*   **指定两次提交**：`git diff abc123 def456 > diff.patch`
*   **指定两个分支**：`git diff branch1..branch2 > diff.patch`

这里我们要使用 `git apply` 命令来应用补丁文件：

```bash
git apply changes.patch
```

`git apply` 只会修改工作区的文件，**不会自动创建提交**。应用后，你需要手动 `git add` 和 `git commit`。

::: tip 建议

应用前先用 `git apply --check` 检查一下是否能干净地应用，避免冲突。

:::