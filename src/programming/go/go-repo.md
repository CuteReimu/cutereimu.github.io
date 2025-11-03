---
title: 我用过的 Go 开源库汇总
icon: b:golang
order: 6
category: 编程日记
tags: 
  - Go
  - 开源库
date: 2025-05-30
---

整理了一下我用过的 Go 开源第三方库，供大家参考。使用时请注意遵守各个库的开源协议。

<!-- more -->

以下外链会跳转到对应项目的官网（如果有）或 GitHub 仓库。

**代码质量工具**

- [**golangci-lint**](https://golangci-lint.run/)是著名的 Go 代码静态检查工具集，集成了多个流行的 linters，可以帮助我们快速发现代码中的潜在问题。在 Jetbrains Goland 2025版本开始，已经内置了对 golangci-lint 的支持，可以直接在 IDE 中使用，这更加说明了大家对 golangci-lint 的认可。使用方法可以参考[我的另一篇文章](golangci-lint.md)。

- [**testify**](https://github.com/stretchr/testify)是一个流行的 Go 测试框架，提供了丰富的断言和模拟功能，可以帮助我们编写更易读、更易维护的测试代码。它的知名度也是有目共睹。在 golangci-lint 中，也包含了对 testify 代码规范检查的 linter。

**Web框架**

- [**gin**](https://gin-gonic.com/)是一个高性能的 Go Web 框架，它的性能和易用性都非常出色。我们都知道，对于一个 http 请求，按照标准的处理流程，需要考虑对请求的解析、路由、处理、响应等多个环节，其中有很多对请求头和请求体的解析等处理，如果纯用Go自带的`http`库进行操作，会非常麻烦。这些内容 gin 都为我们封装好了，我们只需要关注业务逻辑即可。

- [**resty**](https://github.com/go-resty/resty)对应于上面的 Go Web 服务端框架gin，resty是一个功能强大的 Go HTTP 客户端库，提供了丰富的功能来处理 HTTP 请求和响应。它支持链式调用、请求重试、请求拦截器等功能，非常适合用于构建复杂的 HTTP 客户端应用。resty 的 API 设计非常友好，易于使用。

- [**gorilla/websocket**](https://github.com/gorilla/websocket)是一个流行的 Go WebSocket 库，提供了简单易用的 API 来处理 WebSocket 连接，支持 Websocket 的服务端和客户端。这也是在 Go 中处理 WebSocket 的非常通用的一个库。

**其它服务端框架**

- [**davyxu/cellnet**](https://github.com/davyxu/cellnet)相比较而言，这并不是一个比较知名的库，可靠性和稳定性可能有缺陷，并且年久失修。但其作者是国内的，并且项目的文档主要是中文文档，非常简单易用。如果对项目的稳定性要求并不是特别高，仅仅是想快速搭建一个 TCP/UDP/WebSocket/HTTP 服务器的话，可以考虑使用这个库。我针对这个库还开发了一些[扩展](https://github.com/CuteReimu/cellnet-plus)，使其支持KCP，以及不同格式的TCP、UDP包。

- [**protoactor**](https://proto.actor/)是一个基于 Actor 模型的 Go 服务端框架，提供了高性能的并发处理能力。它的设计灵感来自 Erlang 的 Actor 模型，适合用于构建分布式系统和微服务架构。对于我这种有 Erlang 基础的开发者来说，Actor 模型的编程模型非常熟悉，使用起来也非常顺手。protoactor 是跨语言的，支持 Go 和 C#，并且支持多节点。尽管目前只是预发布版本，不排除接口会有变动，但稳定性和可靠性还是不错的。

**数据库**

- [**badger**](https://docs.hypermode.com/badger)是一个高性能的嵌入式键值对数据库，适用于需要快速读写操作的场景。它可以嵌入到自己的 Go 代码中。badger 基于 Go 的`mmap`库(内存映射)，性能非常出色，可靠性也非常高，甚至不用太担心突然宕机等的极端问题。badger 也拥有自己的命令行工具，可以轻松访问数据库内容。在不打算使用 mysql、redis 等大型数据库的情况下，badger 是我非常喜欢的使用的一个内嵌型数据库。

**图形界面**

- [**ebiten**](https://ebitengine.org/)是一个2D的游戏引擎，使用 Go 语言编写，提供了简单易用的 API 来创建2D游戏和图形应用。ebiten 的性能非常出色，并且支持多平台，包括 Windows、macOS、Linux、Android 和 iOS。我自己做的[五子棋](https://github.com/CuteReimu/gobang)的Go语言版本就是用的这个库。

- [**walk**](https://github.com/lxn/walk)是一个用于创建 Windows GUI 应用程序的 Go 库，提供了丰富的控件和布局管理功能，适合用于开发 Windows 桌面应用程序。虽然这个库已经很久没有更新了，但如果你需要使用 Go 开发 Windows 桌面应用程序，它仍然是一个不错的选择。

- [**gogleman/gg**](https://github.com/fogleman/gg)是一个2D的图形库，可以用它来快速画图。

- [**go-charts**](https://github.com/vicanso/go-charts)是一个快速生成图表的 Go 库，支持多种图表类型，包括折线图、柱状图、饼图等。它可以生成 SVG 或 PNG 格式的图表，非常适合用于数据可视化。不过，这个库目前已经归档，不再维护了。

**文本处理**

- [**viper**](https://github.com/spf13/viper)是一个用于处理配置文件的 Go 库，支持多种格式，包括 JSON、YAML、TOML 等。它提供了简单易用的 API 来读取和写入配置文件，并且支持热加载配置文件。viper 是 Go 生态中非常流行的配置库，很多项目都在使用它。

- [**gjson**](https://github.com/tidwall/gjson)是一个用于快速解析 JSON 的 Go 库，提供了简单易用的 API 来读取和查询 JSON 数据。它的性能非常出色，并且支持多种查询方式，包括点语法、数组索引等。gjson 是处理 JSON 数据的利器，比起 Go 自带的`json`库，在用于处理大规模的 JSON 数据时表现更为突出。

- [**regexp2**](https://github.com/dlclark/regexp2)是一个 Go 的正则表达式库。由于 Go 自带的`regexp`库不支持一些高级的正则表达式特性，这个库提供了更强大的正则表达式功能。它的 API 与 Go 自带的`regexp`库类似，可以很容易地替换掉原有的正则表达式代码。