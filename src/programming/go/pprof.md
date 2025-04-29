---
title: pprof工具的使用笔记
icon: b:golang
order: 2
category: 编程随笔
tags: 
  - Go
toc: false
star: true
---

pprof是Go语言的性能分析工具，可以帮助我们分析程序的性能瓶颈。pprof可以生成CPU、内存、阻塞等多种性能分析报告。

通常，我们直接加入如下代码即可开启pprof功能：

```go {4,11-16} title="main.go"
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

::: note 注意
可视化需要一些图形库，如果没有安装，会提示安装，直接使用例如`yum`、`apt`等工具安装即可。
:::
