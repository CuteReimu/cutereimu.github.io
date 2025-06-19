---
title: Redis有序集合（Sorted Set）
icon: database
order: 2
category: 编程日记
tags: 
  - Redis
date: 2024-07-01
---

和 Redis 的集合（Set）类似，有序集合（Sorted Set）也是一组不重复的字符串元素，但每个元素都会关联一个`double`类型的分数（score），Redis 会根据分数对元素进行排序。

有序集合的成员是唯一的，但分数（score）可以重复。

有序集合（Sorted Set）可以很容易地用来实现排行榜、优先队列等功能。

<!-- more -->

常用的命令有：

```redis :no-line-numbers :no-collapsed-lines
-- 插入 member1，分数为 100，如果存在则更新分数
ZADD key 100 member1

-- 将member1 的分数增加 100，如果不存在则插入
ZINCRBY key 100 member1

-- 删除 member1
ZREM key member1

-- 计算在有序集合中指定区间分数的成员数
ZCOUNT key 100 200

-- 返回有序集合的成员数量
ZCARD key

-- 获取成员的索引
ZRANK key member1

-- 获取成员的从大到小排名
ZREVRANK key member1

-- 获取成员的分数
ZSCORE key member1

-- 通过索引范围获取成员，其中 WITHSCORES 选项表示会返回成员的分数
ZRANGE key 0 -1 WITHSCORES

-- 通过分数从高到低排序，返回指定排名范围成员，其中 WITHSCORES 选项表示会返回成员的分数
ZREVRANGE key 0 10 WITHSCORES

-- 通过分数从高到底排序，返回指定分数区间的成员，其中 WITHSCORES 选项表示会返回成员的分数
ZREVRANGEBYSCORE key 200 100 WITHSCORES
```

还有一些命令，例如`ZINTERSTORE`、`ZLEXCOUNT`、`ZRANGEBYLEX`、`ZRANGEBYSCORE`、`ZREMRANGEBYLEX`、`ZREMRANGEBYRANK`、`ZREMRANGEBYSCORE`、`ZUNIONSTORE`、`ZSCAN`等不常用的操作，这里就不一一列举了。
