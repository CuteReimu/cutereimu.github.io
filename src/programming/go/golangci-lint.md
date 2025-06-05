---
title: golangci-lint代码检查工具
icon: b:golang
order: 5
category: 编程日记
tags: 
  - Go
toc: false
lastUpdated: true
---

golangci-lint是一个Go语言的代码静态检查工具集，官网是[https://golangci-lint.run/](https://golangci-lint.run/)，它集成了多个流行的linters，可以帮助我们快速发现代码中的潜在问题。

<!-- more -->

::: warning 注意

请注意文末的修改时间，以下内容截止`2.1.6`版本。

:::

使用以下命令即可安装`golangci-lint`：

```bash :no-line-numbers
# binary will be $(go env GOPATH)/bin/golangci-lint
curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/HEAD/install.sh | sh -s -- -b $(go env GOPATH)/bin v2.1.6

golangci-lint --version
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

更详细的示例可以参考[https://golangci-lint.run/usage/configuration/](https://golangci-lint.run/usage/configuration/)

以下列出了`golangci-lint`的所有可用的linters，详细使用说明请参考[https://golangci-lint.run/usage/linters/](https://golangci-lint.run/usage/linters/)

```yml :no-line-numbers :collapsed-lines=8 title=".golangci.yml"
version: "2"
linters:
  enable:
    - errcheck # 检查未处理的错误
    - govet # 类似`go vet`工具
    - ineffassign # 检查无效的赋值
    - staticcheck # https://staticcheck.dev/
    - unused # 检查未使用的变量、函数、类型等
    # 以上是`standard`默认集中启用的linters
    - asasalint # 检查将[]any误当作any传入了func(...any)的情况
    - asciicheck # 检查变量、函数、类型命名是否包含非ASCII字符
    - bidichk # 检查代码中是否包含某些不可见字符，例如right-to-left控制字符等
    - bodyclose # 检查HTTP响应体是否被关闭
    - canonicalheader # 检查HTTP的HEAD头是否符合规范
    - containedctx # 结构体不应该包含`context.Context`类型的字段
    - contextcheck # 禁止直接将`context.Background()`或`context.TODO()`传递给函数
    - copyloopvar # Go 1.22版本开始，循环变量在每次迭代时都会被复制，因此不需要担心循环变量被修改的问题
    - cyclop # 复杂度检查
    - decorder # 类型、常量、变量、函数等需要正确排序
    - depguard # 检查依赖的包是否符合规范
    - dogsled # 检查太多的 _ 变量
    - dupl # 检查重复的代码
    - dupword # 检查字符串中重复的单词
    - durationcheck # 检查代码中`time.Second * time.Second`之类的错误
    - err113 # 检查错误处理是否符合规范
    - errchkjson # 检查是否忽略了json的错误处理
    - errname # 检查错误变量的命名是否使用了`Err`前缀
    - errorlint # 错误比较应该使用`errors.Is`或`errors.As`，错误格式化应该使用"%w"而不是"%v"
    - exhaustive # 检查 switch 语句是否包含了所有分支
    - exhaustruct # 检查结构体声明是否包含了所有字段
    - exptostd # 检查`golang.org/x/exp/`包中的函数是否可以替换为标准库中的函数
    - fatcontext # 检查循环或函数调用中对`context.Context`的覆盖
    - forbidigo # 检查禁止使用的代码
    - forcetypeassert # 检查强制类型转换
    - funcorder # 检查函数、方法、构造器的顺序是否符合规范
    - funlen # 函数长度检查
    - ginkgolinter # ginkgo和gomeka
    - gocheckcompilerdirectives # 检查//go:命令是否正确
    - gochecknoglobals # 禁止使用全局变量
    - gochecknoinits # 禁止使用init函数
    - gochecksumtype # https://github.com/alecthomas/go-check-sumtype
    - gocognit # 复杂度检查
    - goconst # 部分重复的字符串可以替换为常量
    - gocritic # 注释风格问题
    - gocyclo # 复杂度检查
    - godot # 注释风格问题
    - godox # todo检查
    - goheader # 检查文件头是否符合规范
    - gomoddirectives # 检查go.mod文件是否符合规范
    - gomodguard # 检查go.mod文件是否符合规范，类似depguard
    - goprintffuncname # 检查Print类函数不小心加了f
    - gosec # 代码安全检查
    - gosmopolitan # 检查是否满足多语言兼容性
    - grouper # 检查const、var等声明应该使用分组
    - iface # 检查接口的使用是否符合规范
    - importas # 确保导入包的别名是固定的，不会胡乱使用
    - inamedparam # 检查接口的方法形参是否都命名了
    - interfacebloat # 检查 interface 有太多方法
    - intrange # 检查 for i := range xxx 相关的问题
    - ireturn # 函数不应该返回接口类型
    - lll # 检查太长的行
    - loggercheck # 对常用的日志库的检查
    - maintidx # 复杂度检查
    - makezero # 检查切片初始化的错误
    - mirror # 有些Write([]byte(s))函数可以改为WriteString(s)函数
    - misspell # 检查拼写错误
    - mnd # 检查魔法数字
    - musttag # 检查调用了(un)marshaled函数的struct都必须有`tag`
    - nakedret # 太长的函数不应该含有裸返回值
    - nestif # 检查嵌套的if语句
    - nilerr # 当得到err!=nil是，仍然返回了一个nil的error
    - nilnesserr # 同上
    - nilnil # 检查返回的error为nil时，前面一个返回参数也是nil
    - nlreturn # 检查函数返回值的换行
    - noctx # 检查http相关函数参数中是否包含`context.Context`类型的参数
    - nolintlint # 检查nolint注释是否符合规范
    - nonamedreturns # 函数不得使用命名返回值
    - nosprintfhostport # `host:port`不应该使用`fmt.Sprintf`拼接
    - paralleltest # 在测试中未使用`t.Parallel()`方法
    - perfsprint # 检查`fmt.Sprintf`是否可以被简化
    - prealloc # 检查切片的预分配
    - predeclared # 检查预定义的变量
    - promlinter # https://github.com/yeya24/promlinter
    - protogetter # proto的字段应该使用getter方法访问
    - reassign # 检查包变量被重新赋值
    - recvcheck # 同时有指针和非指针的接收器
    - revive # https://github.com/mgechev/revive
    - rowserrcheck # 检查`sql.Rows`的错误处理是否正确
    - sloglint # 检查`slog`日志库的使用是否正确
    - spancheck # 检查OpenTelemetry spans和OpenCensus spans包的使用是否正确
    - sqlclosecheck # 检查`sql.DB`、`sql.Tx`、`sql.Rows`等的关闭
    - tagalign # 检查结构体的`tag`是否对齐
    - tagliatelle # 结构体`tag`的命名规范
    - testableexamples # 检查示例代码是否可测试
    - testifylint # 检查`testify`库的使用是否正确
    - testpackage # 检查测试文件是否应该处于`_test`包
    - thelper # 检查测试文件中的`t.Helper()`
    - tparallel # 检查测试函数中的`t.Parallel()`
    - unconvert # 检查不必要的类型转换
    - unparam # 未使用的参数
    - usestdlibvars # 检查有些内容是否可以替换为标准库的变量
    - usetesting # 在测试代码中，有些函数可以替换为`testing`包中的专用测试函数
    - varnamelen # 变量名长度过短
    - wastedassign # 检查无用的赋值
    - whitespace # 检查空行
    - wrapcheck # 是否errors被包了一层
    - wsl # 空行规范
    - zerologlint # 检查`zerolog`库的使用是否正确
```