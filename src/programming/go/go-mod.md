---
title: go.mod 文件介绍
icon: b:golang
order: 7
category: 编程日记
tags: 
  - Go
---

从 Go 1.11 开始，Go 引入了模块化管理，并于 Go 1.16 版本开始正式成为默认构建模式。现在，Go 模块已经成为 Go 语言通用的包管理方式。

在项目根目录下使用`go mod init example/mymodule`就可以初始化一个 Go 模块，并生成一个名为 go.mod 的文件，其中第一行即为`module example.com/mymodule`。

go.mod 文件用于描述模块的依赖关系和版本信息。一个可能的 go.mod 文件可以包含以下内容：

<!-- more -->

```go.mod title="go.mod"
module example.com/mymodule

go 1.23.1
toolchain go1.23.3

godebug asynctimerchan=0

tool example.com/mymodule/cmd/mytool

require (
    example.com/othermodule v1.2.3
    example.com/thismodule v1.2.3
    example.com/thatmodule v1.2.3
)

replace example.com/thatmodule => ../thatmodule

exclude example.com/thismodule v1.3.0

retract v1.1.0
```

下面对其各个部分进行解释。

## module

`module`用于声明模块的模块路径，它是模块的唯一标识符。该模块路径将成为模块包含的所有包的导入前缀。

在上面的例子中，是这样定义的：`module example.com/mymodule`。假设其下有一个目录`foo`：

```ansi
$ tree .
.
├── go.mod
├── go.sum
└── [34mfoo[0m
    └── bar.go
```

我们想要导入该包，应该使用这样的路径：

```go title="example.go"
import "example.com/mymodule/foo"
```

如果我们的代码托管在 Github 上，例如[github.com/CuteReimu/neuquant](https://github.com/CuteReimu/neuquant/blob/master/go.mod)，我们也应该把模块路径定义为：

```go.mod title="go.mod"
module github.com/CuteReimu/neuquant
```

以避免导入路径和模块路径不一致，其它人导入时可能会出错。

如果我们打算发布`v0`/`v1`版本的模块，按照上述方法定义模块路径即可。如果我们打算发布`v2`或更高版本的模块，则需要在模块路径中后增加版本号，例如：

```go.mod title="go.mod"
module github.com/CuteReimu/neuquant/v2
```

这样别人导入时就可以使用：

```go.mod title="go.mod"
require github.com/CuteReimu/neuquant/v2 v2.1.1
```

```go title="example.go"
import "github.com/CuteReimu/neuquant/v2/foo"
```

## go 和 toolchain

`go 1.23.1`指定了该模块使用的最低 Go 版本。同时，这一行也会影响到编译器的行为。

`toolchain go1.23.3`指定了建议使用的工具链版本。

一般情况下，如果只是自己做一个项目，`go`和`toolchain`设置成当前使用的 Go 版本即可。

但如果你打算发布一个库供别人使用，你需要考虑使用你的库的用户可能并不一定更新到了你的 Go 版本，尤其是当你在更新 Go 版本的时候，需要多加考虑。

## godebug

`godebug`用于设置 Go 调试器的行为。在我们的日常编程中一般不需要设置。详细说明可以参考[官方文档](https://go.dev/doc/godebug)。

## require

`require`和`replace`是最常用的两个指令。

`require example.com/othermodule v1.2.3`声明了该模块依赖于`example.com/othermodule`模块的版本`v1.2.3`。

::: tip 简写

特别要说明的是，如果遇到连续多行，例如：

```go.mod title="go.mod"
require example.com/othermodule v1.2.3
require example.com/thismodule v1.2.3
require example.com/thatmodule v1.2.3
```

可以将其简写为：

```go.mod title="go.mod"
require (
    example.com/othermodule v1.2.3
    example.com/thismodule v1.2.3
    example.com/thatmodule v1.2.3
)
```

除了`require`外，其他部分也都可以使用类似的方式进行简写。

:::

当你使用`go mod tidy`命令后，Go 会自动分析你的代码，删除不再需要的依赖，并更新`go.mod`文件。较新版本的 Go 会把`require`分成两部分：第一部分是直接依赖的模块，第二部分是间接依赖的模块，间接依赖的模块后会添加`// indirect`注释。

## replace

如果你引用的模块并不是在互联网上，而是本地的另一个项目，你可以用`replace`来指定本地路径。例如：

```go.mod title="go.mod"
require example.com/othermodule v1.2.5

replace example.com/othermodule v1.2.5 => ../othermodule
```

这样，引用的`example.com/othermodule v1.2.5`模块将被替换为本地的`../othermodule`路径下的项目。

## tool

`tool`是 Go 1.24 引入的一个新特性，用于管理工具。详细用法可以参考[官方文档](https://go.dev/doc/modules/managing-dependencies#tools)。

## exclude

如果你发现，引用的模块的最新版本有问题，或者并不想使用最新版本，但是在`go get -u`时却会自动更新到该版本，你可以使用`exclude`来排除该版本。例如：

```go.mod title="go.mod"
exclude example.com/thismodule v1.3.5
```

这样，`example.com/thismodule v1.3.5`版本将不会被使用。如果有新的版本，会更新到新的版本。否则，退而求其次，将会使用`v1.3.4`或更低版本。

## retract

从 Go 1.16 开始，Go 模块支持了`retract`指令，用于撤回某个版本。

例如，你发布了一个模块的`v1.1.0`版本，但后来发现这个版本有问题，你可以紧急发布一个`v1.1.1`版本，在其中添加：

```go.mod title="go.mod"
// 撤回的原因
retract v1.1.0
```

之后，所有引用了该库的工程应用，执行`go list`就可以看到如下提醒：

```ansi
[31mgithub.com/example/mymodule v1.1.0 (retracted) [v1.1.1] [0m
```

在手动执行`go get`时，也会提示：

```ansi
[31mgo: github.com/example/mymodule v1.1.0: retracted by author: 撤回的原因
go: to update to a non-retracted version, use "go get github.com/example/mymodule@v1.1.1"[0m
```

当然了，你也可以把在`v1.1.1`版本中把自己版本也撤回：

```go.mod title="go.mod"
retract (
    v1.1.0
    v1.1.1
)
```

这样，用户在引用时，由于`v1.1.0`和`v1.1.1`版本都不可用，在没有新的版本的情况下，就会自动降级到更低版本。

`retract`指令不光可以撤回单个版本，也可以撤回一系列版本。例如：

```go.mod title="go.mod"
retract [v1.1.0, v1.1.9]
```

上述指令将会撤回`v1.1.0`到`v1.1.9`之间（闭区间）的所有版本。