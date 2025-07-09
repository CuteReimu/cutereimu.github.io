---
title: awk命令的使用
order: 2
category: 编程日记
icon: font
tags:
  - Linux
date: 2025-06-29
---

`awk`是Linux中处理文本文件的语言，功能非常强大。

## 基本语法

```bash
awk options 'pattern { action }' file
```

其中，`options`是一系列可选参数，我们最常用的是`-F`参数，用于指定分隔符，例如`-F ','`表示以`,`为分隔符，如果不指定则默认是空格。`'pattern { action }'`是脚本的内容，其中`pattern`是个布尔表达式，满足这个表达式的行才会被输出，默认是遍历所有行。`file`是要处理的文件。

<!-- more -->

也有一些这样的用法：

```bash :no-line-numbers
# 脚本太长了，可以将脚本写在一个文件中，然后使用`-f`选项来指定脚本文件
awk -f script.awk file

# 可以用通道的形式使用
cat file | awk options 'pattern { action }'
```

### awk脚本的基本格式

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

#每一行都执行
{
    math+=$3
    english+=$4
    computer+=$5
    printf "%-6s %-6s %4d %8d %8d %8d\n", $1, $2, $3,$4,$5, $3+$4+$5
}

#偶数行才执行
NR%2==0 {
    printf "第%d行处理完毕\n", NR
}

#运行后
END {
    printf "---------------------------------------------\n"
    printf "  TOTAL:%10d %8d %8d \n", math, english, computer
    printf "AVERAGE:%10.2f %8.2f %8.2f\n", math/NR, english/NR, computer/NR
}
```

其包含四段大括号的内容，大括号前如果没有条件，则会在每行被处理时执行一次。如果有条件，则会在满足条件时才会执行，其中`BEGIN`和`END`分别表示只会在处理开始和结束时执行一次。

### 常用内建变量

| 变量名             | 说明                    |
|-----------------|-----------------------|
| `$0`            | 整行文本                  |
| `$1`, `$2`, ... | 分隔后的各个字段（列）           |
| `NR`            | 当前行号（从1开始）            |
| `FNR`           | 当前文件的行号（从1开始）         |
| `NF`            | 当前行的字段数               |
| `FS`            | 字段分隔符（默认是空格）          |
| `OFS`           | 输出字段分隔符，默认值与输入字段分隔符一致 |
| `RS`            | 行分隔符（默认是换行符）          |
| `ORS`           | 输出行分隔符，默认是换行符         |
| `FILENAME`      | 当前处理的文件名              |
| `OFMT`          | 数字的输出格式(默认值是`%.6g`)   |

## 一些例子

### 过滤逻辑

```bash :no-line-numbers :no-collapsed-lines
# 过滤第一列等于2的行
awk '$1==2 {print $1,$2,$3}' log.txt

# 输出包含 "re" 的行
awk '/re/ ' log.txt

# 输出第二列包含"th"的行，~表示正则匹配，!~表示正则不匹配
awk '$2 ~ /th/' log.txt

# 忽略大小写匹配
awk 'BEGIN{IGNORECASE=1} /this/' log.txt

# 从文件中找出长度大于80的行
awk 'length>80' log.txt
```

### 字段处理

```bash :no-line-numbers :no-collapsed-lines
# 将只有一列的文本转化为一行
awk 'BEGIN{ORS=" "} 1' file.txt

# 将只有一列的两个文本文件合成一个文件，新文件有两列
awk '{getline b < "file2.txt"; print $0, b}' file1.txt

# 对第二列求和
awk '{sum+=$2} END {print sum}' file.txt

# 求第二列的最大值
awk 'NR==1 || $2>max {max=$2} END {print max}' file.txt

# 求和所有文件大小
ls -l *.txt | awk '{sum+=$5} END {print sum}'
```

::: caution 注意
在不同版本的`awk`中，进行`<`和`>`比较时，可能会有不同的行为。在不确定版本的情况下，强烈建议坚持这个原则：**字符串只和字符串比较（按字母表顺序），数字只和数字比较。不要进行混合比较**。

如果担心出问题，可以进行强制类型转换：
- 使用`str + 0`将字符串转换为数字
- 使用`num ""`或`"" num`将数字转换为字符串
:::

### 打印乘法表

```console
$ seq 9 | sed 'H;g' | awk -v RS='' '{for(i=1;i<=NF;i++)printf("%dx%d=%d%s", i, NR, i*NR, i==NR?"\n":"\t")}'
```

输出：

```text :no-line-numbers
1x1=1
1x2=2   2x2=4
1x3=3   2x3=6   3x3=9
1x4=4   2x4=8   3x4=12  4x4=16
1x5=5   2x5=10  3x5=15  4x5=20  5x5=25
1x6=6   2x6=12  3x6=18  4x6=24  5x6=30  6x6=36
1x7=7   2x7=14  3x7=21  4x7=28  5x7=35  6x7=42  7x7=49
1x8=8   2x8=16  3x8=24  4x8=32  5x8=40  6x8=48  7x8=56  8x8=64
1x9=9   2x9=18  3x9=27  4x9=36  5x9=45  6x9=54  7x9=63  8x9=72  9x9=81
```

### 一个复杂点的例子

以下awk脚本可以将文本文件的每两行合并成一行（中间用逗号隔开）：

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
# [!code word:NR%2]
# [!code word:, ]
awk 'NR%2 {printf "%s, ",$0; next} 1' file.txt
```

每三行合并成一行的话，将`NR%2`改为`NR%3`即可。

分隔符如果想用其他符号的话，将`%s`后的逗号空格改为其它符号即可。
