---
title: "go build 命令的使用技巧"
shortTitle: "build命令的使用技巧"
icon: b:golang
order: 3
category: 编程日记
tags: 
  - Go
date: 2022-02-10
---

```bat
set GOOS=windows
set GOARCH=amd64
go build -ldflags "-s -w -H=windowsgui" -o test.exe
```

<!-- more -->

**参数解释**
- `GOOS` 和 `GOARCH` 是 Go 的环境变量，分别表示操作系统和 CPU 架构。
- `-ldflags` 是链接器的参数，可以用来设置一些链接器的选项。
  - `-s` 表示去掉符号表和调试信息。
  - `-w` 表示去掉 DWARF 调试信息。
  - `-H=windowsgui` 表示将程序编译为 Windows GUI 应用程序，而不是控制台应用程序。换句话说就是：如果不加这个参数，编译出来的程序会有一个控制台窗口，这个参数可以去掉这个控制台窗口。
- `-o` 用来指定输出的文件名。

`-s`和`-w`这两个参数常用于发布版本，可以显著减小二进制文件大小，但会导致无法用调试器调试。

```bat
go build -ldflags "-s -w"
```