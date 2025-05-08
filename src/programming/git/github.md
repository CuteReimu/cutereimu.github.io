---
title: Github小技巧
order: 2
category: Github
tags:
  - Git
  - GitHub
icon: b:github
---

## 为提交增加合作作者

引自：[Github文档](https://docs.github.com/zh/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/creating-a-commit-with-multiple-authors)

> 在提交消息的下一行，根据每个共同作者的特定信息键入 `Co-authored-by: name <name@example.com>`。 在合作作者的信息后面，添加一个右引号。
> 
> 如果要添加多个共同作者，请为每个共同作者键入一个 `Co-authored-by: `。 不要在每个合著者行之间添加空白行。
> 
> ```
> Refactor usability tests.
>
> Co-authored-by: NAME <NAME@EXAMPLE.COM>
> Co-authored-by: ANOTHER-NAME <ANOTHER-NAME@EXAMPLE.COM>
> ```

## 获取提交的补丁文件

一般情况下，在Github上查看一个提交，url应该是：`https://github.com/:name/:repo/commit/:sha`，我们可以在后面加上`.patch`，就可以得到这个提交的补丁文件了。

## 提交自定义信息

```bash
git commit --author="example <example@example.com>" --date="Mon, 02 Jan 2006 15:04:05 +0800"
```

## 比较提交

链接是：`https://github.com/:name/:repo/compare/:aaa...:bbb`，表示比较`aaa`到`bbb`的差异。

中间可以使用两个点，也可以使用三个点，区别是：

- 两个点是比较所有的差异。
- 三个点主要用于将`:bbb`合并到`:aaa`。存在于`:bbb`但不存在于`:aaa`的提交会显示出来，而反过来的差异不显示。

其中，`:aaa`和`:bbb`支持的内容如下：
- 分支(branch)名
- 标记(tag)名
- 提交(commit)的SHA代码

特殊用法：
- 跨用户比较时，在前面加上`用户名:`
- 如果跨用户且仓库名不同，在前面加上`用户名:仓库名:`
- 如果想要取前一个提交，则用`^`，例如`aaaaaaa^`表示取`aaaaaaa`的前一个提交，支持连续多个`^`
- 如果想要取前`n`个提交，则用`~n`，例如`aaaaaaa~5`表示取`aaaaaaa`的前5个提交。
