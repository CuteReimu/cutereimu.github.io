---
title: git如何删除某文件的历史记录
order: 6
category: Git
tags:
  - Git
icon: b:git-alt
---

有些时候不小心上传了一些敏感文件，或者有一些二进制文件（例如图片）不再需要，想要从仓库中删除。但别人clone你的代码仓库时，这些内容仍然存在于git历史记录中。

因此，我们有时候需要删除文件的所有历史记录。执行以下命令即可：

```bash
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch path-to-file' --prune-empty --tag-name-filter cat -- --all
```

将其中的`path-to-file`替换为你要删除的文件路径。

检查无误之后，强制推送到远程仓库：

```bash
git push origin --force --all
git push origin --force --tags
```

（可选）然后你可以考虑执行`git gc`命令来清理本地的git缓存。

<style scope>
.shiki {
  text-wrap: auto;
}
</style>