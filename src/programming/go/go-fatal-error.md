---
title: Go无法捕获的异常
icon: b:golang
order: 9
category: 编程日记
tags: 
  - Go
date: 2025-08-06
---

在Go语言中，尽管许多`panic`可以通过`recover()`函数来捕获并处理，但依然存在一些特定情况下引发的异常是无法被捕获的。本文将探讨几种常见的无法通过常规手段恢复的错误情形及其原因。

## 并发相关问题

### 并发读写`map`

当尝试同时从多个协程读取和修改同一个`map`时，如果没有适当的同步机制（如使用互斥锁），则会触发运行时错误。

```go
m := make(map[int]int)
go func() { for { m[1] = 1 } }()
go func() { for { _ = m[1] } }()
```

**错误信息**：`fatal error: concurrent map read and map write`或者`fatal error: concurrent map writes`

::: note 注意

开启了`-race`参数后，更多潜在的竞争条件会被发现并导致程序崩溃。

:::

---

### 使用`nil`函数启动协程

如果试图使用一个值为`nil`的函数启动新的协程，则会导致致命错误。

```go
var f func()
go f()
```

**错误信息**：`fatal error: go of nil func value`

---

### 对未加锁的`Mutex`调用`Unlock`

当尝试解锁一个尚未锁定或已经解锁的互斥锁时，同样会产生致命错误。

```go
var mu sync.Mutex
mu.Unlock()
```

**错误信息**：`fatal error: sync: unlock of unlocked mutex`

## 内存管理问题

以下是一些与内存相关的常见致命错误：

- 栈溢出（Stack overflow）
- 内存溢出（OOM）
- 单个协程超出最大堆栈限制

例如，递归调用自身直到耗尽所有可用栈空间会导致栈溢出

```go :no-line-numbers
func f() {
    f()
}

func main() {
    f()
}
```

**错误信息**：`fatal error: stack overflow`

下文中的[`runtime.SetFinalizer`](#不当设置runtime-setfinalizer)中也列举了一个内存泄漏的例子。

## 底层库的错误使用

### 错误地使用`unsafe`包

不恰当地操作底层数据结构可能会引起分段错误或其他严重问题，特别是当涉及到静态存储区域时。

示例代码如下：

```go
package main

import (
	"fmt"
	"strings"
	"unsafe"
)
var _ = strings.Join

type SliceHeader struct {
	Data unsafe.Pointer
	Len  int
	Cap  int
}

type StringHeader struct {
	Data unsafe.Pointer
	Len  int
}

func String2ByteSlice(str string) (bs []byte) {
	strHdr := (*StringHeader)(unsafe.Pointer(&str))
	sliceHdr := (*SliceHeader)(unsafe.Pointer(&bs))
	sliceHdr.Data = strHdr.Data
	sliceHdr.Len = strHdr.Len
	sliceHdr.Cap = strHdr.Len

	return
}

//var Golang = strings.Join([]string{"Go", "lang"}, "") // 这样就不会导致崩溃，因为不在静态存储区
var Golang = "Golang"                                   // 在静态存储区，会导致崩溃

func main() {
	var goland = String2ByteSlice(Golang)
	goland[5] = 'd' // fatal error: unexpected fault address // [!code error]
	fmt.Printf("%s\n", goland)
}
```

### 不当设置`runtime.SetFinalizer`

虽然可以通过`SetFinalizer`为对象指定清理逻辑，但这并不等同于析构函数。如果依赖此功能来确保资源正确释放，则可能遇到问题。

例如：创建包含循环引用的对象组可能导致垃圾回收器无法正常工作，从而造成内存泄露。

```go :no-collapsed-lines
func memoryLeaking() {
	type T struct {
		v [1<<20]int
		t *T
	}

	var finalizer = func(t *T) {
		 fmt.Println("finalizer called")
	}

	var x, y T

	// 此SetFinalizer函数调用将使x逃逸到堆上。
	runtime.SetFinalizer(&x, finalizer) // [!code warning]

	// 下面这行将形成一个包含x和y的循环引用值组。
	// 这有可能造成x和y不可回收。
	x.t, y.t = &y, &x // y也逃逸到了堆上。 // [!code warning]
}
```

## 缺乏活动的协程

最后一种情况是所有活跃的协程都处于阻塞状态或者已经结束执行，此时整个程序将会崩溃。

这种情况通常发生在所有协程因为等待通道消息、执行`select`语句而阻塞，或是被显式调用了`runtime.Goexit()`方法而结束时。
