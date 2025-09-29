---
title: Redis命令行读写大数据
icon: database
order: 3
category: 编程日记
tags: 
  - Redis
date: 2025-09-28
toc: false
---

我们知道，在`redis-cli`中使用如`SET`、`GET`等命令可以读写数据。但如果过大（例如一个几百K的字符串），这种方法就有些不方便了。

<!-- more -->

#### 读取数据

```bash :no-line-numbers
# 直接在 redis-cli 后面填写 redis 命令，就可以输出执行结果
# 然后将执行结果重定向到文件中去即可
redis-cli -h xxx -p 6379 -a xxx get key > 1.txt
```

#### 写入数据

这就要用到`redis-cli`的`-x`选项了，它的作用是**从标准输入(stdin)读取数据，用作命令的最后一个参数**。

假设我们已经将数据写入了文件`1.txt`中，现在将其写入数据库：

```bash
cat 1.txt | redis-cli -h xxx -p 6379 -a xxx -x set mykey
```



