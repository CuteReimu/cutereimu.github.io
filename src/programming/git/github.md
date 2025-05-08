---
title: Github小技巧
order: 2
category: Github
tags:
  - Git
  - GitHub
icon: b:github
---

<!-- more -->

## 为提交增加共同作者

在提交消息的下一行，加入 `Co-authored-by: name <name@example.com>`。

如果要添加多个共同作者，则为每个共同作者增加一行 `Co-authored-by:`，之间不加空行。

``` :no-line-numbers
提交信息

Co-authored-by: name1 <name1@example.com>
Co-authored-by: name2 <name2@example.com>
```

## 获取提交的补丁文件

一般情况下，在Github上查看一个提交，url应该是：`https://github.com/:name/:repo/commit/:sha`，我们可以在后面加上`.patch`，就可以得到这个提交的补丁文件了。

## 提交自定义信息

```bash
git commit --author="example <example@example.com>" --date="Mon, 02 Jan 2006 15:04:05 +0800"
```

## 比较提交

链接是：`https://github.com/:name/:repo/compare/:aaa...:bbb`，表示比较`:aaa`到`:bbb`的差异。

中间可以使用两个点，也可以使用三个点，区别是：

- 两个点是比较所有的差异。
- 三个点主要用于将`:bbb`合并到`:aaa`。存在于`:bbb`但不存在于`:aaa`的提交会显示出来，而反过来的差异不显示。

其中，`:aaa`和`:bbb`支持的内容如下：
- 分支(branch)名
- 标记(tag)名
- 提交(commit)的SHA代码

特殊用法：
- 跨用户比较时，在前面加上`用户名:`，例如`my_name:master`
- 如果跨用户且仓库名不同，在前面加上`用户名:仓库名:`，例如`my_name:my_repo:master`
- 如果想要取前一个提交，则用`^`，例如`aaaaaaa^`表示取`aaaaaaa`的前一个提交，支持连续多个`^`
- 如果想要取前`n`个提交，则用`~n`，例如`aaaaaaa~5`表示取`aaaaaaa`的前5个提交。
