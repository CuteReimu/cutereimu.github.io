---
title: nohup后台运行与重定向
order: 1
category: 编程日记
icon: b:linux
tags:
  - Linux
---

## 输出重定向

在Linux中，**输出重定向**是将命令的输出重定向到文件或其他设备的过程，用`>`符号来实现。

<!-- more -->

其中：

- `0`表示标准输入（stdin）
- `1`表示标准输出（stdout）
- `2`表示标准错误输出（stderr）
- 直接输入文件名表示输出到文件，想要重定向到前面的`0`、`1`、`2`，需要加上`&`符号。
- `/dev/null`是一个特殊的设备文件，表示空设备，任何写入到它的数据都会被丢弃。
- `/dev/zero`是一个特殊的设备文件，表示零设备，读取它会无限返回空(`0x00`)。（一般用于输入重定向）

那么我们就有：

```bash :no-line-numbers
# 将ll命令的标准输出和标准错误输出分别重定向到文件
ll 1>info.txt 2>error.txt
# 其中的1可以省略，就是我们常见的形式
ll >info.txt
# >表示覆盖文件，>>表示追加到文件后面
ll >>info.txt
# 将ll命令的标准错误输出重定向到标准输出
ll 2>&1
```

## nohup后台运行

`nohup`命令用于在Linux中后台运行一个命令，并且使其在用户退出后继续运行，它的英文全称是no hang up（不挂起）。格式如下：

```bash :no-line-numbers
nohup go run main.go &
```

其中的`&`表示将命令放到后台运行。

`nohup`命令会将命令的标准输出和标准错误输出重定向到`nohup.out`文件中。如果`nohup.out`文件不可写，输出重定向到`$HOME/nohup.out`文件中。

如果想要将输出重定向到其他文件，可以使用上文的`>`符号：

```bash :no-line-numbers
nohup ./main >output.log 2>&1 &
```

想要停止运行，首先要使用`ps aux | grep`命令查找进程的PID，然后使用`kill`命令停止进程。
