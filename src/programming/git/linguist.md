---
title: GitHub代码语言识别
order: 3
category: 编程日记
tags:
  - GitHub
  - Linguist
icon: b:github
date: 2024-08-08
---

[Linguist](https://github.com/github/linguist) 是 GitHub 官方用于检测和高亮代码仓库中各种编程语言的工具，主要用于**代码语言识别**、**语法高亮**、**代码统计与标签**、**自动归类与过滤**等。

可以通过在仓库下新增`.gitattributes`文件对 Linguist 的行为进行定制，比如强制指定文件类型、忽略某些文件等。

举个例子：

```properties :no-line-numbers title=".gitattributes"
# 将所有的 .rb 文件标记为 Java 语言
*.rb linguist-language=Java

# 用-替代语言名中的空格
*.glyphs linguist-language=OpenStep-Property-List

# 语言名大小写不敏感，并且可以使用别名，以下三行是等价的
*.es linguist-language=js
*.es linguist-language=JS
*.es linguist-language=JAVASCRIPT
```

以下是支持的属性：

| 属性                                             | 备注                                 |
|:-----------------------------------------------|:-----------------------------------|
| `linguist-detectable`                          | 即使语言类型为 `data` 或 `prose`，也计入统计     |
| `linguist-documentation`                       | 不计入统计                              |
| `linguist-generated`                           | 不计入统计，在 diff 中隐藏                   |
| `linguist-language`=<var><ins>name</ins></var> | 以 <var><ins>name</ins></var> 高亮和归类 |
| `linguist-vendored`                            | 不计入统计                              |

### Detectable

默认情况下，只有类型为 `programming` 或 `markup` 的语言才会计入语言统计。其它类型的语言默认不会被统计为 detectable，因此不会计入语言统计，但可以如下面方式使其计入语言统计：

```properties :no-line-numbers title=".gitattributes"
# 计入统计
*.kicad_pcb linguist-detectable
*.sch linguist-detectable

# 取消计入统计
tools/export_bom.py -linguist-detectable
```

### Documentation

默认情况下 Linguist 会将文档文件从语言统计中排除。你可以使用 `linguist-documentation` 属性标记或取消标记路径为文档：

```properties :no-line-numbers title=".gitattributes"
# 标记为文档
project-docs/* linguist-documentation
ano-dir/** linguist-documentation

# 取消标记为文档
docs/formatter.rb -linguist-documentation
```

### Generated

有些文件其实是生成文件，应该将其排除在仓库语言统计之外。此外，这些文件在 diff 中也会被自动隐藏。你可以使用 `linguist-generated` 属性标记或取消标记路径为生成文件：

```properties :no-line-numbers title=".gitattributes"
Api.elm linguist-generated
```

### Vendored

有些第三方依赖会虚高项目的语言统计，甚至可能导致项目被误判为另一种语言。你可以使用 `linguist-vendored` 属性标记或取消标记路径为第三方依赖：

```properties :no-line-numbers title=".gitattributes"
# 标记为第三方依赖
special-vendored-path/* linguist-vendored
ano-dir/** linguist-vendored

# 取消标记为第三方依赖
jquery.js -linguist-vendored
```

### 参考资料
- [https://github.com/github-linguist/linguist/blob/main/docs/overrides.md](https://github.com/github-linguist/linguist/blob/main/docs/overrides.md)
- [https://git-scm.com/docs/gitattributes](https://git-scm.com/docs/gitattributes)