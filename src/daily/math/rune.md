---
title: 游戏中的洗符石问题
icon: gem
order: 3
date: 2026-08-24
category: 数学
tags:
  - Go
toc:
  levels: 2
---

## 问题描述

《幻唐志》中的宠物符石系统是一个数学逻辑很复杂的概率系统。

宠物符石共三组，每组两个，共六个符石。每次洗练可以重置其中一组，并从本次洗出的候选符石中**自选 2 个**替换原来的两个符石。

符石的属性由“颜色”和“字”组成：

- 颜色：五种五行，共 5 种；
- 字：八卦字 8 种，外加 3 种不同的“无字”，共 11 种。

<!-- more -->

因此候选石的总组合数为：

$$
5\times 11=55
$$

本文要求最终三组符石都成为“同色同字”，且**不允许无字**。也就是说，有效目标组合只有：

$$
5\times 8=40
$$

种。

每次洗练时，出现的候选石数量的原始概率为：40%几率出现2个候选石，30%几率出现3个候选石，20%几率出现4个候选石，10%几率出现5个候选石。

但存在保底机制：

- 若连续 9 次没有出至少 4 个候选石，则第 10 次必出至少 4 个；
- 若连续 19 次没有出 5 个候选石，则第 20 次必出 5 个。

我们的目标是计算完成三组同色同字所需洗练次数的数学期望。

## 出石数量 $N$ 的稳态分布

### 状态定义

定义状态：

$$
(a,b)
$$

其中：

- $a$：连续未出至少 4 个候选石的次数；
- $b$：连续未出 5 个候选石的次数。

显然：

$$
0\le a\le 9,\qquad 0\le b\le 19
$$

状态总数为：

$$
10\times 20=200
$$

每洗一次，状态发生转移。转移规则为：

若本次洗出 $n$ 个候选石：

- 若 $n\ge 4$，则 $a$ 重置为 0；否则 $a$ 加 1；
- 若 $n=5$，则 $b$ 重置为 0；否则 $b$ 加 1。

同时，当 $a=9$ 且 $b<19$ 时，本次出石数量强制为：

$$
P(N=4)=\frac23,\qquad P(N=5)=\frac13
$$

当 $b=19$ 时，本次强制为：

$$
P(N=5)=1
$$

否则按原始概率分布。

### 平稳分布求解

由于状态空间有限且不可约，该马尔可夫链存在唯一平稳分布 $\pi(a,b)$，满足：

$$
\pi = \pi \mathbf P
$$

其中 $\mathbf P$ 是 $200\times 200$ 的状态转移矩阵。

该方程可以通过数值方法精确求解。解出平稳分布后，可得到出石数量 $N$ 的边际分布：

$$
q_n=P(N=n)=\sum_{\substack{a,b\\ \text{状态}(a,b)\text{下本次出}n}}\pi(a,b)
$$

数值结果如下：

| $n$ |  $q_n$ |
|---:|-------:|
| 2 | 0.3902 |
| 3 | 0.2925 |
| 4 | 0.2020 |
| 5 | 0.1153 |

可见，保底机制使 5 石概率从原始 10% 提升到约 11.5%，2 石概率从 40% 下降到约 39.0%。

::: note 注意

值得一提的是，由于三组石头是共用保底的，因此这种把保底机制近似成一个独立的数学期望的方式并不完全准确，但用于估算是足够的。

:::

## 单次洗练成功概率

### 固定目标组合的成功概率

当第一组已经锁定某个目标组合 $c$ 后，后续两组都必须洗出至少两个 $c$。

单个候选石恰好是 $c$ 的概率为：

$$
\frac{1}{55}
$$

若某次洗出 $n$ 个候选石，令 $X$ 表示其中组合 $c$ 的个数，则：

$$
X\sim \mathrm{Binomial}\left(n,\frac{1}{55}\right)
$$

成功条件为：

$$
X\ge 2
$$

因此：

$$
P_2^{(n)}=P(X\ge 2)
$$

$$
P_2^{(n)}
=
1-\left(\frac{54}{55}\right)^n
-
n\cdot\frac{1}{55}\left(\frac{54}{55}\right)^{n-1}
$$

利用出石数量的稳态分布 $q_n$，得到锁定目标后单次洗练成功概率：

$$
p_2=\sum_{n=2}^{5}q_n P_2^{(n)}
$$

代入数值：

$$
p_2\approx 1.13\times 10^{-3}
$$

即约 **0.113%**。

### 第一组任意有效组合的成功概率

第一组尚未锁定具体组合，只要本次洗出的候选石中存在某一种**非无字**组合出现至少两次，即可成功锁定目标。

有效组合共有 40 种，无字组合有 15 种。

设某次洗出 $n$ 个候选石，令 $Y$ 表示其中属于有效组合的个数。

由于每个候选石属于有效组合的概率为：

$$
\frac{40}{55}=\frac{8}{11}
$$

所以：

$$
Y\sim \mathrm{Binomial}\left(n,\frac{8}{11}\right)
$$

给定 $Y=k$ 时，这 $k$ 个有效组合均匀分布在 40 种具体组合上。

若这 $k$ 个有效组合全部互不相同，则没有任意一个有效组合出现至少两次，洗练失败。

因此，给定 $k\ge 2$ 时，成功的条件概率为：

$$
P(\text{成功}\mid n,k)
=
1-\frac{(40)_k}{40^k}
$$

其中：

$$
(40)_k=40\cdot 39\cdot 38\cdots(40-k+1)
$$

是降阶乘。

对于 $k=0$ 或 $k=1$，显然成功概率为 0。

所以：

$$
P_1^{(n)}
=
\sum_{k=2}^{n}
\binom{n}{k}
\left(\frac89\right)^k
\left(\frac19\right)^{n-k}
\left[
1-\frac{(40)_k}{40^k}
\right]
$$

则第一组单次洗练成功概率为：

$$
p_1=\sum_{n=2}^{5}q_n P_1^{(n)}
$$

代入数值：

$$
p_1\approx 5.57\times 10^{-2}
$$

即约 **5.57%**。

## 总期望次数

完成三组需要：

1. 第一组洗出任意同色同字非无字组合，锁定目标；
2. 第二组洗出与第一组相同的组合；
3. 第三组洗出与第一组相同的组合。

每次洗练相互独立，且每次只影响当前组。

因此第一组所需次数服从几何分布，期望为：

$$
\frac{1}{p_1}
$$

锁定目标后，第二组和第三组每次成功概率均为 $p_2$，期望分别为：

$$
\frac{1}{p_2}
$$

所以总期望次数为：

$$
\mathbb E[T]
=
\frac{1}{p_1}
+
2\cdot\frac{1}{p_2}
$$

代入数值：

$$
p_1\approx 5.57\times 10^{-2}
$$

$$
p_2\approx 1.13\times 10^{-3}
$$

得到：

$$
\mathbb E[T]
\approx
\frac{1}{0.0557}
+
2\cdot\frac{1}{0.00113}
$$

$$
\mathbb E[T]
\approx
18
+
1770
\approx
1788
$$

因此期望值约为：$1700\sim 1800$

这与模拟程序运行结果 **1700～1800 次** 基本一致。

这里给出一下模拟程序的示例代码：

```go
package main

import (
	"fmt"
	"math/rand/v2"
	"time"
)

func main() {
	r := rand.New(rand.NewPCG(uint64(time.Now().UnixMilli()), 1))
	var lessThen4, lessThen5 int
	randOne := func() int {
		var count int
		switch {
		case lessThen5 == 19:
			count = 5
		case lessThen4 == 9:
			count = 4
			if r.IntN(3) == 0 {
				count++
			}
		default:
			n := r.IntN(10)
			switch {
			case n < 4:
				count = 2
			case n < 7:
				count = 3
			case n < 9:
				count = 4
			default:
				count = 5
			}
		}
		switch count {
		case 5:
			lessThen5 = 0
			lessThen4 = 0
		case 4:
			lessThen5++
			lessThen4 = 0
		default:
			lessThen5++
			lessThen4++
		}
		result := make([]int, count)
		for i := range count {
			v := r.IntN(55)
			if v < 15 {
				continue
			}
			for j := range i {
				if result[j] == v {
					return v
				}
			}
			result[i] = v
		}
		return -1
	}
	result := 0
	for range 100000 {
		var cur int
		for range 3 {
			for {
				result++
				v := randOne()
				if cur == 0 {
					if v > 0 {
						cur = v
						break
					}
				} else if v == cur {
					break
				}
			}
		}
	}
	fmt.Println(float64(result) / 100000)
}
```

## 结论

在考虑保底机制后，完成三组同色同字非无字宠物符石所需的洗练次数期望约为：

$$
\mathbb E[T]\approx 1.74\times 10^3
$$

即大约 **1740 次**。

实际游戏中考虑到波动，体感通常会在 **1700～1800 次** 之间。

## 更优方案

实际上还有一个更优方案，就是第一组洗出任意同色同字组合后，第二组同色同字并不要求和第一组相同，如果不同，可以做为一个备选方案。第三组同色同字先匹配上哪个就用哪个。

我们稍微改一下代码即可检验一下：

```go {63-96}
package main

import (
	"fmt"
	"math/rand/v2"
	"time"
)

func main() {
	r := rand.New(rand.NewPCG(uint64(time.Now().UnixMilli()), 1))
	var lessThen4, lessThen5 int
	randOne := func() int {
		var count int
		switch {
		case lessThen5 == 19:
			count = 5
		case lessThen4 == 9:
			count = 4
			if r.IntN(3) == 0 {
				count++
			}
		default:
			n := r.IntN(10)
			switch {
			case n < 4:
				count = 2
			case n < 7:
				count = 3
			case n < 9:
				count = 4
			default:
				count = 5
			}
		}
		switch count {
		case 5:
			lessThen5 = 0
			lessThen4 = 0
		case 4:
			lessThen5++
			lessThen4 = 0
		default:
			lessThen5++
			lessThen4++
		}
		result := make([]int, count)
		for i := range count {
			v := r.IntN(55)
			if v < 15 {
				continue
			}
			for j := range i {
				if result[j] == v {
					return v
				}
			}
			result[i] = v
		}
		return -1
	}
	result := 0
	for range 100000 {
		var cur [3]int
		for {
			result++
			v := randOne()
			if v > 0 {
				cur[0] = v
				break
			}
		}
		for {
			result++
			v := randOne()
			if v > 0 {
				cur[1] = v
				break
			}
		}
		for {
			result++
			v := randOne()
			if v == cur[0] || v == cur[1] {
				cur[2] = v
				break
			}
		}
		if cur[0] != cur[1] {
			for {
				result++
				v := randOne()
				if v == cur[2] {
					break
				}
			}
		}
	}
	fmt.Println(float64(result) / 100000)
}
```

最后得到的数学期望大约在 **1300～1400 次** ，大大减少了洗练次数。