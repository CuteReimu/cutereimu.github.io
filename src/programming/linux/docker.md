---
title: docker常用命令汇总
order: 4
category: 编程日记
icon: b:docker
tags:
  - Linux
date: 2026-03-26
---

<!-- more -->

```bash :no-line-numbers :no-collapsed-lines
# 彻底清理系统
docker system prune -a -f

# 运行容器
docker run -d --name <容器名> <镜像名>

# 列出所有容器
docker ps

# 列出所有镜像
docker images

# 强制删除容器
docker rm -f <容器名>

# 删除镜像
docker rmi <镜像名>

# 拉取镜像（指定系统）
docker pull --platform linux/amd64 <镜像名>

# 保存镜像到tar文件（指定系统）
docker save --platform linux/amd64 -o <文件名>.tar <镜像名>

# 从tar文件加载镜像
docker load -i <文件名>.tar
```