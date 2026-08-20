---
title: Github 的 GraphQL API
order: 7
category: 编程日记
tags:
  - Git
  - Github
icon: b:github
date: 2026-08-20
---

今天我们聊一聊如何调用 Github 的 GraphQL API 接口。

我们就以 [https://github.com/anuraghazra/github-readme-stats](https://github.com/anuraghazra/github-readme-stats) 这个仓库为例，它用于获取自己的 Github 信息，并生成漂亮的统计图表，展示在自己的 README 中。例如：

<!-- more -->

![top-langs.svg](/top-langs.svg)

我们先举一个简单的 GraphQL 例子：

```graphql :no-line-numbers
query userInfo($login: String!) {
  user(login: $login) {
    name
    bio
    repositories(first: 5) {
      totalCount
      nodes {
        name
      }
    }
  }
}
```

其中`query userInfo`表示调用这个接口，圆括号里面的内容是传入的参数，后面大括号里的内容是希望服务器返回的JSON结构。

我们可以通过 Github 提供的命令行工具 `gh` 来简单地测试一下。首先可以在 [Github 文档](https://docs.github.com/zh/github-cli)中找到 `gh` 的安装方法，安装并登录后，即可执行：

```bash :no-line-numbers
gh api graphql -f query='query userInfo($login: String!) {
  user(login: $login) {      
    name                                      
    bio                                                                                       
    repositories(first: 5) {
      totalCount  
      nodes {                                                               
        name           
      }               
    }                   
  }                      
}' -f login='CuteReimu' 
```

就可以得到如下返回：

```json :no-line-numbers :no-collapsed-lines
{
  "data": {
    "user": {
      "name": "奇葩の灵梦",
      "bio": "Go / Java / Kotlin / Erlang / C++ / Python / TypeScript / Vue 苦手",
      "repositories": {
        "totalCount": 85,
        "nodes": [
          {
            "name": "Touhou-Freshman-Camp-Robot"
          },
          {
            "name": "HollowKnightComSoB"
          },
          {
            "name": "hksplitmaker"
          },
          {
            "name": "gobang"
          },
          {
            "name": "CuteReimu"
          }
        ]
      }
    }
  }
}
```

::: note 补充

`gh` 命令行除了用于 GraphQL API 请求之外，还有很多功能，例如：

```bash
# 查询某个仓库的语言信息
gh repo view CuteReimu/cutereimu.github.io --json languages
```

这些用法都可以在 [Github 文档](https://docs.github.com/zh/github-cli)中找到。这些内容与本文无关，就不过多赘述了。

::: 

获取 Top Langs 的 GraphQL 查询语句会更复杂一些：

```graphql :no-line-numbers
query userInfo($login: String!) {  
  user(login: $login) {
    # fetch only owner repos & public & not forks
    repositories(ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, first: 100) {
      nodes {
        name
        languages(first: 5, orderBy: {field: SIZE, direction: DESC}) { 
          edges {
            size
            node {
              color
              name
            }
          }
        }
      }
    }
  }
}
```

这样一来，就可以得到每个仓库排名前5的语言，以及每种语言的代码量大小。然后我们在本地利用代码解析这个JSON返回即可得到每种语言的总代码量，最后就可以生成漂亮的统计图表了。

关于 Github 的 GraphQL API 支持的各种请求和参数，可以前往 [Github 文档](https://docs.github.com/zh/graphql)进行了解。