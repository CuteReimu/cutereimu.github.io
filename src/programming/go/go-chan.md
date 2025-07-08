---
title: go 通道的使用技巧
icon: b:golang
order: 8
category: 编程日记
tags: 
  - Go
date: 2025-07-05
---

## 将通道用做计数信号量（counting semaphore）

计数信号量经常被使用于限制最大并发数。缓冲通道可以被用做计数信号量。例如下面这个例子：

```go :no-collapsed-lines
package main

import (
    "log"
    "math/rand/v2"
    "time"
)

func main() {
    seats := make(chan int, 10)
    for i := range cap(seats) {
        seats <- i // 初始化10个信号量
    }

    for c := range 10000 {
        go func(c int) {
            i := <- seats // 获取一个信号量，如果没有可用的信号量，则会阻塞
            log.Print("++ 消费者#", c, "获取到了信号量#", i)
            time.Sleep(time.Second * time.Duration(2+rand.IntN(6)))
            log.Print("-- 消费者#", c, "即将释放信号量#", i)
            seats <- i // 释放信号量
        }(c)
    }
    
    select {}
}
```

在上述示例中，只有获得了信号量的协程才能继续执行，其他协程会被阻塞，直到有信号量可用。这样就实现了对并发数的限制。

尽管协程的开销远比系统线程小得多，但在上述示例中，我们创建了大量的写成，积少成多也是一种资源浪费。我们可以对代码进行如下优化：

```go :no-collapsed-lines {7,8,10,16,20-22}
func main() {
    seats := make(chan int, 10)
    for i := 0; i < cap(seats); i++ {
        seats <- i
    }

    consumers := make(chan int)
    for i := 0; i < cap(seats); i++ {
        go func() {
            for c := range consumers {
                i := <- seats
                log.Print("++ 消费者#", c, "获取到了信号量#", i)
                time.Sleep(time.Second * time.Duration(2 + rand.IntN(6)))
                log.Print("-- 消费者#", c, "即将释放信号量#", i)
                seats <- i // 释放信号量
            }
        }()
    }
    
    for c := range 10000 {
        consumers <- c
    }
    
    select {}
}
```

上述代码将会更高效一些，在程序的生命期内最多只会有10个消费者协程被创建出来。

## 如何优雅地关闭通道

::: important 通道关闭原则

一个常用的使用Go通道的原则是**不要在数据接收方或者在有多个发送者的情况下关闭通道**。换句话说，我们只应该让一个通道唯一的发送者关闭此通道。

:::

我们分为以下情形进行讨论：

- M个接收者和一个发送者。发送者通过关闭用来传输数据的通道来传递发送结束信号
  - 用来传输数据的通道的关闭请求也可以由第三方发出
- 一个接收者和N个发送者，此唯一接收者通过关闭一个额外的信号通道来通知发送者不要再发送数据了
  - 用来传输数据的通道必须被关闭以通知各个接收者数据发送已经结束了
- M个接收者和N个发送者。它们中的任何协程都可以让一个中间调解协程帮忙发出停止数据传送的信号