---
title: awk命令的使用
order: 2
category: 编程日记
icon: font
tags:
  - Linux
date: 2025-06-29
---

`awk`是Linux中处理文本文件的语言，功能非常强大。基本语法如下：

```bash
awk options 'pattern { action }' file
```

<!-- more -->

其中，`options`是一系列可选参数，我们最常用的是`-F`参数，用于指定分隔符，例如`-F ','`表示以`,`为分隔符，如果不指定则默认是空格。`'pattern { action }'`是脚本的内容，其中`pattern`是个布尔表达式，满足这个表达式的行才会被输出，默认是遍历所有行。`file`是要处理的文件。

也有一些这样的用法：

```bash :no-line-numbers
# 脚本太长了，可以将脚本写在一个文件中，然后使用`-f`选项来指定脚本文件
awk -f script.awk file

# 可以用通道的形式使用
cat file | awk options 'pattern { action }'
```

awk脚本的基本格式如下：

```awk :no-line-numbers :no-collapsed-lines
#!/bin/awk -f
#运行前
BEGIN {
    math = 0
    english = 0
    computer = 0
 
    printf "NAME    NO.   MATH  ENGLISH  COMPUTER   TOTAL\n"
    printf "---------------------------------------------\n"
}
#运行中
{
    math+=$3
    english+=$4
    computer+=$5
    printf "%-6s %-6s %4d %8d %8d %8d\n", $1, $2, $3,$4,$5, $3+$4+$5
}
#运行后
END {
    printf "---------------------------------------------\n"
    printf "  TOTAL:%10d %8d %8d \n", math, english, computer
    printf "AVERAGE:%10.2f %8.2f %8.2f\n", math/NR, english/NR, computer/NR
}
```

其包含三段大括号的内容，中间的一段大括号中的内容，在每行被处理时都会执行一次，而前后两段大括号（含`BEGIN`和`END`前缀）中的内容只会在处理开始和结束时执行一次。

一些例子：

```bash :no-line-numbers :no-collapsed-lines
# 过滤第一列等于2的行
awk '$1==2 {print $1,$2,$3}' log.txt

# 输出包含 "re" 的行
awk '/re/ ' log.txt

# 输出第二列包含"th"的行，~表示正则匹配，!~表示正则不匹配
awk '$2 ~ /th/' log.txt

# 忽略大小写匹配
awk 'BEGIN{IGNORECASE=1} /this/' log.txt

# 求和所有文件大小
ls -l *.txt | awk '{sum+=$5} END {print sum}'

# 从文件中找出长度大于80的行
awk 'length>80' log.txt

# 打印乘法表
seq 9 | sed 'H;g' | awk -v RS='' '{for(i=1;i<=NF;i++)printf("%dx%d=%d%s", i, NR, i*NR, i==NR?"\n":"\t")}'
```

常用内建变量：

| 变量名             | 说明                    |
|-----------------|-----------------------|
| `$0`            | 整行文本                  |
| `$1`, `$2`, ... | 分隔后的各个字段（列）           |
| `NR`            | 当前行号（从1开始）            |
| `FNR`           | 当前文件的行号（从1开始）         |
| `NF`            | 当前行的字段数               |
| `FS`            | 字段分隔符（默认是空格）          |
| `OFS`           | 输出字段分隔符，默认值与输入字段分隔符一致 |
| `FILENAME`      | 当前处理的文件名              |
| `OFMT`          | 数字的输出格式(默认值是`%.6g`)   |

一个复杂点的例子：

```awk :no-line-numbers
#!/bin/awk -f
NR%2 {
  printf "%s, ", $0
  next
}
1
```

解释：
- `NR%2`表示计算当前行号对2求余，如果余数不为0，即奇数行，则会执行大括号后面的内容。
- `next`表示跳过对当前行文本的处理，直接开始处理下一行文本。
- 如果是偶数行，则不会进入`NR%2`后的大括号，直接执行`1`。`1`即为真，永远会执行。但`1`后面没有大括号，表示执行默认动作，即打印当前行文本。

在命令行中使用时，将以上内容写在同一行，可以写成：

```bash
awk 'NR%2 {printf "%s, ", $0; next} 1' file.txt
```
