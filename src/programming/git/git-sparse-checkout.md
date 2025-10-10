---
title: git稀疏检出
order: 5
category: 编程日记
tags:
  - Git
icon: b:git-alt
date: 2025-10-10
toc: false
---

使用git时，我们有时候并不需要整个代码库的所有内容，只需要其中的一部分内容。尤其当目标仓库很大时，这个功能就更为常用了。这时，我们可以使用git的**稀疏检出**功能（sparse checkout）来实现。

<!-- more -->

稀疏检出有两种不同行为模式：

[[toc]]

它们在模式匹配方式、性能和易用性上有显著区别。接下来我们会分别介绍。

### 锥形模式（Cone Mode）

我们以这个仓库[https://github.com/CuteReimu/fengsheng-doc.git](https://github.com/CuteReimu/fengsheng-doc.git)为例，介绍如何只检出其中的`docs/document`目录：

::: code-tabs#1

@tab git 2.25+

```bash :no-collapsed-lines :no-line-numbers
# 克隆时只下载最近一次的提交历史和树结构，不下载文件内容
git clone --filter=blob:none --sparse --depth=1 https://github.com/CuteReimu/fengsheng-doc.git
cd fengsheng-doc

# 设置要检出的目录
git sparse-checkout set "docs/document"

# 如果需要添加更多目录
git sparse-checkout add "docs/README.md"
```

@tab 传统方式

```bash :no-collapsed-lines :no-line-numbers
# 1. 创建并进入新目录
mkdir fengsheng-doc && cd fengsheng-doc

# 2. 初始化 Git 仓库
git init

# 3. 添加远程仓库
git remote add origin https://github.com/CuteReimu/fengsheng-doc.git

# 4. 启用稀疏检出
git config core.sparseCheckout true

# 5. 指定要检出的路径
echo "docs/document" > .git/info/sparse-checkout
echo "docs/README.md" >> .git/info/sparse-checkout

# 6. 拉取数据（浅克隆 + 稀疏检出）
git pull --depth=1 origin main
```

:::

::: warning 注意

值得一提的是`sparse-checkout`命令是git从2.25版本开始支持的一个新特性，使用前你需要用`git version`命令检查自己的git版本号。如果`git`版本较低，你可以使用传统方式。

:::

锥形模式的性能较高、占用内存较小，但缺点只能指定哪些内容需要检出，对于一些复杂的需求就无法实现了。

想要取消稀疏检出，转而检出所有文件，可以使用如下命令：

::: code-tabs#1

@tab git 2.25+

```bash
git sparse-checkout disable
```

@tab 传统方式

```bash :no-line-numbers
# 取消 config 设置
git config --unset core.sparseCheckout

# 删除配置文件
rm -f .git/info/sparse-checkout

# 重置工作目录
git read-tree -mu HEAD
```

:::

### 非锥形模式（Non-Cone Mode）

接下来我们介绍一下如何检出某个文件夹的同时，排除其某个子目录。

```bash :no-collapsed-lines :no-line-numbers
git clone --filter=blob:none --sparse --depth=1 https://github.com/CuteReimu/fengsheng-doc.git
cd fengsheng-doc

# 设置稀疏检出（非锥形模式）
git sparse-checkout init --no-cone

echo "docs" >> .git/info/sparse-checkout
echo "!docs/.vuepress" # 排除路径

# 应用更改
git sparse-checkout reapply 

git pull --depth=1 origin main
```

我们可以打开`.git/info/sparse-checkout`文件看一看，它是这样的：

```console
$ cat .git/info/sparse-checkout
docs
!docs/.vuepress
```

非锥形模式支持使用`!`来指定排除某个路径，其的灵活性更高，可以实现更复杂的需求，但性能相对较低，占用内存也较多。