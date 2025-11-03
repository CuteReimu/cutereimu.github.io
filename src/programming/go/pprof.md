---
title: pprof工具的使用笔记
icon: b:golang
order: 2
category: 编程日记
tags: 
  - Go
toc: false
date: 2025-04-29
---

pprof是Go语言的性能分析工具，可以帮助我们分析程序的性能瓶颈。pprof可以生成CPU、内存、阻塞等多种性能分析报告。

<!-- more -->

通常，我们直接加入如下代码即可开启pprof功能：

```go :no-collapsed-lines {4,11-16} title="main.go"
package main

import (
    _ "runtime/pprof"
    "log/slog"
)

func main() {
    // ... 你的代码 ...
    
    go func() {
	    err := http.ListenAndServe(":6060", nil) // 假设监听端口是6060
	    if err != nil {
            slog.Error("启动pprof失败", "error", err)
        }
	}
	
	// ... 你的代码 ...
}
```

然后我们可以通过访问`http://localhost:6060/debug/pprof`来查看pprof的相关信息。

在页面中我们可以看到pprof支持的功能，例如`allocs`表示对过去的内存分配的采样，对应的地址就是`http://localhost:6060/debug/pprof/allocs`。

需要注意的是，`profile`和`trace`功能需要在地址之后加上`?seconds=30`参数，指定采样的秒数。

---

那么如何将这些数据可视化呢？我们可以使用`go tool pprof`命令来实现。格式如下：

```bash
go tool pprof -http=0.0.0.0:8848 http://localhost:6060/debug/pprof/profile?seconds=30
```

这个就代表获取CPU的性能30秒分析数据，并在8848端口上进行可视化。然后访问`http://localhost:8848`即可查看可视化的结果。`go tool pprof`命令后面的地址可以换成上述任意你想要的功能对应的地址。

如果不加`-http=0.0.0.0:8848`参数，就会在终端中进入pprof的交互模式，你可以在其中输入命令来查看性能数据。

::: caution 易错点

有一个可能踩坑的地方，执行上述命令时有可能会报错：`zsh: no matches found`。如果你是在zsh终端中执行这个命令，因为命令中url后面恰好含有`?`符号，zsh会将其当作通配符处理，导致出错。将最后的url加个引号就可以解决。

:::

::: note 注意

可视化需要一些图形库，例如`graphviz`，如果没有安装，访问`http://localhost:8848`时会报错：

```ansi
[31mFailed to execute dot. Is Graphviz installed?
exec: "dot": executable file not found in $PATH[0m
```

直接使用例如`yum`、`apt`等工具安装即可。

如果只是查看火焰图，则不需要安装`graphviz`，忽略上面的报错，直接访问`http://localhost:8848/ui/flamegraph`即可。

:::

在执行上述命令后，会有提示：

```ansi
Fetching profile over HTTP from http://localhost:6060/debug/pprof/profile?seconds=30
[31mSaved profile in path/to/file[0m
```

注意红字部分，这个`path/to/file`是保存的文件路径。下次你可以直接使用这个文件，查看当时的性能数据，不再需要重新拉取了：

```bash
go tool pprof -http=0.0.0.0:8848 path/to/file
```