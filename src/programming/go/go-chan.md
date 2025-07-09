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

计数信号量经常被使用于限制最大并发数。缓冲通道可以被用做计数信号量。

<!-- more -->

例如下面这个例子：

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

尽管协程的开销远比系统线程小得多，但在上述示例中，我们创建了大量的协程，积少成多也是一种资源浪费。我们可以对代码进行如下优化：

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

## 尝试接收和尝试发送

如下代码，只有一个`case`和一个`default`分支的`select`语句，叫做尝试发送/尝试接收语句，编译器对其进行了优化，会有更高的性能。

```go :no-line-numbers
select {
    case ch <- data:
        doSth()
    default:
}
```

```go :no-line-numbers
select {
    case data2 := <- ch:
        doSth2(data2)
    default:
}
```

## 如何优雅地关闭通道

::: important 通道关闭原则

一个常用的使用Go通道的原则是**不要在数据接收方或者在有多个发送者的情况下关闭通道**。换句话说，我们只应该让一个通道唯一的发送者关闭此通道。

:::

我们分为以下情形进行讨论：

- M个接收者和一个发送者。发送者通过关闭用来传输数据的通道来传递发送结束信号
- 一个接收者和N个发送者，此唯一接收者通过关闭一个额外的信号通道来通知发送者不要再发送数据了
- M个接收者和N个发送者。它们中的任何协程都可以让一个中间调解协程帮忙发出停止数据传送的信号

### M个接收者和一个发送者

第一个情形是最简单的，只需要发送者协程在发送完毕后关闭通道即可，这里不再罗列代码。

值得注意的是，用来传输数据的通道的关闭请求也可以由第三方发出。

### 一个接收者和N个发送者

第二个情形中，很显然不能由接收者直接关闭通道，否则发送者会向已关闭的通道发送数据，导致 panic。我们可以使用一个额外的信号通道来通知发送者停止发送数据。

```go :no-collapsed-lines
package main

import (
	"log"
	"math/rand/v2"
	"sync"
	"time"
)

func main() {
	const Max = 100000
	const NumSenders = 1000

	var wgReceivers sync.WaitGroup
	wgReceivers.Add(1)

	dataCh := make(chan int)
	stopCh := make(chan struct{})

	for i := 0; i < NumSenders; i++ { // 多个发送者
		go func() {
			for {
				select { // 尝试接收，让发送者在接收到停止信号后提前退出
				case <- stopCh:
					return
				default:
				}

				select {
				case <- stopCh:
					return
				case dataCh <- rand.IntN(Max):
				}
			}
		}()
	}

	go func() { // 一个接收者
		defer wgReceivers.Done()

		for value := range dataCh {
			if value == Max-1 {
				close(stopCh)
				return
			}

			log.Println(value)
		}
	}()

	wgReceivers.Wait()
}
```

可以看到，上述代码没有关闭`dataCh`通道，它会在不再被任何协程使用后自动被垃圾回收，我们也就避免了发送者向已关闭的通道发送数据而导致的 panic。

这个情形是非常常见的，例如在处理 TCP 连接时，由多个协程向同一个连接发送数据，一般就需要先写入一个带缓存的通道，然后由一个专门的协程从通道中读取数据并写入 TCP 连接中去。

::: caution 易错点

在 TCP 连接中使用上述代码时，一般会这样写：

```go :collapsed-lines=24
func (conn *Conn) sendData(data []byte) {
    for {
        select {
        case <- conn.stopChan:
            return
        default:
        }

        select {
        case <- conn.stopChan:
            return
        case conn.dataChan <- data:// [!code warning]
        }
    }
}

func (conn *Conn) writeLoop() {
    for {
        data := <- conn.dataChan// [!code warning]
        if _, err := conn.Write(data); err != nil { // 写入数据失败
            conn.Close()
            return
        }
    }
}

func (conn *Conn) Close() {
    conn.closeOnce.Do(func() {
        conn.netConn.Close() // 关闭网络
        close(conn.stopChan) // 关闭 stopChan
    })
}

func NewConn(netConn net.Conn) *Conn {
    return &Conn{
        netConn:   netConn,
        dataChan:  make(chan []byte, 1024), // 带缓存的通道
        stopChan:  make(chan struct{}),
    }
}
```

上述代码中，`writeLoop`是一个专门的协程，用以从`dataChan`通道中读取数据并写入 TCP 连接中去。观察这两行高亮行会发现，前者是向`dataChan`通道中发送数据，后者是从`dataChan`通道中读取数据。

这里就引发了一个问题：在`writeLoop`中，`conn.Write`方法是向网络层写入数据，在实际网络传输中完全有可能阻塞住。一旦这里阻塞了，就不再会持续从`dataChan`通道中读取数据。而业务逻辑代码持续不断调用`sendData`方法向`dataChan`通道中发送数据，这就会导致`dataChan`通道被填满，直到阻塞在`dataCh <- data`这一行，最终业务逻辑代码持续阻塞在这里，导致卡死。

正确做法是增加一个`default`分支来处理通道写入满了的情况，一旦写入满了就说明这个连接出现了问题，可以根据业务需要考虑直接关掉或丢弃本条消息。下文展示了一个直接关掉的例子：

```go :no-collapsed-lines
select {
    case <- stopChan:
        return
    case dataCh <- data:
    default:// [!code ++]
        log.Println("缓冲区已写满，连接可能已断开，关闭连接")// [!code ++]
        conn.Close()// [!code ++]
        return// [!code ++]
}
```

:::

### M个接收者和N个发送者

第三种情形是最复杂的一种情形。我们不能让接收者和发送者中的任何一个关闭用来传输数据的通道，我们也不能让多个接收者之一关闭一个额外的信号通道。

这两种做法都违反了通道关闭原则。

然而，我们可以引入一个中间调解者角色并让其关闭额外的信号通道来通知所有的接收者和发送者结束工作。

具体实现如下：

```go :no-collapsed-lines
package main

import (
	"time"
	"math/rand/v2"
	"sync"
	"log"
	"strconv"
)

func main() {
	const Max = 100000
	const NumReceivers = 10
	const NumSenders = 1000

	var wgReceivers sync.WaitGroup
	wgReceivers.Add(NumReceivers)

	dataCh := make(chan int)
	stopCh := make(chan struct{}) // 关闭用的通道
	toStop := make(chan string, 1) // 额外通道通知第三方协程去关闭stopCh，此通道必须有缓冲区

	var stoppedBy string

	go func() {
		stoppedBy = <-toStop // 这个toStop必须有缓冲区，以防发送者和接收者阻塞在 toStop <-
		close(stopCh)
	}()

	for i := 0; i < NumSenders; i++ { // 发送者
		go func(id string) {
			for {
				value := rand.IntN(Max)
				if value == 0 {
					select {
					case toStop <- "发送者#" + id:
					default:
					}
					return
				}

				select {
				case <- stopCh:
					return
				default:
				}

				select {
				case <- stopCh:
					return
				case dataCh <- value:
				}
			}
		}(strconv.Itoa(i))
	}

	// 接收者
	for i := 0; i < NumReceivers; i++ {
		go func(id string) {
			defer wgReceivers.Done()

			for {
				select {
				case <- stopCh:
					return
				default:
				}

				select {
				case <- stopCh:
					return
				case value := <-dataCh:
					if value == Max-1 {
						select {
						case toStop <- "接收者#" + id:
						default:
						}
						return
					}

					log.Println(value)
				}
			}
		}(strconv.Itoa(i))
	}

	wgReceivers.Wait()
	log.Println("被" + stoppedBy + "终止了")
}
```