---
title: 游戏中的洗符石问题
icon: gem
order: 3
date: 2026-08-24
category: 数学
tags:
  - TypeScript
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

实际游戏中考虑到波动，体感通常会在 **1700～1800 次** 之间。

## 更优方案

实际上还有一个更优方案，就是第一组洗出任意同色同字组合后，第二组同色同字并不要求和第一组相同，如果不同，可以做为一个备选方案。第三组同色同字先匹配上哪个就用哪个。

有了这个更优方案后，所需次数大约在 **1300～1400 次** 左右。计算方式在这里就不举例出来了，留给大家思考。

## 代码检验

我们可以用代码进行模拟并统计：

```typescript
let lessThen4 = 0, lessThen5 = 0, result = 0;
const results: number[] = [];

const getColor = (v: number) => v % 5;
const getCharacter = (v: number) => v % 8;

// 随机符石的个数
const randLine = (): number[] => {
    result++;
    let count: number;
    if (lessThen5 >= 19) {
        count = 5;
    } else if (lessThen4 >= 9) {
        count = 4;
    } else {
        const n = Math.random();
        if (n < 0.4) count = 2;
        else if (n < 0.7) count = 3;
        else if (n < 0.9) count = 4;
        else count = 5;
    }
    switch (count) {
        case 5:
            lessThen5 = 0;
            lessThen4 = 0;
            break;
        case 4:
            lessThen5++;
            lessThen4 = 0;
            break;
        default:
            lessThen5++;
            lessThen4++;
    }
    return Array.from({length: count}, () => Math.floor(Math.random() * 55));
};

interface TestConfig {
    name: string;
    find: (result: number[], cur: [number, number][]) => [number, number] | boolean | undefined;
    after?: (cur: [number, number][]) => void;
}

const newTest = (d: TestConfig): void => {
    console.log(d.name);
    lessThen4 = 0;
    lessThen5 = 0;
    results.length = 0;
    for (let i = 0; i < 10000; i++) {
        result = 0;
        const cur: [number, number][] = [];
        for (let j = 0; j < 3; j++) {
            while (true) {
                const v = d.find(randLine(), cur);
                if (!v) continue;
                if (typeof v === "boolean") cur.push([0, 0]);
                else cur.push(v);
                break;
            }
        }
        d.after?.(cur);
        results.push(result);
    }
    results.sort((a, b) => a - b);
    console.log("平均值：", results.reduce((a, b) => a + b, 0) / 10000);
    console.log("95%置信区间：", results.at(250), "~", results.at(-250));
};

const filterSame = (arr: number[]): number[] => {
    return arr.filter((v, i, arr) => {
        if (v >= 15) {
            for (let j = i + 1; j < arr.length; j++) {
                if (v === arr[j]) return true;
            }
        }
        return false;
    });
};

newTest({
    name: "===========六个完全相同的符石===========",
    find: (result, cur) => {
        const same = filterSame(result);
        if (same.length === 0) return undefined;
        const v = same.find(v => cur.some(arr => arr[0] === v));
        if (v) return [v, v];
        return cur.length < 2 ? [same[0], same[0]] : undefined;
    },
    after: (cur) => {
        if (cur[0][0] !== cur[1][0]) {
            while (true) {
                const same = filterSame(randLine());
                if (same.some(v => v === cur[2][0])) break;
            }
        }
    }
});

newTest({
    name: "===========六金===========",
    find: result => result.filter(v => v >= 15 && getColor(v) === 0).length >= 2
});

newTest({
    name: "===========六乾===========",
    find: result => result.filter(v => v >= 15 && getCharacter(v) === 0).length >= 2
});

newTest({
    name: "===========六金乾===========",
    find: result => result.filter(v => v === 15).length >= 2
});

newTest({
    name: "===========六金同字===========",
    find: (result, cur) => {
        const same = filterSame(result).filter(v => getColor(v) === 0);
        if (same.length === 0) return undefined;
        const v = same.find(v => cur.some(arr => arr[0] === v));
        if (v) return [v, v];
        return cur.length < 2 ? [same[0], same[0]] : undefined;
    },
    after: (cur) => {
        if (cur[0][0] !== cur[1][0]) {
            while (true) {
                const same = filterSame(randLine());
                if (same.some(v => v === cur[2][0])) break;
            }
        }
    }
});

newTest({
    name: "===========六中庸===========",
    find: result => result.filter(v => v < 15).length >= 2
});
```

运行结果如下：

```text
===========六个完全相同的符石===========
平均值： 1304.2537
95%置信区间： 174 ~ 3713
===========六金===========
平均值： 46.4213
95%置信区间： 11 ~ 110
===========六乾===========
平均值： 111.865
95%置信区间： 24 ~ 270
===========六金乾===========
平均值： 2559.5173
95%置信区间： 523 ~ 6151
===========六金同字===========
平均值： 1443.2518
95%置信区间： 262 ~ 3903
===========六中庸===========
平均值： 15.8468
95%置信区间： 5 ~ 36
```
