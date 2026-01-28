---
title: 如何查看systemctl日志
order: 3
category: 编程日记
icon: b:linux
tags:
  - Linux
date: 2025-11-17
toc:
  levels: 2
---

查询 `systemctl` 相关的日志，主要使用 `journalctl` 命令，因为 `systemd` 的日志是由 `journald` 来管理的。

## 最基本的命令：查看所有日志

```bash
sudo journalctl
```
这会输出系统从开机到现在所有的 `journald` 收集的日志，内容非常多，通常需要配合过滤条件使用。

## 查看指定服务的日志（最常用）

我们知道，服务是通过 systemd 管理的，而 systemd 的配置文件放置于 `/usr/lib/systemd/system/` 或 `/etc/systemd/system/` 目录内。配置好服务后，只需要执行 `systemctl start <服务名>` 等命令，就可以对服务进行一系列操作（例如启动、停止等）。

如果我们要查看某一个服务的日志，可以使用 `journalctl` 的 `-u` 参数来指定服务名。

```bash :no-line-numbers
# 基本语法
sudo journalctl -u <服务名>

# 示例：查看 nginx 服务的日志
sudo journalctl -u nginx

# 示例：查看 docker 服务的日志
sudo journalctl -u docker
```

## 控制日志输出方式

### 实时滚动查看最新日志（类似 `tail -f`）

在排查问题时，实时查看日志非常有用。

```bash
sudo journalctl -u nginx -f
```

### 查看从本次启动以来的日志

如果怀疑是本次重启后出现的问题，可以只看本次启动的日志。

```bash :no-line-numbers
# 查看指定服务本次启动的日志
sudo journalctl -u nginx -b

# 查看系统本次启动的所有日志
sudo journalctl -b
```

### 分页查看，并支持搜索

`journalctl` 默认会调用分页器（如 `less`），你可以使用 `/` 关键字进行搜索，按 `n` 查找下一个，按 `N` 查找上一个。

```bash
sudo journalctl -u nginx
```

（进入分页器后，输入 `/error` 来搜索 "error" 关键词）

## 按时间筛选日志

### 查看最近一段时间的日志

```bash :no-line-numbers
# 查看最近一小时的日志
sudo journalctl --since="1 hour ago"

# 查看最近一天的日志
sudo journalctl --since="1 day ago"

# 查看指定服务最近30分钟的日志
sudo journalctl -u nginx --since="30 min ago"
```

### 查看指定时间段的日志

```bash :no-line-numbers
# 查看从某个时间点开始的日志
sudo journalctl -u nginx --since="2024-01-01 00:00:00"

# 查看一个时间区间的日志
sudo journalctl -u nginx --since="2024-01-01 00:00:00" --until="2024-01-01 12:00:00"

# 查看昨天的日志
sudo journalctl --since="yesterday" --until="today"
```

## 按日志级别（优先级）筛选

只显示错误、警告等特定级别的信息，可以帮助你快速定位问题。

```bash :no-line-numbers
# 显示所有错误级别的日志
sudo journalctl -p err

# 显示指定服务的警告及以上级别的日志
sudo journalctl -u nginx -p warning
```

常见的级别有（严重程度从高到低）：
- `emerg` (0)
- `alert` (1)
- `crit` (2)
- `err` (3)
- `warning` (4)
- `notice` (5)
- `info` (6)
- `debug` (7)

## 组合使用

假设你的 `myapp.service` 在昨天下午3点后启动失败，你可以这样查：

```bash :no-line-numbers
# 查看该服务昨天下午3点至今的所有错误和警告信息
sudo journalctl -u myapp \
  --since="yesterday 15:00:00" \
  --until="today" \
  -p warning
```

## 配合 `systemctl status` 使用

通常，我们先使用 `systemctl status` 快速查看服务状态和最近的几条日志。

```bash
systemctl status nginx
```

这个命令的输出末尾通常会包含该服务最新的几条日志信息。如果这些信息不够，我们再使用 `journalctl -u nginx` 进行更详细的查看。

## 日志持久化

默认情况下，`journald` 将日志存储在 `/run/log/journal/` 中，这意味着**重启后日志会丢失**。

要启用持久化存储，执行：

```bash
sudo mkdir -p /var/log/journal
sudo systemctl restart systemd-journald
```

之后，日志会永久保存在 `/var/log/journal/` 目录下。
