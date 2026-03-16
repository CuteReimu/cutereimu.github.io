---
title: go fix 命令的使用技巧
shortTitle: fix命令的使用技巧
icon: b:golang
order: 12
category: 编程日记
tags: 
  - Go
date: 2026-03-16
---

```bash
go fix ./...
```

这是 Go1.26 引入的一个新命令，用于进行一系列代码优化。它包含以下的一些功能：

<!-- more -->

```console :no-line-numbers
$ go tool fix help
...
Registered analyzers:

    any          replace interface{} with any
    buildtag     check //go:build and // +build directives
    fmtappendf   replace []byte(fmt.Sprintf) with fmt.Appendf
    forvar       remove redundant re-declaration of loop variables
    hostport     check format of addresses passed to net.Dial
    inline       apply fixes based on 'go:fix inline' comment directives
    mapsloop     replace explicit loops over maps with calls to maps package
    minmax       replace if/else statements with calls to min or max
    newexpr      simplify code by using go1.26's new(expr)
    omitzero     suggest replacing omitempty with omitzero for struct fields
    plusbuild    remove obsolete //+build comments
    rangeint     replace 3-clause for loops with for-range over integers
    reflecttypefor replace reflect.TypeOf(x) with TypeFor[T]()
    slicescontains replace loops with slices.Contains or slices.ContainsFunc
    slicessort   replace sort.Slice with slices.Sort for basic types
    stditerators use iterators instead of Len/At-style APIs
    stringsbuilder replace += with strings.Builder
    stringscut   replace strings.Index etc. with strings.Cut
    stringscutprefix replace HasPrefix/TrimPrefix with CutPrefix
    stringsseq   replace ranging over Split/Fields with SplitSeq/FieldsSeq
    testingcontext replace context.WithCancel with t.Context in tests
    waitgroup    replace wg.Add(1)/go/wg.Done() with wg.Go
```

对于其中的`inline`修复器，可以在代码中使用`//go:fix inline`指令来指定需要内联的函数。举两个例子：

::: note 示例1

```go
//go:fix inline
func show(prefix, item string) {
    fmt.Println(prefix, item)
}
```

执行`go fix ./...`后，所有调用`show`函数的地方都会被替换为内联的代码：

```go :no-collapsed-lines
// 旧代码
show("", "hello")

// 会被替换为以下代码
fmt.Println("", item)
```

:::

::: note 示例2

```go
//go:fix inline
func printPair(before, x, y, after string) {
    fmt.Println(before, x, after)
    fmt.Println(before, y, after)
}
```

执行`go fix ./...`后，所有调用`printPair`函数的地方都会被替换为内联的代码：

```go :no-collapsed-lines
// 旧代码
printPair("[", "x", "y", "]")

// 会被替换为以下代码，这里会自动考虑变量复用
var before, after = "[", "]"
fmt.Println(before, "one", after)
fmt.Println(before, "two", after)
```

:::