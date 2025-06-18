---
title: Redis阻塞队列操作：BLPOP
icon: database
order: 1
category: 编程日记
tags: 
  - Redis
date: 2025-06-13
---

我们在使用 Redis 时，对 List 数据结构的操作经常使用的是 `LPUSH`、`RPUSH`、`LPOP`、`RPOP` 等命令，这些命令都是非阻塞的。

Redis 还提供了对 List 数据结构的阻塞操作 `BLPOP` 和 `BRPOP`。

命令格式是：

```redis
BLPOP LIST1 LIST2 .. LISTN TIMEOUT
```

其中，`LIST1 LIST2 .. LISTN`是列表的key，支持传入多个列表。`TIMEOUT`是阻塞的超时时间，单位是秒，0表示永久阻塞。这个命令会一直阻塞，直到该key存在且对应的列表不为空，或者达到最大阻塞时间。例如：

```redis
BLPOP list1 100
```

该命令会从列表的头部弹出元素并返回。返回值是一个数组，包含两个元素，这两个元素都是字符串，依次是列表的key和被弹出的元素。如果直到超时该key仍然不存在或者列表为空，则返回`(nil)`。

当传入多个列表的key时，会依次检查每个列表，直到找到第一个非空的列表并弹出元素。如果所有列表都为空，才会进入阻塞。

上面只以`BLPOP`为例，`BRPOP`的用法类似，唯一的区别是它从列表的尾部弹出元素。