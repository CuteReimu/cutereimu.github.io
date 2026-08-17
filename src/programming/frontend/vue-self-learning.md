---
title: 自学Vue踩坑笔记
order: 4
category: 编程日记
tags:
  - 前端
  - Vue
icon: b:vuejs
date: 2026-08-14
toc: false
---

本文是一些自学Vue时的踩坑记录。

<!-- more -->

## 自闭合标签和`v-else`的坑

```vue {2,3}
<el-form-item label="名字">
  <el-input v-if="isDefaultName" v-model="defaultName" disabled />
  <el-input v-else v-model="name" />
</el-form-item>
<el-checkbox v-model="isDefaultName" label="使用默认名字" />
```

这里的`v-if`和`v-else`看起来是对的，但是实际上会解析报错。像<el-input/>这种**自闭合标签**写法，Vue就在解析`v-else`时，就会找不到相邻的上一个`v-if`，就会解析报错。正确的写法是不要用自闭合标签：

```vue {2,3}
<el-form-item label="名字">
  <el-input v-if="isDefaultName" v-model="defaultName" disabled></el-input>
  <el-input v-else v-model="name"></el-input>
</el-form-item>
<el-checkbox v-model="isDefaultName" label="使用默认名字" />
```

## `v-if`和`v-for`同时使用

```vue
<div v-if="item.visible" v-for="item in items" :key="item.id">
  {{ item.content }}
</div>
```

这里`v-if`和`v-for`同时使用，Vue会视为`v-if`在外层，`v-for`在内层，如下：

```js
if (item.visible) {
  for (const item of items) {
    // ...
  }
}
```

因此这个`item.visible`显然会报错。那如果换个顺序，`v-for`写在前面，`v-if`写在后面呢？实际上，Vue同样会视为`v-if`在外层，`v-for`在内层。

那么想要`v-for`在外层，正确的写法应该是：

```vue
<template v-for="item in items" :key="item.id">
  <div v-if="item.visible">
    {{ item.content }}
  </div>
</template>
```