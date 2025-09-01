---
title: 通讯录（.vcf）文件简介
icon: book
order: -2
category: 编程日记
tags:
  - Python
  - VCard
date: 2025-08-30
---

.vcf 文件，也称为 VCard 文件，是一种用于存储联系人信息的标准文件格式。它通常用于电子邮件客户端、手机通讯录和其他应用程序中，以便于导入和导出联系人数据。大部分手机和邮箱的通讯录都支持导入和导出 .vcf 文件。

一个简单的 .vcf 文件大致是这样的：

```vcard :no-line-numbers :no-collapsed-lines
BEGIN:VCARD
VERSION:2.1
N:;example;;;
FN:example
TEL;CELL:123456789
EMAIL;WORK:example@example.com
END:VCARD

BEGIN:VCARD
VERSION:2.1
N:;test;;;
FN:test
TEL;CELL:123456789
EMAIL;WORK:test@test.com
END:VCARD
```

可以看出，.vcf 文件是由多个`BEGIN:VCARD`及`END:VCARD`块组成的，每个块表示一个联系人。中间的每一行都是`key:value`的形式。我们对几个特殊的`key`简单介绍一下：
- `VERSION`：表示 VCard 的版本号。
- `N`：表示联系人的名字，格式为一个长度为5的字符串数组（中间用逗号分隔），依次是 Last Name（姓）、First Name（名）、Additional Name（附加名）、Prefix（前缀）、Suffix（后缀）。
- `FN`：表示联系人的全名（Full Name）。
- `TEL`：表示联系人的电话号码，可以有多个，后面可以跟上`;CELL`（手机）、`;WORK`（工作电话）、`;HOME`（家庭电话）等。
- `EMAIL`：表示联系人的电子邮件地址，和`TEL`类似，可以有多个。

很多编程语言都有支持读写 .vcf 文件的库，比如 Python 的`vobject`库。下面是一个简单的 Python 代码示例，展示如何使用`vobject`库来读取和写入 .vcf 文件。

首先安装依赖：

```bash
npm install vobject
```

以下是一段生成 .vcf 文件的示例代码：

```python :no-collapsed-lines
import vobject
from types import SimpleNamespace

all_vcards = []

vcard = vobject.vCard()
n = vcard.add('N')
n.value = SimpleNamespace(family='', given='example', additional='', prefix='', suffix='')
fn = vcard.add('FN')
fn.value = 'example'
tel = vcard.add('TEL')
tel.value = '123456789'
tel.type_param = 'CELL'
email = vcard.add('EMAIL')
email.value = 'example@example.com'
email.type_param = 'WORK'
all_vcards.append(vcard.serialize())

vcard = vobject.vCard()
n = vcard.add('N')
n.value = SimpleNamespace(family='', given='test', additional='', prefix='', suffix='')
fn = vcard.add('FN')
fn.value = 'test'
tel = vcard.add('TEL')
tel.value = '123456789'
tel.type_param = 'CELL'
email = vcard.add('EMAIL')
email.value = 'test@test.com'
email.type_param = 'WORK'
all_vcards.append(vcard.serialize())

# 将所有vCard数据写入一个单一的.vcf文件
with open('contract.vcf', 'w', encoding='utf-8') as f:
    f.writelines(all_vcards)
```

运行这段 Python 代码后，会生成一个名为`contract.vcf`的文件，内容与本文开头的示例相同。

之后，就可以在手机或邮箱的通讯录中按照说明进行操作，将生成的 .vcf 文件导入。