---
title: 开源协议简介
icon: file
order: 10
category: 编程日记
tags:
  - 开源协议
---
**开源协议**通常指的是经过**开放源代码倡议**组织批准，符合其**开源定义**的许可证。

<!-- more -->

## 一、宽松型许可证
这类许可证对使用者限制最少，基本上只要署名，你就可以自由使用、修改、分发，甚至作为闭源的商业软件发布。

1. **MIT License**
   - 非常简短、宽松，是目前最流行的许可证之一，基本上只需要在副本中包含原始版权声明和许可文本。常见的jQuery, .NET Core, Rails等都在使用这个开源许可证。
2. **Apache License 2.0**
   - 比MIT更详细，提供了明确的专利授权和保护，并且要求对修改过的文件进行说明，要求包含署名、修改声明、专利授权。常见的Android, Apache HTTP Server, Kubernetes等都在使用这个开源许可证。
3. **BSD Licenses**
   - **BSD 2-Clause “Simplified” License**： 和MIT非常相似，非常宽松。
   - **BSD 3-Clause “New” or “Revised” License**： 在2条款基础上，增加了一条“不得使用著作权人的名字为衍生品背书”的条款。

## 二、GPL类许可证
这类许可证要求任何包含本项目代码的衍生作品，在分发时都必须以相同的许可证完全开源。不同的版本限制略微有所区别。

1. **GNU General Public License (GPL)**
   - 分为v2和v3两个版本，非常著名和严格。要求任何分发衍生作品的行为，都必须公开整个作品的完整源代码。常见的Linux内核, GCC, Git等都在使用这个开源许可证。

2. **GNU Lesser General Public License (LGPL)**
   - 主要用于软件库。在GPL的基础上，如果只是作为库链接使用，则不一定需要开源。但如果你修改了LGPL库本身，则必须将修改部分开源。常见的Glibc, GTK等都在使用这个开源许可证。

3. **GNU Affero General Public License (AGPL)**
   - 它弥补了GPL的一个“漏洞”：如果一个基于GPL的软件被部署在网络上提供服务（SaaS），而没有“分发”二进制文件，那么GPL不要求其开源。但AGPL要求这种情况也必须开源。常见的MongoDB (早期版本), Nextcloud等都在使用这个开源许可证。

## 四、公共领域与极简许可证
这类许可证旨在提供比MIT等更极致的自由。

1. **Unlicense**
   - 这更像是一种“放弃版权，投入公共领域”的声明，而不是一个典型的许可证。它旨在最大程度地摆脱版权限制。但请注意，在某些法域，完全放弃版权可能不被法律认可。
2. **WTFPL – Do What The F\*\*\* You Want To Public License**
   - 极其简短和直白，本质上就是“爱干嘛干嘛”。但它可能在某些企业环境中因为其名称和缺乏明确的法律条文而不被接受。
3. **CC0 – Creative Commons Zero**
   - 这不是一个软件许可证，而是一种放弃版权及相关权利，将作品置于“公共领域”的法律工具。在软件领域，它常被用于数据、代码片段等。

## 如何选择

- **主流项目**：优先选择 **MIT、Apache 2.0、GPL（v2/v3）**，因为它们认知度高，法律条款清晰。
- **库/框架**：如果想被广泛使用，选 **MIT** 或 **Apache 2.0**；如果想保护库本身的改进，选 **LGPL**。
- **想最大程度“传染”开源**：选 **GPL**。
- **针对SaaS/网络服务**：考虑 **AGPL**。
- **个人小工具/脚本**：如果你完全不在意，可以用 **Unlicense** 或 **WTFPL**。

你也可以前往[Open source initiative](https://opensource.org/)和[Choose a license](https://choosealicense.com/)获取详细的内容。
