---
title: protoactor-go库的已知问题
icon: b:golang
order: -1
category: 编程日记
tags: 
  - Go
date: 2025-12-31
---

[proto.actor](https://proto.actor/)是一个跨语言的分布式Actor框架，支持多种编程语言，包括Go，也就是[protoactor-go](https://github.com/asynkron/protoactor-go)。虽然它提供了强大的功能，但在使用过程中也存在一些已知问题，这里列出来供参考。

<!-- more -->

具体用法请参考官方问题，这里只简要介绍一下和本文有关的内容。

我们知道，Actor模型的通用做法就是每个Actor都有一个消息队列，发送消息时会将消息放入队列中，Actor会轮询从队列中取出消息进行处理。protoactor-go的实现是有两个队列，一个是`UserMessage`队列，一个是`SystemMessage`队列。每次轮询的时候总会先检查`SystemMessage`队列，如果为空再去检查`UserMessage`队列。换句话说就是，在这个框架下，如果新来了`SystemMessage`是可以“插队”的。

值得一提的是，**轮询`UserMessage`队列的这个方法叫做`InvokeUserMessage`，它接收一个参数，就是待处理的消息，在`run`方法轮询得到了队首的消息后，传入`InvokeUserMessage`方法即可**。这个很重要，下面会提到。我简要摘取一些源码说明这个问题：

```go {23}
func (ctx *actorContext) InvokeUserMessage(md interface{}) {
    if atomic.LoadInt32(&ctx.state) == stateStopped {
        // already stopped
        return
    }
    // ... 一些其它逻辑 ...
    ctx.processMessage(md)
}

func (ctx *actorContext) processMessage(m interface{}) {
    // ... 一些其它逻辑 ...
    ctx.defaultReceive()
}

func (ctx *actorContext) defaultReceive() {
    switch msg := ctx.Message().(type) {
    case *PoisonPill:
        ctx.Stop(ctx.self)
    case AutoRespond:
        // ... 一些其它逻辑 ...
    default:
        // ... 一些其它逻辑 ...
        ctx.actor.Receive(ctx) // 这个就是用户自己实现的 Actor 的 Receive 方法
    }
}
```

源码中可以看出，`InvokeUserMessage`方法会检查一下状态是否为`stateStopped`，然后通过`switch`语句判断一下类型，两个内置类型`*PoisonPill`和`AutoRespond`会有特殊处理，其他的消息类型就会调用用户自己实现的 `Receive` 方法。

当我们停止Actor的时候会发生什么呢？

我们比较常用的停止Actor的方法就是`Poison`，也就是通知Actor停止。这个`Poison`其实就是往队列里发一个消息，它是这个框架预定义的一个消息类型，叫做`PoisonPill`，属于`UserMessage`。当处理到`PoisonPill`消息时，会调用`Stop`方法，这个方法会发一条`Stop`消息，这个`Stop`消息属于`SystemMessage`，所以它会被“插队”到前面去处理。

然后接下来就有个问题，按照正常的逻辑，`Stop`执行的时候应该就已经停止了，不能再继续处理`UserMessage`队列剩余的消息了。protoactor-go的实现是，**不走`run`轮询了，直接调用上面所说的`InvokeUserMessage`，传入一个`*Stopping`消息供用户处理**。我们来看一下源码：

```go {20-21}
// 这个 InvokeSystemMessage 方式用来处理 SystemMessage 队列里的消息
// 同样接收一个参数，就是 run 方法轮询到的队首消息
func (ctx *actorContext) InvokeSystemMessage(message interface{}) {
    switch msg := message.(type) {
    // ... 一些其它逻辑 ...
    case *Stop:
        ctx.handleStop()
    // ... 一些其它逻辑 ...
    }
}

func (ctx *actorContext) handleStop() {
    if atomic.LoadInt32(&ctx.state) >= stateStopping {
        // already stopping or stopped
        return
    }

    atomic.StoreInt32(&ctx.state, stateStopping)

    // 这里直接调用 InvokeUserMessage，交给用户实现的 Receive 方法去处理 Stopping 消息
    ctx.InvokeUserMessage(stoppingMessage)
    ctx.stopAllChildren()
    ctx.tryRestartOrTerminate()
}
```

然后我们还要看一下这个`tryRestartOrTerminate`方法：

```go {10-12,18-19}
func (ctx *actorContext) tryRestartOrTerminate() {
    if ctx.extras != nil && !ctx.extras.children.Empty() {
        return
    }

    switch atomic.LoadInt32(&ctx.state) {
    case stateRestarting:
        ctx.CancelReceiveTimeout()
        ctx.restart()
    case stateStopping: // 上面 handleStop 的方法里把状态改成了 stateStopping，所以肯定会走这个分支
        ctx.CancelReceiveTimeout()
        ctx.finalizeStop()
    }
}

func (ctx *actorContext) finalizeStop() {
    ctx.actorSystem.ProcessRegistry.Remove(ctx.self)
    // 这里直接调用 InvokeUserMessage，交给用户实现的 Receive 方法去处理 Stopped 消息
    ctx.InvokeUserMessage(stoppedMessage)

    // ... 一些其它逻辑 ...

    atomic.StoreInt32(&ctx.state, stateStopped)
}
```

可以看到，它再次**不走`run`轮询，直接调用`InvokeUserMessage`，传入一个`*Stopped`消息供用户处理**，之后又将状态改成`stateStopped`。我们再回顾一下上面的第一个代码段开头，`InvokeUserMessage`方法里有个检查状态的逻辑，如果状态是`stateStopped`，就直接返回了，不会继续处理了。

总结一下就是：
1. 当我们`Poison`了这个Actor时，会往`UserMessage`队列里发一个`PoisonPill`消息。此时Actor还未真正停止，还在持续接收新的消息。
2. 轮询处理到`PoisonPill`消息的时候，会修改Actor状态，并依次把`*Stopping`和`*Stopped`消息直接调用用户实现的 `Receive` 方法去处理。
3. 因为处理完上一步后，Actor状态已经标记为`stateStopped`，因此接下来不会再继续处理`UserMessage`队列里剩余的消息了。

听起来似乎很正确，但这会引发另一个问题。对于同步请求，我们会调用`RequestFuture`方法，它依赖于我们在`Receive`方法里调用`Respond`方法来回复消息，如下：

```go :line-numbers {5}
func (myActor *MyActor) Receive(ctx actor.Context) {
    switch m := ctx.Message().(type) {
    case *SomeRequstMessage:
        result := doSth(m) // 处理请求得到结果
        ctx.Respond(result) // 这里调用 Respond 方法回复消息
    }
}
```

如果没有调用`Respond`方法，那么这个请求就会一直等待下去，直到超时了才会返回错误。根据我们上述分析，如果中途`Poison`了这个Actor，比`PoisonPill`消息晚进入队列的消息，此时还未标记为`stateStopped`，所以判断不是`deadletter`。但根据上面的分析，这些消息实际上不会被处理，也就是永远不会调用`Respond`方法，所以这些消息就会一直等待下去，直到超时了才会返回错误。

---

那么这个问题有办法解决吗？有一个方案，就是使用`Send`方法发送异步消息，利用Go语言的`chan`来自己实现等待操作，不用`RequestFuture`方法了，例如：

```go {6,8,12,20,23}
func RequestSync(myActor *actor.PID, msg any) (any, error) {
    m := &SomeRequstMessage{
		Msg:  msg,
		Done: make(chan any, 1),
	}
    actorSystem.Root.Send(myActor.pid, m) // 使用 Send 方法发送异步消息
    select {
    case ret := <-m.Done: // 对应23行 m.Done <- result
        return ret, nil
    case <-time.After(5 * time.Second):
        return nil, actor.ErrTimeout
    case <-myActor.stopping: // 对应20行 close(myActor.stopping)
        return nil, actor.ErrDeadLetter
    }
}
 
func (myActor *MyActor) Receive(ctx actor.Context) {
    switch m := ctx.Message().(type) {
    case *actor.Stopping:
        close(myActor.stopping)
    case *SomeRequstMessage:
        result := doSth(m)
        m.Done <- result
    }
}
```

我们把`m.Done`一并传进去，在`Receive`处理完后，把结果从`m.Done`这个`chan`里发回调用方即可。对于`Poison`了这个Actor的情况，直接在`Receive`处理`*Stopping`消息时，直接`close(myActor.stopping)`关掉`chan`，这样调用方就能知道这个Actor已经停止了，不会再继续等待了。这就完美利用了`select`语句的特性。此外，由于往`m.Done`中写内容和`close(myActor.stopping)`都是在`Receive`方法中，根据我们上文的分析可知不会并行，因此这个`select`语句触发哪个分支也是可以预期的，不会有时序性问题。
