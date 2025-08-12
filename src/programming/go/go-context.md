---
title: context 包的使用
icon: b:golang
order: 10
category: 编程文章
tags: 
  - Go
date: 2025-08-10
---

我们在使用Go标准库以及一些第三方库时，经常看到需要传入一个`context.Context`类型的参数。Context 一词翻译过来叫做“上下文”，但在Go语言中，它到底有什么用，应该怎样用呢？

## 如何停止线程/协程？

我们就以之前聊到的 [五子棋AI](../gobang/gobang4.md#缓存的用途) 为例：

> 假设我们计算6步棋花了数秒钟，但是计算8步棋花了1分钟还没算出来，就可以提前返回计算6步的策略了。

这段话看似简单，实则涉及到并发编程的一个问题：提前返回后，8步棋的计算仍在进行，这样会持续浪费资源，如何将其停掉呢？

<!-- more -->

首先我们想到的方案是，把这个8步棋的计算线程/协程停掉不就行了。但是，真的可以直接停掉吗？事实上，所有主流语言中，都**不能在某个线程/协程中主动直接停掉另一个线程/协程**。

以Java为例，我们在[官方文档](https://docs.oracle.com/en/java/javase/24/docs/api/java.base/java/lang/doc-files/threadPrimitiveDeprecation.html)中可以找到这样一个问题：

::: info 为什么 `Thread.stop` 被弃用，不能用于停止线程？

因为它在本质上是不安全的。停止一个线程会导致该线程解锁它已锁定的所有监视器。（当 `ThreadDeath` 异常在调用堆栈中向上传播时，监视器会被解锁。）如果之前受这些监视器保护的任何对象处于不一致状态，其他线程就可能观察到这些处于不一致状态的对象。此类对象被称为<i>受损（damaged）</i>对象。当线程操作受损对象时，可能导致任意行为。这种行为可能是微妙且难以检测的，也可能是非常显著的。与其他未检查异常不同，`ThreadDeath` 会静默地杀掉线程；因此，用户无法收到程序可能已损坏的警告。这种损坏在实际损害发生之后的任何时间都可能显现出来，甚至可能在数小时或数天之后。

:::

举个很简单的例子，如果我们在线程A使用了`Lock`加锁，正常来讲应当在合适的时机使用`Unlock`来解锁。而如果我们在线程B调用`stop`方法强制停止线程A，是无法确认线程A到底有没有已经执行`Unlock`方法的，一旦没有，这个锁将永远得不到释放。为了防止这样的错误，设计者从语言层面上已经不支持强制停止线程的操作了。

那么，对于这样的需求，我们应当怎么实现呢？Java也提供了一个合适的方案：

```java :no-collapsed-lines {4,6-10,17} title="Main.java"
public class Main {
    public static void main(String[] args) {
        Thread thread = new Thread(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                // 。。一些业务逻辑。。
                try {
                    Thread.sleep(1000); // 休眠1秒
                } catch (InterruptedException e) {
                    break;
                }
                // 。。一些业务逻辑。。
            }
        });
        thread.start(); // 启动线程

        // 在需要的时候可以调用 interrupt 方法来中断线程
        thread.interrupt();
    }
}
```

我们观察代码中的高亮行，第17行调用`interrupt`方法，会给该线程设置一个中断标志，第4行的`isInterrupted`方法会判断这个中断标志，当中断标志被设置了，则会跳出`while`循环。

除此之外，第7行`sleep`阻塞1秒的过程中，如果调用了`interrupt`方法，`sleep`阻塞会立即结束并抛出`InterruptedException`异常，被下一行的`catch`语句捕获住，从而`break`跳出循环。

而Go语言中是没有`throw`和`catch`的，语言设计层面也不建议使用`panic`和`recover`来处理正常的业务逻辑。于是，Go语言就设计了`context`包来处理这种情况。

## Go语言的`context`包

对于上文中的这个例子，我们使用Go语言来实现就是这样的：

```go :no-collapsed-lines {9-13,15-19,25} title="main.go"
package main

import "context"

func main() {
    ctx, cancelFunc := context.WithCancel(context.Background())
    go func() {
        for {
            select {
            case <-ctx.Done(): // 检查上下文是否已经结束
                return
            default:
            }
            // 。。一些业务逻辑。。
			select {
			case <-time.After(time.Second): // 阻塞一秒，如果一秒时间到了则逻辑继续
			case <-ctx.Done(): // 如果一秒时间还未到，上下文就结束了，则跳出循环
                return
			}
            // 。。一些业务逻辑。。
        }
    }()
    
    // 在需要的时候可以调用 cancelFunc 函数来结束上下文
    cancelFunc()
}
```

代码中的高亮行和上文的Java代码中的高亮行一一对应，比较容易理解，这里就不详细讲解了。

::: note 题外话

1. 顺带一提的是，我们在Go例子中使用的是`return`而不是`break`，这是因为外层用了`select`语句，如果使用`break`只会跳出`select`语句而不是跳出更外层的`for`循环。
2. 第16行`time.After`启动的定时器如果还未触发，这个协程就`return`了，这个定时器将不再被引用，理应被垃圾回收。在 Go 1.23 之前，它并不会被垃圾回收，仍然占用资源，直到计时器触发后才能被回收。从 Go 1.23 之后，对于这种情况，Go语言对其进行了优化，我们不再需要手动停止这个计时器，即使它不触发，也会被垃圾回收，因此**我们只需要简单地使用`time.After`即可**。

:::

`context`包中最常用使用的函数有：

- `context.Background()`和`context.TODO()`：用来生成一个空的上下文，它永远不会被停止。
- `context.WithDeadline`、`context.WithCancel`、`context.WithTimeout`等：用来创建一个在某些特定的情况下会结束的上下文。
- `context.WithValue`：用来创建一个附带一些信息的上下文。
- 在较新版本Go中，还新增了一些其它方便的函数或方法，例如`context.AfterFunc`，方便我们使用。

我们在使用一些库提供的函数时，经常需要传入`context.Context`类型的参数，例如`http.NewRequestWithContext`，这个参数就是用来自定义上下文的结束条件，方便提前结束请求，直接返回`error`。

::: tip `context.Background()`和`context.TODO()`的区别

`context.Background()`用于创建一个确定是空的上下文，它永远不会被停止。

而`context.TODO()`顾名思义，就是一个简单的`TODO`。当我们需要传入一个上下文，但是暂时没有确定要传入什么时，一般会临时写一个空的上下文作为占位符，但直接使用`context.Background()`不太合适。此时就应当使用`context.TODO()`，将来在我们确定要传入的上下文后，再将其替换掉。当我们最终完成整个程序的编写后，可以使用一些静态分析工具来检查是否有`context.TODO()`未被替换的情况。

:::