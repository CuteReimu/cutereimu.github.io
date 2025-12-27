---
title: golangci-lint代码检查工具
icon: b:golang
order: 5
category: 编程日记
tags: 
  - Go
date: 2025-05-24
---

golangci-lint是一个Go语言的代码静态检查工具集，官网是[https://golangci-lint.run/](https://golangci-lint.run/)，它集成了多个流行的linters，可以帮助我们快速发现代码中的潜在问题。

<!-- more -->

::: warning 注意

以下内容截止golangci-lint的`2.7.2`版本。

:::

使用以下命令即可安装`golangci-lint`：

```bash :no-line-numbers
# binary will be $(go env GOPATH)/bin/golangci-lint
curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/HEAD/install.sh | sh -s -- -b $(go env GOPATH)/bin v2.7.2

golangci-lint --version
```

当然你也不是不可以用`go install`命令安装（不推荐）：

```bash
go install github.com/golangci/golangci-lint/v2/cmd/golangci-lint@v2.7.2
```

运行：

```bash
golangci-lint run ./...
```

支持的参数说明：
- `--default=none`用以指定默认集，有以下选项：
  - `standard`：只启用默认的linters
  - `none`：不启用任何linters
  - `all`：启用所有linters
  - `fast`：启用所有标注了`fast`的linters，可以使用`golangci-lint help linters`命令查看其后标有`fast`的linters。
- `-E`用以指定要启用的linters，例如`-E errcheck`
- `-D`用以指定要禁用的linters，例如`-D gosec`
- `--fix`表示自动修复代码中的问题（如果对应的linter支持自动修复的话）

你也可以在项目中创建一个`.golangci.yml`文件来配置，运行`golangci-lint run`时，会自动扫描当前目录以及父目录中的`.golangci.yml`文件，使用其中的配置。配置支持`yml`、`yaml`、`json`、`toml`等格式。

最重要的配置是`linters`，可以在其中指定要启用或禁用的linters。以下是一个示例配置：

```yml :no-line-numbers title=".golangci.yml"
version: "2"
linters:
  default: none
  enable:
    - gosec
  settings:
    gosec:
      excludes:
        - G115
        - G204
```

更详细的示例可以参考[https://golangci-lint.run/docs/configuration/file/](https://golangci-lint.run/docs/configuration/file/)

## linters 列表

### arangolint

专门针对的 arangodb 客户端的代码检测工具。

### asasalint

检查将`[]any`当作`any`传入变长参数函数`func(...any)`中。

### asciicheck

检查代码标识符的名字中是否包含非 ASCII 符号。

### bidichk

检查危险的 Unicode 字符序列。

### bodyclose

检查 HTTP 响应体是否都成功关闭了。

### canonicalheader

<Badge text="Autofix" type="info" />

检查 `net/http.Header` 是否使用了规范的 Header。

### containedctx

检查包含了 `context.Context` 字段的 `struct`。

### contextcheck

检查函数是否使用了非继承的 context。

### copyloopvar

<Badge text="Autofix" type="info" />

用于检测是否拷贝了循环变量。（从Go1.22开始，将循环变量传入别的协程，不再需要拷贝循环变量，因为每次循环都会生成新的变量，不再复用旧的变量）

### cyclop

检查函数和包的循环复杂度。

### decorder

检查类型、常量、变量、函数的声明顺序和数量。

### depguard

用于检测所有 import 的包是否都在给定的黑名单/白名单中。

### dogsled

用于检测是否分配了太多的空标识符（例如`x, _, _, _ := f()`）。

### dupl

检测重复的代码段。

### dupword

<Badge text="Autofix" type="info" />

检测源代码中的重复词。

### durationcheck

检测两个`time.Duration`的相乘运算。

### embeddedstructfieldcheck

内嵌类型应当在`struct`的字段列表的开头，并且内嵌字段应当和普通字段之间空一行。

### err113

<Badge text="Autofix" type="info" />

检测错误处理语句

### errcheck

检测代码中是否有未处理的`error`，未处理的`error`在某些情况下可能会引发严重的bug。

### errchkjson

检测传入json序列化函数的参数中是否有不支持的类型，以及是否存在返回的`error`可以忽略的调用。

### errname

检测`error`变量的命名是否以`Err`作为前缀，`error`类型的命名是否以`Error`作为后缀。

### errorlint

<Badge text="Autofix" type="info" />

检测是否有`error`的`Wrap`相关的错误（该特性是从Go1.13中引入的）。

### exhaustive

检测`switch`语句是否穷举了所有的可能性。

### exhaustruct

检测结构体的所有字段是否都已经初始化。

### exptostd

<Badge text="Autofix" type="info" />

检测`golang.org/x/exp/`包中的函数是否可以用标准库中的函数代替。

### fatcontext

<Badge text="Autofix" type="info" />

检测循环和函数中是否有嵌套的上下文。

### forbidigo

指定禁止使用某些标识符。

### forcetypeassert

检查强制类型断言。

### funcorder

检测函数、方法、构造器的顺序。

### funlen

检测函数是否太长。

### ginkgolinter

<Badge text="Autofix" type="info" />

执行 ginkgo 和 gomega 的使用标准。

### gocheckcompilerdirectives

检测go编译器指令注释（`//go:`）是否合法。

### gochecknoglobals

禁止使用全局变量。

### gochecknoinits

禁止使用`init`函数。

### gochecksumtype

对Go “sum types” 运行穷举性检查。

### gocognit

计算和检查函数的认知复杂度。

### goconst

检测重复的字符串，可以用一个常量来代替。

### gocritic

<Badge text="Autofix" type="info" />

提供检查错误、性能和样式问题的诊断。无需通过动态规则重新编译即可扩展。动态规则是用AST模式、过滤器、报告消息和可选建议以声明方式编写的。

### gocyclo

计算和检测函数的循环复杂度。

### godoclint

检查Go文档是否规范。

### godot

<Badge text="Autofix" type="info" />

检查是否所有的注释都以句号结尾。

### godox

检查注释中是否有`FIXME`、`TODO`以及其它的关键词。

### goheader

<Badge text="Autofix" type="info" />

检测Go文件的头部注释是否满足要求。

### gomoddirectives

管理`go.mod`中的`replace`、`retract`和`excludes`指令。

### gomodguard

用于指定允许和禁止的直接Go模块依赖。这与[depguard](#depguard)不同，[depguard](#depguard)有不同的块类型，例如版本约束和模块建议。

### goprintffuncname

检查`printf`类的函数是否以`f`结尾命名。

### gosec

检查源代码是否存在安全问题。

### gosmopolitan

检查代码中的多语言是否违反了 i18n/l10n。

### govet

<Badge text="Autofix" type="info" />

Vet检查Go源代码并报告可疑构造。它与`go vet`大致相同。

### grouper

分析表达式组。

### importas

<Badge text="Autofix" type="info" />

强制使用一致的 import 别名。

### inamedparam

检查`interface`的所有方法的参数是否都命名了。

### ineffassign

检查是否对已存在但还未使用过的变量进行赋值。

### interfacebloat

用于检测`interface`的方法数量。

### intrange

<Badge text="Autofix" type="info" />

用于检测`for`循环是否可以用`for range 一个int值`的语法代替。（此语法是从Go1.22开始引入的）

### iotamixing

检测常量组声明中，同一个组中是否既包含了`iota`声明，又包含了非`iota`声明。

### ireturn

函数应当接收`interface`，并返回具体的类型。

### lll

检查太长的代码行。

### loggercheck

检查常用日志库（kitlog、klog、logr、slog、zap）中的键值对。

### maintidx

用于衡量函数的可维护性指标。

### makezero

检查是否有长度非0的切片初始化。

### mirror

<Badge text="Autofix" type="info" />

检查是否存在`bytes`/`strings`使用的错误镜像模式。

### misspell

<Badge text="Autofix" type="info" />

检查常见的英文单词拼写错误。

### mnd

检测魔法数字。

### modernize

使用现代语言和库功能对Go代码提出简化的建议。

### musttag

`Marshal`和`Unmarshal`的结构体字段必须包含标签。

### nakedret

<Badge text="Autofix" type="info" />

检查是否存在超过指定（可以为0）行数的含有裸返回的函数。

### nestif

检查嵌套过深的`if`语句。

### nilerr

检查是否存在即使检查了`error`不是`nil`但是却返回了`nil`的代码。

### nilnesserr

检查是否存在检查了`err != nil`但返回了一个不同的`nil`值`error`。

### nilnil

检查是否存在同时返回了`nil`值的`error`和一个非法的值。

### nlreturn

<Badge text="Autofix" type="info" />

检查`return`语句和分支语句前是否有一行空行，以增加代码的清晰度。

### noctx

检查是否使用了不含`context.Context`的函数和方法。

### noinlineerr

禁止使用内联错误处理（`if err := ...; err != nil {`）。

### nolintlint

<Badge text="Autofix" type="info" />

检查格式不正确或不完整的`nolint`指令。

### nonamedreturns

禁止使用命名的返回。

### nosprintfhostport

检查在URL中错误地使用`Sprintf`进行地址和端口的拼接。

### paralleltest

检查你的 Go test 中是否未使用 `t.Parallel()`。

### perfsprint

<Badge text="Autofix" type="info" />

检查`fmt.Sprintf`是否可以用更高效的函数代替。

### prealloc

检查切片声明是否可以预分配内存。

### predeclared

检查覆盖了Go预定义标识符的代码。

### promlinter

使用 promlinter 检查 Prometheus 指标命名。

### protogetter

<Badge text="Autofix" type="info" />

检查是否存在本该使用getter方法但却直接读了proto的字段。

### reassign

检查包变量是否被重复分配。

### recvcheck

检查接收器类型是否一致。

### revive

<Badge text="Autofix" type="info" />

快速的、可配置的、可扩展的、灵活的、漂亮的代码检测工具。golint的替代品。

### rowserrcheck

检查`Rows.Err`是否成功地判断了。

### sloglint

<Badge text="Autofix" type="info" />

检查使用`log/slog`的代码风格是否一致。

### spancheck

检查 OpenTelemetry/Census spans 的错误。

### sqlclosecheck

检查`sql.Row`、`sql.Stmt`、`sqlx.NamedStmt`、`pgx.Query`是否关闭了。

### staticcheck

<Badge text="Autofix" type="info" />

一系列staticcheck的规则。

```yml :no-line-numbers
linters:
  settings:
    staticcheck:
      # https://staticcheck.dev/docs/configuration/options/#dot_import_whitelist
      # Default: ["github.com/mmcloughlin/avo/build", "github.com/mmcloughlin/avo/operand", "github.com/mmcloughlin/avo/reg"]
      dot-import-whitelist:
        - fmt
      # https://staticcheck.dev/docs/configuration/options/#initialisms
      # Default: ["ACL", "API", "ASCII", "CPU", "CSS", "DNS", "EOF", "GUID", "HTML", "HTTP", "HTTPS", "ID", "IP", "JSON", "QPS", "RAM", "RPC", "SLA", "SMTP", "SQL", "SSH", "TCP", "TLS", "TTL", "UDP", "UI", "GID", "UID", "UUID", "URI", "URL", "UTF8", "VM", "XML", "XMPP", "XSRF", "XSS", "SIP", "RTP", "AMQP", "DB", "TS"]
      initialisms: ["ACL", "API", "ASCII", "CPU", "CSS", "DNS", "EOF", "GUID", "HTML", "HTTP", "HTTPS", "ID", "IP", "JSON", "QPS", "RAM", "RPC", "SLA", "SMTP", "SQL", "SSH", "TCP", "TLS", "TTL", "UDP", "UI", "GID", "UID", "UUID", "URI", "URL", "UTF8", "VM", "XML", "XMPP", "XSRF", "XSS", "SIP", "RTP", "AMQP", "DB", "TS"]
      # https://staticcheck.dev/docs/configuration/options/#http_status_code_whitelist
      # Default: ["200", "400", "404", "500"]
      http-status-code-whitelist: ["200", "400", "404", "500"]
      # SAxxxx checks in https://staticcheck.dev/docs/configuration/options/#checks
      # Example (to disable some checks): [ "all", "-SA1000", "-SA1001"]
      # Run `GL_DEBUG=staticcheck golangci-lint run --enable=staticcheck` to see all available checks and enabled by config checks.
      # Default: ["all", "-ST1000", "-ST1003", "-ST1016", "-ST1020", "-ST1021", "-ST1022"]
      checks:
        # 非法的正则表达式。
        # https://staticcheck.dev/docs/checks/#SA1000
        - SA1000
        # 非法的 template。
        # https://staticcheck.dev/docs/checks/#SA1001
        - SA1001
        # 'time.Parse' 中非法的格式。
        # https://staticcheck.dev/docs/checks/#SA1002
        - SA1002
        # 向 'encoding/binary' 中的函数传入不支持的参数.
        # https://staticcheck.dev/docs/checks/#SA1003
        - SA1003
        # Suspiciously small untyped constant in 'time.Sleep'.
        # https://staticcheck.dev/docs/checks/#SA1004
        - SA1004
        # Invalid first argument to 'exec.Command'.
        # https://staticcheck.dev/docs/checks/#SA1005
        - SA1005
        # 'Printf' with dynamic first argument and no further arguments.
        # https://staticcheck.dev/docs/checks/#SA1006
        - SA1006
        # Invalid URL in 'net/url.Parse'.
        # https://staticcheck.dev/docs/checks/#SA1007
        - SA1007
        # Non-canonical key in 'http.Header' map.
        # https://staticcheck.dev/docs/checks/#SA1008
        - SA1008
        # '(*regexp.Regexp).FindAll' called with 'n == 0', which will always return zero results.
        # https://staticcheck.dev/docs/checks/#SA1010
        - SA1010
        # Various methods in the "strings" package expect valid UTF-8, but invalid input is provided.
        # https://staticcheck.dev/docs/checks/#SA1011
        - SA1011
        # A nil 'context.Context' is being passed to a function, consider using 'context.TODO' instead.
        # https://staticcheck.dev/docs/checks/#SA1012
        - SA1012
        # 'io.Seeker.Seek' is being called with the whence constant as the first argument, but it should be the second.
        # https://staticcheck.dev/docs/checks/#SA1013
        - SA1013
        # Non-pointer value passed to 'Unmarshal' or 'Decode'.
        # https://staticcheck.dev/docs/checks/#SA1014
        - SA1014
        # Using 'time.Tick' in a way that will leak. Consider using 'time.NewTicker', and only use 'time.Tick' in tests, commands and endless functions.
        # https://staticcheck.dev/docs/checks/#SA1015
        - SA1015
        # Trapping a signal that cannot be trapped.
        # https://staticcheck.dev/docs/checks/#SA1016
        - SA1016
        # Channels used with 'os/signal.Notify' should be buffered.
        # https://staticcheck.dev/docs/checks/#SA1017
        - SA1017
        # 'strings.Replace' called with 'n == 0', which does nothing.
        # https://staticcheck.dev/docs/checks/#SA1018
        - SA1018
        # Using a deprecated function, variable, constant or field.
        # https://staticcheck.dev/docs/checks/#SA1019
        - SA1019
        # Using an invalid host:port pair with a 'net.Listen'-related function.
        # https://staticcheck.dev/docs/checks/#SA1020
        - SA1020
        # Using 'bytes.Equal' to compare two 'net.IP'.
        # https://staticcheck.dev/docs/checks/#SA1021
        - SA1021
        # Modifying the buffer in an 'io.Writer' implementation.
        # https://staticcheck.dev/docs/checks/#SA1023
        - SA1023
        # A string cutset contains duplicate characters.
        # https://staticcheck.dev/docs/checks/#SA1024
        - SA1024
        # It is not possible to use '(*time.Timer).Reset''s return value correctly.
        # https://staticcheck.dev/docs/checks/#SA1025
        - SA1025
        # Cannot marshal channels or functions.
        # https://staticcheck.dev/docs/checks/#SA1026
        - SA1026
        # Atomic access to 64-bit variable must be 64-bit aligned.
        # https://staticcheck.dev/docs/checks/#SA1027
        - SA1027
        # 'sort.Slice' can only be used on slices.
        # https://staticcheck.dev/docs/checks/#SA1028
        - SA1028
        # Inappropriate key in call to 'context.WithValue'.
        # https://staticcheck.dev/docs/checks/#SA1029
        - SA1029
        # Invalid argument in call to a 'strconv' function.
        # https://staticcheck.dev/docs/checks/#SA1030
        - SA1030
        # Overlapping byte slices passed to an encoder.
        # https://staticcheck.dev/docs/checks/#SA1031
        - SA1031
        # Wrong order of arguments to 'errors.Is'.
        # https://staticcheck.dev/docs/checks/#SA1032
        - SA1032
        # 'sync.WaitGroup.Add' called inside the goroutine, leading to a race condition.
        # https://staticcheck.dev/docs/checks/#SA2000
        - SA2000
        # Empty critical section, did you mean to defer the unlock?.
        # https://staticcheck.dev/docs/checks/#SA2001
        - SA2001
        # Called 'testing.T.FailNow' or 'SkipNow' in a goroutine, which isn't allowed.
        # https://staticcheck.dev/docs/checks/#SA2002
        - SA2002
        # Deferred 'Lock' right after locking, likely meant to defer 'Unlock' instead.
        # https://staticcheck.dev/docs/checks/#SA2003
        - SA2003
        # 'TestMain' doesn't call 'os.Exit', hiding test failures.
        # https://staticcheck.dev/docs/checks/#SA3000
        - SA3000
        # Assigning to 'b.N' in benchmarks distorts the results.
        # https://staticcheck.dev/docs/checks/#SA3001
        - SA3001
        # Binary operator has identical expressions on both sides.
        # https://staticcheck.dev/docs/checks/#SA4000
        - SA4000
        # '&*x' gets simplified to 'x', it does not copy 'x'.
        # https://staticcheck.dev/docs/checks/#SA4001
        - SA4001
        # Comparing unsigned values against negative values is pointless.
        # https://staticcheck.dev/docs/checks/#SA4003
        - SA4003
        # The loop exits unconditionally after one iteration.
        # https://staticcheck.dev/docs/checks/#SA4004
        - SA4004
        # Field assignment that will never be observed. Did you mean to use a pointer receiver?.
        # https://staticcheck.dev/docs/checks/#SA4005
        - SA4005
        # A value assigned to a variable is never read before being overwritten. Forgotten error check or dead code?.
        # https://staticcheck.dev/docs/checks/#SA4006
        - SA4006
        # The variable in the loop condition never changes, are you incrementing the wrong variable?.
        # https://staticcheck.dev/docs/checks/#SA4008
        - SA4008
        # A function argument is overwritten before its first use.
        # https://staticcheck.dev/docs/checks/#SA4009
        - SA4009
        # The result of 'append' will never be observed anywhere.
        # https://staticcheck.dev/docs/checks/#SA4010
        - SA4010
        # Break statement with no effect. Did you mean to break out of an outer loop?.
        # https://staticcheck.dev/docs/checks/#SA4011
        - SA4011
        # Comparing a value against NaN even though no value is equal to NaN.
        # https://staticcheck.dev/docs/checks/#SA4012
        - SA4012
        # Negating a boolean twice ('!!b') is the same as writing 'b'. This is either redundant, or a typo.
        # https://staticcheck.dev/docs/checks/#SA4013
        - SA4013
        # An if/else if chain has repeated conditions and no side-effects; if the condition didn't match the first time, it won't match the second time, either.
        # https://staticcheck.dev/docs/checks/#SA4014
        - SA4014
        # Calling functions like 'math.Ceil' on floats converted from integers doesn't do anything useful.
        # https://staticcheck.dev/docs/checks/#SA4015
        - SA4015
        # Certain bitwise operations, such as 'x ^ 0', do not do anything useful.
        # https://staticcheck.dev/docs/checks/#SA4016
        - SA4016
        # Discarding the return values of a function without side effects, making the call pointless.
        # https://staticcheck.dev/docs/checks/#SA4017
        - SA4017
        # Self-assignment of variables.
        # https://staticcheck.dev/docs/checks/#SA4018
        - SA4018
        # Multiple, identical build constraints in the same file.
        # https://staticcheck.dev/docs/checks/#SA4019
        - SA4019
        # Unreachable case clause in a type switch.
        # https://staticcheck.dev/docs/checks/#SA4020
        - SA4020
        # "x = append(y)" is equivalent to "x = y".
        # https://staticcheck.dev/docs/checks/#SA4021
        - SA4021
        # Comparing the address of a variable against nil.
        # https://staticcheck.dev/docs/checks/#SA4022
        - SA4022
        # Impossible comparison of interface value with untyped nil.
        # https://staticcheck.dev/docs/checks/#SA4023
        - SA4023
        # Checking for impossible return value from a builtin function.
        # https://staticcheck.dev/docs/checks/#SA4024
        - SA4024
        # Integer division of literals that results in zero.
        # https://staticcheck.dev/docs/checks/#SA4025
        - SA4025
        # Go constants cannot express negative zero.
        # https://staticcheck.dev/docs/checks/#SA4026
        - SA4026
        # '(*net/url.URL).Query' returns a copy, modifying it doesn't change the URL.
        # https://staticcheck.dev/docs/checks/#SA4027
        - SA4027
        # 'x % 1' is always zero.
        # https://staticcheck.dev/docs/checks/#SA4028
        - SA4028
        # Ineffective attempt at sorting slice.
        # https://staticcheck.dev/docs/checks/#SA4029
        - SA4029
        # Ineffective attempt at generating random number.
        # https://staticcheck.dev/docs/checks/#SA4030
        - SA4030
        # Checking never-nil value against nil.
        # https://staticcheck.dev/docs/checks/#SA4031
        - SA4031
        # Comparing 'runtime.GOOS' or 'runtime.GOARCH' against impossible value.
        # https://staticcheck.dev/docs/checks/#SA4032
        - SA4032
        # Assignment to nil map.
        # https://staticcheck.dev/docs/checks/#SA5000
        - SA5000
        # Deferring 'Close' before checking for a possible error.
        # https://staticcheck.dev/docs/checks/#SA5001
        - SA5001
        # The empty for loop ("for {}") spins and can block the scheduler.
        # https://staticcheck.dev/docs/checks/#SA5002
        - SA5002
        # Defers in infinite loops will never execute.
        # https://staticcheck.dev/docs/checks/#SA5003
        - SA5003
        # "for { select { ..." with an empty default branch spins.
        # https://staticcheck.dev/docs/checks/#SA5004
        - SA5004
        # The finalizer references the finalized object, preventing garbage collection.
        # https://staticcheck.dev/docs/checks/#SA5005
        - SA5005
        # Infinite recursive call.
        # https://staticcheck.dev/docs/checks/#SA5007
        - SA5007
        # Invalid struct tag.
        # https://staticcheck.dev/docs/checks/#SA5008
        - SA5008
        # Invalid Printf call.
        # https://staticcheck.dev/docs/checks/#SA5009
        - SA5009
        # Impossible type assertion.
        # https://staticcheck.dev/docs/checks/#SA5010
        - SA5010
        # Possible nil pointer dereference.
        # https://staticcheck.dev/docs/checks/#SA5011
        - SA5011
        # Passing odd-sized slice to function expecting even size.
        # https://staticcheck.dev/docs/checks/#SA5012
        - SA5012
        # Using 'regexp.Match' or related in a loop, should use 'regexp.Compile'.
        # https://staticcheck.dev/docs/checks/#SA6000
        - SA6000
        # Missing an optimization opportunity when indexing maps by byte slices.
        # https://staticcheck.dev/docs/checks/#SA6001
        - SA6001
        # Storing non-pointer values in 'sync.Pool' allocates memory.
        # https://staticcheck.dev/docs/checks/#SA6002
        - SA6002
        # Converting a string to a slice of runes before ranging over it.
        # https://staticcheck.dev/docs/checks/#SA6003
        - SA6003
        # Inefficient string comparison with 'strings.ToLower' or 'strings.ToUpper'.
        # https://staticcheck.dev/docs/checks/#SA6005
        - SA6005
        # Using io.WriteString to write '[]byte'.
        # https://staticcheck.dev/docs/checks/#SA6006
        - SA6006
        # Defers in range loops may not run when you expect them to.
        # https://staticcheck.dev/docs/checks/#SA9001
        - SA9001
        # Using a non-octal 'os.FileMode' that looks like it was meant to be in octal.
        # https://staticcheck.dev/docs/checks/#SA9002
        - SA9002
        # Empty body in an if or else branch.
        # https://staticcheck.dev/docs/checks/#SA9003
        - SA9003
        # Only the first constant has an explicit type.
        # https://staticcheck.dev/docs/checks/#SA9004
        - SA9004
        # Trying to marshal a struct with no public fields nor custom marshaling.
        # https://staticcheck.dev/docs/checks/#SA9005
        - SA9005
        # Dubious bit shifting of a fixed size integer value.
        # https://staticcheck.dev/docs/checks/#SA9006
        - SA9006
        # Deleting a directory that shouldn't be deleted.
        # https://staticcheck.dev/docs/checks/#SA9007
        - SA9007
        # 'else' branch of a type assertion is probably not reading the right value.
        # https://staticcheck.dev/docs/checks/#SA9008
        - SA9008
        # Ineffectual Go compiler directive.
        # https://staticcheck.dev/docs/checks/#SA9009
        - SA9009
        # Incorrect or missing package comment.
        # https://staticcheck.dev/docs/checks/#ST1000
        - ST1000
        # Dot imports are discouraged.
        # https://staticcheck.dev/docs/checks/#ST1001
        - ST1001
        # Poorly chosen identifier.
        # https://staticcheck.dev/docs/checks/#ST1003
        - ST1003
        # Incorrectly formatted error string.
        # https://staticcheck.dev/docs/checks/#ST1005
        - ST1005
        # Poorly chosen receiver name.
        # https://staticcheck.dev/docs/checks/#ST1006
        - ST1006
        # A function's error value should be its last return value.
        # https://staticcheck.dev/docs/checks/#ST1008
        - ST1008
        # Poorly chosen name for variable of type 'time.Duration'.
        # https://staticcheck.dev/docs/checks/#ST1011
        - ST1011
        # Poorly chosen name for error variable.
        # https://staticcheck.dev/docs/checks/#ST1012
        - ST1012
        # Should use constants for HTTP error codes, not magic numbers.
        # https://staticcheck.dev/docs/checks/#ST1013
        - ST1013
        # A switch's default case should be the first or last case.
        # https://staticcheck.dev/docs/checks/#ST1015
        - ST1015
        # Use consistent method receiver names.
        # https://staticcheck.dev/docs/checks/#ST1016
        - ST1016
        # Don't use Yoda conditions.
        # https://staticcheck.dev/docs/checks/#ST1017
        - ST1017
        # Avoid zero-width and control characters in string literals.
        # https://staticcheck.dev/docs/checks/#ST1018
        - ST1018
        # Importing the same package multiple times.
        # https://staticcheck.dev/docs/checks/#ST1019
        - ST1019
        # The documentation of an exported function should start with the function's name.
        # https://staticcheck.dev/docs/checks/#ST1020
        - ST1020
        # The documentation of an exported type should start with type's name.
        # https://staticcheck.dev/docs/checks/#ST1021
        - ST1021
        # The documentation of an exported variable or constant should start with variable's name.
        # https://staticcheck.dev/docs/checks/#ST1022
        - ST1022
        # Redundant type in variable declaration.
        # https://staticcheck.dev/docs/checks/#ST1023
        - ST1023
        # Use plain channel send or receive instead of single-case select.
        # https://staticcheck.dev/docs/checks/#S1000
        - S1000
        # Replace for loop with call to copy.
        # https://staticcheck.dev/docs/checks/#S1001
        - S1001
        # Omit comparison with boolean constant.
        # https://staticcheck.dev/docs/checks/#S1002
        - S1002
        # Replace call to 'strings.Index' with 'strings.Contains'.
        # https://staticcheck.dev/docs/checks/#S1003
        - S1003
        # Replace call to 'bytes.Compare' with 'bytes.Equal'.
        # https://staticcheck.dev/docs/checks/#S1004
        - S1004
        # Drop unnecessary use of the blank identifier.
        # https://staticcheck.dev/docs/checks/#S1005
        - S1005
        # Use "for { ... }" for infinite loops.
        # https://staticcheck.dev/docs/checks/#S1006
        - S1006
        # Simplify regular expression by using raw string literal.
        # https://staticcheck.dev/docs/checks/#S1007
        - S1007
        # Simplify returning boolean expression.
        # https://staticcheck.dev/docs/checks/#S1008
        - S1008
        # Omit redundant nil check on slices, maps, and channels.
        # https://staticcheck.dev/docs/checks/#S1009
        - S1009
        # Omit default slice index.
        # https://staticcheck.dev/docs/checks/#S1010
        - S1010
        # Use a single 'append' to concatenate two slices.
        # https://staticcheck.dev/docs/checks/#S1011
        - S1011
        # Replace 'time.Now().Sub(x)' with 'time.Since(x)'.
        # https://staticcheck.dev/docs/checks/#S1012
        - S1012
        # Use a type conversion instead of manually copying struct fields.
        # https://staticcheck.dev/docs/checks/#S1016
        - S1016
        # Replace manual trimming with 'strings.TrimPrefix'.
        # https://staticcheck.dev/docs/checks/#S1017
        - S1017
        # Use "copy" for sliding elements.
        # https://staticcheck.dev/docs/checks/#S1018
        - S1018
        # Simplify "make" call by omitting redundant arguments.
        # https://staticcheck.dev/docs/checks/#S1019
        - S1019
        # Omit redundant nil check in type assertion.
        # https://staticcheck.dev/docs/checks/#S1020
        - S1020
        # Merge variable declaration and assignment.
        # https://staticcheck.dev/docs/checks/#S1021
        - S1021
        # Omit redundant control flow.
        # https://staticcheck.dev/docs/checks/#S1023
        - S1023
        # Replace 'x.Sub(time.Now())' with 'time.Until(x)'.
        # https://staticcheck.dev/docs/checks/#S1024
        - S1024
        # Don't use 'fmt.Sprintf("%s", x)' unnecessarily.
        # https://staticcheck.dev/docs/checks/#S1025
        - S1025
        # Simplify error construction with 'fmt.Errorf'.
        # https://staticcheck.dev/docs/checks/#S1028
        - S1028
        # Range over the string directly.
        # https://staticcheck.dev/docs/checks/#S1029
        - S1029
        # Use 'bytes.Buffer.String' or 'bytes.Buffer.Bytes'.
        # https://staticcheck.dev/docs/checks/#S1030
        - S1030
        # Omit redundant nil check around loop.
        # https://staticcheck.dev/docs/checks/#S1031
        - S1031
        # Use 'sort.Ints(x)', 'sort.Float64s(x)', and 'sort.Strings(x)'.
        # https://staticcheck.dev/docs/checks/#S1032
        - S1032
        # Unnecessary guard around call to "delete".
        # https://staticcheck.dev/docs/checks/#S1033
        - S1033
        # Use result of type assertion to simplify cases.
        # https://staticcheck.dev/docs/checks/#S1034
        - S1034
        # Redundant call to 'net/http.CanonicalHeaderKey' in method call on 'net/http.Header'.
        # https://staticcheck.dev/docs/checks/#S1035
        - S1035
        # Unnecessary guard around map access.
        # https://staticcheck.dev/docs/checks/#S1036
        - S1036
        # Elaborate way of sleeping.
        # https://staticcheck.dev/docs/checks/#S1037
        - S1037
        # Unnecessarily complex way of printing formatted string.
        # https://staticcheck.dev/docs/checks/#S1038
        - S1038
        # Unnecessary use of 'fmt.Sprint'.
        # https://staticcheck.dev/docs/checks/#S1039
        - S1039
        # Type assertion to current type.
        # https://staticcheck.dev/docs/checks/#S1040
        - S1040
        # Apply De Morgan's law.
        # https://staticcheck.dev/docs/checks/#QF1001
        - QF1001
        # Convert untagged switch to tagged switch.
        # https://staticcheck.dev/docs/checks/#QF1002
        - QF1002
        # Convert if/else-if chain to tagged switch.
        # https://staticcheck.dev/docs/checks/#QF1003
        - QF1003
        # Use 'strings.ReplaceAll' instead of 'strings.Replace' with 'n == -1'.
        # https://staticcheck.dev/docs/checks/#QF1004
        - QF1004
        # Expand call to 'math.Pow'.
        # https://staticcheck.dev/docs/checks/#QF1005
        - QF1005
        # Lift 'if'+'break' into loop condition.
        # https://staticcheck.dev/docs/checks/#QF1006
        - QF1006
        # Merge conditional assignment into variable declaration.
        # https://staticcheck.dev/docs/checks/#QF1007
        - QF1007
        # Omit embedded fields from selector expression.
        # https://staticcheck.dev/docs/checks/#QF1008
        - QF1008
        # Use 'time.Time.Equal' instead of '==' operator.
        # https://staticcheck.dev/docs/checks/#QF1009
        - QF1009
        # Convert slice of bytes to string when printing it.
        # https://staticcheck.dev/docs/checks/#QF1010
        - QF1010
        # Omit redundant type from variable declaration.
        # https://staticcheck.dev/docs/checks/#QF1011
        - QF1011
        # Use 'fmt.Fprintf(x, ...)' instead of 'x.Write(fmt.Sprintf(...))'.
        # https://staticcheck.dev/docs/checks/#QF1012
        - QF1012
```

### tagalign

<Badge text="Autofix" type="info" />

检查结构体的标签是否对齐了。

### tagliatelle

检查结构体的标签。

### testableexamples

检查例子是否可以测试（有预期的输出）。

### testifylint

<Badge text="Autofix" type="info" />

检查`github.com/stretchr/testify`的用法。

### testpackage

应当使用一个单独的`_test`包。

### thelper

检查 tests helpers 是否没有以`t.Helper()`方法开头。

### tparallel

检查你的Go测试代码中`t.Parallel()`方法的错误用法。

### unconvert

移除不需要的类型转换。

### unparam

检查未使用的函数参数。

### unqueryvet

检查 SQL 语句或者 SQL builders 中的 `SELECT *`，避免一些性能问题，鼓励明确的列选择。

### unused

检测Go代码中未使用的常量、变量、函数和类型。

### usestdlibvars

<Badge text="Autofix" type="info" />

检测是否有可以替换为标准库中的变量/常量的代码。

### usetesting

<Badge text="Autofix" type="info" />

检测使用的函数是否可以被`testing`包中的函数代替。

### varnamelen

检查变量名称的长度是否与其作用域匹配。

### wastedassign

检测没用的赋值语句。

### whitespace

<Badge text="Autofix" type="info" />

检查函数、`if`语句、`for`语句开头或结尾无意义的空行。

### wrapcheck

检查来自外部包的`error`是否被封装。

### wsl

<Badge text="从v2.2.0开始弃用" type="danger" />

已废弃，请使用[wsl_v5](#wsl_v5)。

### wsl_v5h

<Badge text="Autofix" type="info" />

增加或删除空行。

### zerologlint

检查`zerolog`的错误用法，例如用户忘记使用`Send`或`Msg`分配。 