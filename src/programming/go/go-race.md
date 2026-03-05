---
title: Go检测代码中的数据竞争风险
icon: b:golang
order: 4
category: 编程日记
tags: 
  - Go
date: 2023-08-17
---

在`go run`、`go test`、`go build`和`go install`命令中都可以使用`-race`参数来检测代码中的数据竞争风险。

```bash :no-line-numbers
go test -race test.go
go run -race main.go
go build -race -o main
go install -race mypkg
```

<!-- more -->

- `-race`会显著增加程序的运行时间和内存使用，因为它需要跟踪所有的内存访问。
- 如果检测到数据竞争，运行时会输出详细的竞争信息，包括代码位置和调用栈。

通过这种方式，你可以有效检测`map`或其他共享资源的并发访问问题。例如：

```go title="main.go"
package main

func main() {
    m := make(map[int]int)
    for range 100 {
        go func() {
            for i := 0; i < 1000; i++ {
                m[i] = i
            }
        }()
    }
    select {}
}
```

上述代码中，多个 goroutine 同时访问和修改同一个`map`，会导致数据竞争，触发`fatal error: concurrent map writes`错误，进程直接崩溃，无法被`recover`。但也有可能不触发竞争，就不会崩溃，留下隐患。

使用`-race`参数运行时，就会输出类似以下的错误信息：

``` :collapsed-lines=12 :no-line-numbers
==================
WARNING: DATA RACE
Write at 0x00c000090000 by goroutine 8:
  runtime.mapassign_fast32()
      /usr/local/go/pkg/mod/golang.org/toolchain@v0.0.1-go1.23.4.darwin-arm64/src/runtime/map_fast32.go:113 +0x34c
  main.main.func1()
      /root/MyTest/main.go:16 +0x44

Previous write at 0x00c000090000 by goroutine 5:
  runtime.mapassign_fast32()
      /usr/local/go/pkg/mod/golang.org/toolchain@v0.0.1-go1.23.4.darwin-arm64/src/runtime/map_fast32.go:113 +0x34c
  main.main.func1()
      /root/MyTest/main.go:16 +0x44

Goroutine 8 (running) created at:
  main.main()
      /root/MyTest/main.go:14 +0x34

Goroutine 5 (running) created at:
  main.main()
      /root/MyTest/main.go:14 +0x34
==================
fatal error: concurrent map writes
```

可以通过修改`GORACE`环境变量来控制数据竞争检测的行为，例如：

```bash
GORACE="log_path=race_log history_size=5" go build -race
```

GORACE 支持的常用配置项如下：

| 选项                        | 说明                                       | 默认值   |
|---------------------------|------------------------------------------|-------|
| `halt_on_error=1`         | 检测到竞态时是否立即停止程序（1 表示停止，0 表示继续运行）          | 1     |
| `exitcode=N`              | 检测到竞态时退出的返回码                             | 66    |
| `strip_path_prefix=STR`   | 输出日志时去掉文件名前缀 STR                         | ""    |
| `log_path=PATH`           | 将 race detector 的日志输出到指定文件路径（默认为 stderr） | ""    |
| `history_size=N`          | 指定 race detector 保存的历史操作数量（影响内存消耗）       | 2^20^ |
| `suppress_equal_stacks=0` | 是否抑制报告相同调用栈上的竞态（1 表示抑制，0 表示不抑制）          | 0     |
| `atexit_sleep_ms=N`       | 检测到竞态后进程退出前等待 N 毫秒（调试用）                  | 0     |

**设置方式示例：**
```bash
GORACE="halt_on_error=0 log_path=./race.log" go run -race main.go
```

**参考文档：**
- [Go 官方文档 - Race Detector](https://golang.org/doc/articles/race_detector.html)
- [Go 源码 runtime/race/race.go](https://github.com/golang/go/blob/master/src/runtime/race/race.go)

<style scoped>
table {
  white-space: nowrap;
}
</style>
