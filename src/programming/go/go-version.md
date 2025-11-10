---
title: Go语言版本新特性总结
icon: b:golang
order: 1
category: 编程文章
tags: 
  - Go
date: 2024-05-21
toc: false
---

[[toc]]

## Go 1.25 新特性

参考[https://go.dev/doc/go1.25](https://go.dev/doc/go1.25)

### 语言的变化

- 泛型的优化：移除了“核心类型”概念，回归类型集本质。

```go :no-line-numbers
// 从 Go 1.25 开始，以下语法可以编译通过
type Constraint interface { ~[]byte | ~string }
func Slice[T Constraint](s T) T {
    return s[1:3] // 合法：切片操作对 []byte 和 string 均有效
}
```

### 工具链与开发体验
- `go build -asan` 默认开启 CGo 内存泄漏检测，提高安全性。
- `go.mod` 新增 `ignore` 指令：可忽略部分目录，方便大型多语言仓库管理。
- `go doc -http` 可直接启动本地文档服务器并自动打开浏览器。
- `go version -m -json`：以 JSON 格式输出构建信息，更适合自动化分析。
- 仓库子目录可作为模块根路径，多模块仓库更灵活。
- `go vet` 新增 `hostport`、`waitgroup` 分析器，提高静态检查能力。

### 标准库
- 新增 `testing/synctest` 并发测试包，支持虚拟时钟模拟、协程编排。
- 实验性特性：`encoding/json/v2` ，性能更优，通过环境变量显式启用。
- 加密、文件系统、网络接口等多项优化。
- `sync.WaitGroup.Run` 方法，代替原先的 `Add(1)` + `defer Done()` 的写法，简化并发任务管理。

### 运行时与 GC

- `GOMAXPROCS` 将会自动适配容器 CPU 限制，对于容器环境将会更友好，支持动态调整。
- 实验性特性：`greenteagc` 垃圾回收器，**针对小对象**，大幅度降低 GC 开销。
- `panic`优化：输出更整洁。

### 编译器和链接器

- DWARF 5 调试信息默认开启，内联和逃逸分析进一步优化，编译更快、体积更小，大型项目尤为显著。
- 放弃 macOS 的 10.15/11 支持，Windows arm32 将在下个版本终止支持。

## Go 1.24 新特性

参考[https://go.dev/doc/go1.24](https://go.dev/doc/go1.24)

Go 1.24 没有太多的新特性，因此这里简单提及一些比较值得关注的变化。

### 类型别名支持泛型

举个例子，我们要根据`map`定义一个`set`，在 Go 1.24 中可以这样定义：

```go
type set[P comparable] = map[P]bool
```

### 标准库

- `bytes`包新增了迭代器相关函数
- 还有一些影响不大的变化，就不一一列举了

## Go 1.23 新特性

参考[https://go.dev/doc/go1.23](https://go.dev/doc/go1.23)

### 语言的变化

Go 1.23 版本中，将 Go 1.22 中的关于“函数迭代器”的实验性功能正式发布。

```go :collapsed-lines=2
func Range0To10(func(int) bool) {
    for i := 0; i < 10; i++ {
        if !cb(i) {
            return
        }
    }
}

func main() {
    for i := range Range0To10 {
        fmt.Println(i)
    }
}
```

上面展示的是单参数的函数迭代器的用法，Go 1.23 版本中正式支持了零参数、单参数和双参数的函数迭代器。

```go
func(func() bool)
func(func(K) bool)
func(func(K, V) bool)
```

### 标准库

::: details `time`包的调整

首先，`time.Timer`和`time.Ticker`即使没有调用`Stop`方法，只要不再被引用，都会被自动回收。

其次，`time.Timer`和`time.Ticker`关联的通道现在改为了无缓冲区的通道，在早期的Go版本中，这个通道有一个元素的缓冲区。

:::

::: details 迭代器相关包

新增了`iter`包，提供了迭代器对应的定义。

`slices`包和`maps`包也进行了相应的调整，提供了迭代器的功能。

:::

::: details 其它库的调整
- 补上了`math/rand/v2`包中缺失的`Uint`函数和方法
- `slices`包新增了`Repeat`函数，用以创建元素重复的切片
- `sync.Map`新增了`Clear`方法，用以清除其中的所有键值对
- `sync/atomic`包中新增了`And`和`Or`方法
- 还有一些影响不大的变化，就不一一列举了
:::

****

## Go 1.22 新特性

参考[https://go.dev/doc/go1.22](https://go.dev/doc/go1.22)

### 语言的变化

Go 1.22 对`for`循环进行了两项更改，和一项实验性功能。

::: details 循环变量的调整

以前，`for`循环声明的变量只创建一次，并在每次迭代时更新。在 Go 1.22 中，循环的每次迭代都会创建新变量，以避免意外共享错误。举个例子：

```go
ss := []string{"123", "234", "345"}
for _, s := range ss {
    // 从 Go 1.22 开始，这里不需要再加一行 s := s 了
    go func() {
        fmt.Println(s)
    }()
}
```

对于以前的版本，上述代码大概率会输出三个"345"，因为在每一遍`for`循环时，`s`是同一个变量，只不过每次循环把它更新成了新值。而使用`go`语句启动协程一般是需要一些时间的，协程真正开始执行会比`for`循环要慢一些的，此时的`s`已经变成了最后一个值"345"，所以三个协程都会输出"345"。

而在 Go 1.22 中，上述代码会将三个字符串各输出一遍，三个字符串的输出顺序会因为协程执行的顺序而不同。

:::

::: details 整数范围循环

现在，range后面允许是一个整数了，例如：

```go
for i := range 10 { // 等价于 for i := 0; i < 10; i++ {
    fmt.Println(i)
}
```

:::

::: details （实验性功能）函数迭代器

想要使用这个功能，需要在编译时启用环境变量`GOEXPERIMENT=rangefunc`。

```go
ss := []string{"123", "234", "345"}
f := func(cb func(int, string) bool) {
    for i, s := range ss {
        if !cb(i, s) {
            return
        }
    }
}
for i, s := range f {
    fmt.Println(i, s)
}
```

从上述代码中可以看到，`f`是一个函数，它的格式为`func(cb func(xxx) bool)`，其中xxx可以为零到两个参数，两个参数支持任意类型，我们将其称为“函数迭代器”。当我们`for i, s := range f`时，会将for下面的大括号体中的内容作为`cb`函数传入`f`函数中去，然后前面的`i, s := `两个参数对应`cb`的两个形参，并且变量类型和`cb`的形参声明的类型也一致。

通过这种语法，我们可以方便的生成一些迭代器，例如切片的逆序迭代器：

```go :no-collapsed-lines
func Backward[E any](s []E) func(func(int, E) bool) {
    return func(yield func(int, E) bool) {
        for i := len(s)-1; i >= 0; i-- {
            if !yield(i, s[i]) {
                return
            }
        }
    }
}

func main() {
    s := []string{"hello", "world"}
    for i, x := range Backward(s) {
        fmt.Println(i, x)
    }
}
```

:::

### `go vet` 工具

::: details `go vet` 工具的变化

**对循环变量的引用**

由于上文的**函数迭代器**的变化，导致上述代码不会再有类似的风险，所以`vet`工具不再会报告这些错误。

**`append`的新警告**

现在，像`s = append(s)`这样不产生任何效果的`append`代码，会被`vet`工具报告错误。

**在`defer`中错误使用`time`的警告**

参考这样一个例子：

```go
t := time.Now()
defer log.Println(time.Since(t)) // 事实上，time.Since并不会在defer的时候才调用。我们实际defer的是log.Println
tmp := time.Since(t); defer log.Println(tmp) // 同上

defer func() {
  log.Println(time.Since(t)) // 正确的time.Since写法
}()
```

现在，`vet`工具会报告出上述错误的写法。

**对于`log/slog`的警告**

`slog`库的正确用法是`slog.Info(message, key1, v1, key2, v2)`，如果在key的位置填写的既不是一个`string`，又不是一个`slog.Attr`，现在`vet`工具会报告这个错误。

:::

### 核心库

- 新增了`math/rand/v2`包
- 新增了`go/version`包，用以比较 Go 版本号，例如：`version.Compare("go1.21rc1", "go1.21.0")`
- `net/http.ServeMux`现在有了更多的支持，已经支持了传入请求方法和通配符
- 一些库的小变化
  - `archive/tar`包新增了`Writer.AddFS`方法
  - `archive/zip`包新增了`Writer.AddFS`方法
  - `cmp`包新增了`Or`函数，用以返回一系列变量中的第一个非零值变量
  - `log/slog`包新增了`SetLogLoggerLevel`函数
  - `net/http`包新增了`ServeFileFS`, `FileServerFS`, `NewFileTransportFS`函数
  - `reflect`包新增了`Value.IsZero`方法
  - `slices`包新增了`Concat`函数，用以合并多个切片。`Delete`, `Compact`, `Replace`等函数现在会把切片末尾空出来的位置置为零值。
  - 还有一些影响不大的变化，就不一一列举了

## Go 1.21 新特性

参考[https://go.dev/doc/go1.21](https://go.dev/doc/go1.21)

### Go版本号的变化

以前，每个版本的第一个发行版的版本编号为"1.20"。从这个版本开始，第一个发行版的版本编号为"1.21.0"。

### 语言的变化

Go 1.21 新增了三个内置函数`min`、`max`、`clear`。其中`clear`用于删除掉一个`map`的所有键值对或者将一个`slice`的所有元素置为零值。

调整了包初始化顺序的算法。

进行了多项改进，提高了类型推断的能力和精度。

### 核心库

- 新增了`log/slog`包
- 新增了`testing/slogtest`包
- 新增了`slices`包
- 新增了`maps`包
- 新增了`cmp`包
- 一些库的小变化，就不一一列举了

## Go 1.20 新特性

参考[https://go.dev/doc/go1.20](https://go.dev/doc/go1.20)

::: details 切片转数组

现在支持将切片转为数组了，例如`*(*[4]byte)(x)`现在可以简写为`[4]byte(x)`。

:::

:::: details `unsafe`包新增函数

`unsafe`包提供了三个新函数`SliceData`、`String`、`StringData`，这些函数现在提供了构造和解构切片和字符串值的完整功能。例如：

```go
s := "abc"
buf := unsafe.Slice(unsafe.StringData(s), len(s))
```

就可以得到字符串`s`的底层数组。

::: note 注意

但在一般情况下，你可以放心的使用`[]byte(s)`。如果编译器检测到后续不会再用到`s`，也会直接把它的底层数组返回出来，而不是复制一份。

:::

::::

::: details 关于`comparable`约束

```go
a := map[string]any{"a": 1, "b": 2.3, "c": "c"}
b := map[string]any{"a": 1, "b": 2.3, "c": "c"}
fmt.Println(maps.Equal(a, b)) // 输出 true
```

我们来看一下`maps.Equal`函数的定义：

```go
func Equal[M1, M2 ~map[K]V, K, V comparable](m1 M1, m2 M2) bool
```

在之前的版本，由于`maps.Equal`函数接收的两个`map`要求键与值都是`comparable`，但实际上它是`map[string]any`，`any`并不一定满足`comparable`，所以编译会报错。\
在Go1.20之后，不会再因此而编译报错。如果出现不能比较的元素，则会在运行时报错：`panic: runtime error: comparing uncomparable type []int`

:::