---
title: 名侦探甘迪问题
icon: question
order: 2
category: 数学
tags:
  - 策略问题
  - 信息论
  - TypeScript
  - Go
---

一切的一切，要源于《冒险岛Online》在2018年推出的一个小游戏——名侦探甘迪：

> 游戏开始时，一群玩家会被传送进一个房间。此时，系统会在1-9九个数字中随机选择三个数字按某个顺序排列，作为答案。
>
> 每一轮，玩家需要按顺序猜测3个数字，系统会给出反馈，告知玩家有几个数字猜对了并且位置正确（用○表示），有几个数字猜对了但位置不正确（用△表示）。
>
> 举个例子：玩家猜测1-2-3三个数字，系统给出反馈1○1△，表示有一个数字猜对了并且位置正确，有一个数字猜对了但位置不正确。可能是1猜对了且位置正确，2猜对了但位置不正确，答案中没有3，当然也有别的可能。
> 
> 玩家可以根据反馈来继续推测答案。所有玩家独立完成游戏，不能看到其它玩家的选择及反馈。玩家之间互为竞争对手，目标就是用最少的次数猜出答案。

问题就来了，如何设计策略，让我们在尽可能少的次数内猜出答案呢？

这是一个十分经典的策略问题。

<!-- more -->

## 信息熵

信息熵是信息论中的一个核心概念，由克劳德·香农（Claude Shannon）于1948年提出，用于**量化信息的不确定性**或**随机性**。它衡量的是一个系统或随机事件中“不可预测性”的程度。

我们用一个简单的例子做比方：假设我们投掷一枚硬币，有50%的几率正面朝上，50%的几率反面朝上。我们事先不知道结果是什么，这就是一个不确定的事件。当我们投掷硬币之后，得到的结果就是一个确定的事件，此时只有正面或反面两种可能性，我们用0和1表示。0和1就是二进制中的1位，用信息学术语就是1比特（bit）。

那么我们换成一个八面骰子，我们投掷它，得到的结果是1-8中的一个数字，用二进制表示就是3位（000~111），也就是3比特（bit），用数学式子表示就是 $log_2 8 = 3 \text{ bits}$。

以上是我们在所有情况发生的概率相同时的结果。接下来考虑概率不同的情况：

如果我们投掷一枚硬币，现在来猜硬币到底是立起来还是倒下去的，假设立起来的概率是0.1%，倒下去的概率是99.9%。如果我投掷了一次硬币，发现硬币倒下去了，我并不会感到意外，因为我没有得到什么信息。如果我投掷了一次硬币，发现硬币立起来了，我会非常惊讶，因为我得到了大量信息。怎么用数学来量化这种信息呢？

既然立起来的概率是0.1%，换句话说，我们投掷1000次硬币，才有可能得到一次立起来的结果。我这一次投掷，硬币立起来了，让我需要进行1000次尝试的结果在这一次实现了，我获得了 $log_2 1000 \approx 9.97 \text{ bits}$ 的信息，其实就是概率的倒数的对数。我们用 $P(x_i)$ 表示得到 $x_i$ 结果的概率，那么信息量就是 $\log_2 \dfrac{1}{P(x_i)} = -\log_2{P(x_i)}$。

用同样的方式，我们可以得出，如果硬币倒下了，我们获得的信息量就是：$-\log_2 0.999 \approx 0.0014 \text{ bits}$，确实获得的信息量很少。

考虑到这两者发生的概率是不同的，我们在投掷硬币之前，可以计算一个数学期望，也就是它们的**加权平均值**：$9.97 \times 0.1\% + 0.0014 \times 99.9\% \approx 0.0114 \text{ bits}$，这就是我们这次投掷硬币所获得的信息量的数学期望。

我们管一个概率事件获得信息量的数学期望就叫做**信息熵**，**信息熵**越大则结果越不确定。通过上面的例子我们发现，想要求**信息熵**，直接求 $-\log_2{P(x_i)}$ 的加权平均值即可，因此可以得到**信息熵**的公式为：

$$
H(X) = -\sum_{i=1}^{n} P(x_i) \log_2 P(x_i)
$$

**符号解释**：
- $X$：一个随机变量（例如天气、抛硬币的结果）。
- $P(x_i)$：事件$x_i$发生的概率（例如“晴天”的概率是0.3）。
- $\log_2$：以2为底的对数，单位是**比特（bit）**（也可用自然对数，单位是纳特）。

我们来代入之前的硬币正反面的例子：$H(X) = -\left(0.5 \log_2 0.5 + 0.5 \log_2 0.5\right) = 1 \text{ bit}$，和我们之前的定义吻合，这个定义是没有问题的。

**信息熵**有这样一些性质：
- 当所有可能事件的概率相等时，熵最大。*（例如：猜硬币正反面，信息熵大）*
- 当某个事件概率趋近于1时，熵趋近于0。*（例如：猜硬币是立着还是倒着，几乎不可能是立着，信息熵趋近于0）*

## 最大化信息熵策略

让我们回到名侦探甘迪问题。在这个游戏中，我们想要用尽可能少的次数猜出答案，就要让每次猜测都能获得尽可能多的信息，换句话说就是每次猜测选择信息熵最大的策略，即**最大化信息熵**策略。

举个例子，首轮我们猜测1-2-3，得到1○1△的反馈。我们可以排除大部分可能性，还剩下36种可能（1-3-4、1-3-5、1-3-6、……、9-2-1）。接下来，我们依次计算每种猜测的信息熵。举两个例子：

- 猜测1-4-5，可能的反馈有：
  - 0○0△：有8种可能，概率为8/36
  - 0○1△：有10种可能，概率为10/36
  - 0○2△：有4种可能，概率为4/36
  - 1○0△：有10种可能，概率为10/36
  - 1○1△：有2种可能，概率为2/36
  - 2○0△：有2种可能，概率为2/36
  
  因此信息熵为：
  $$
  H = -\left(\dfrac{8}{36} \log_2 \dfrac{8}{36} + \dfrac{10}{36} \log_2 \dfrac{10}{36} + \dfrac{4}{36} \log_2 \dfrac{4}{36} + \dfrac{10}{36} \log_2 \dfrac{10}{36} + \dfrac{2}{36} \log_2 \dfrac{2}{36} + \dfrac{2}{36} \log_2 \dfrac{2}{36}\right) \approx 2.32 \text{ bits}
  $$
- 猜测4-5-6，可能的反馈有：
  - 0○0△：有18种可能，概率为18/36
  - 0○1△：有12种可能，概率为12/36
  - 1○0△：有6种可能，概率为6/36

  因此信息熵为：
  $$
  H = -\left(\dfrac{18}{36} \log_2 \dfrac{18}{36} + \dfrac{12}{36} \log_2 \dfrac{12}{36} + \dfrac{6}{36} \log_2 \dfrac{6}{36}\right) \approx 1.46 \text{ bits}
  $$

前者比后者的信息熵更大，因此我们选择前者进行猜测更优。

以上只列举了两种猜测的例子，我们只需要遍历所有的猜测（一共$A_9^3=504$种），计算每种猜测的信息熵，选择信息熵最大的进行猜测即可。

### 代码实现

::: code-tabs

@tab TypeScript

```ts :no-collapsed-lines
// compare 函数用于比较两个结果的差异，返回○和△值
const compare = (result1: number[], result2: number[]): [number, number] => {
    let count1 = 0;
    let count2 = 0;
    for (let i = 0; i < result1.length; i++) {
        for (let j = 0; j < result2.length; j++) {
            if (result1[i] === result2[j]) {
                if (i === j) count1++;
                else count2++;
            }
        }
    }
    return [count1, count2];
};

// 首轮猜测1-2-3，反馈1○1△
const maybeResult: [number, number, number][] = [];
for (let a = 1; a <= 9; a++) {
    for (let b = 1; b <= 9; b++) {
        for (let c = 1; c <= 9; c++) {
            if (a === b || a === c || b === c) continue;
            const [count1, count2] = compare([1, 2, 3], [a, b, c]);
            if (count1 === 1 && count2 === 1) maybeResult.push([a, b, c]);
        }
    }
} // 这时 maybeResult 应该只有36种可能

let maxH = 0.0; // 最大信息熵
let maxHResults: [number, number, number][] = []; // 最大信息熵对应的选项
// 计算每种猜测的信息熵
for (let a = 1; a <= 9; a++) {
    for (let b = 1; b <= 9; b++) {
        for (let c = 1; c <= 9; c++) {
            if (a === b || a === c || b === c) continue;
            const counts = {}; // 统计每种反馈的出现次数
            for (const i in maybeResult) {
                const [count1, count2] = compare([a, b, c], maybeResult[i]);
                counts[`${count1},${count2}`] = (counts[`${count1},${count2}`] || 0) + 1;
            }
            let H = 0; // 信息熵
            for (const i in counts) {
                const p = counts[i] / maybeResult.length;
                H -= p * Math.log2(p);
            }
            if (Math.abs(H - maxH) < 0.0001) { // 浮点数精度
                maxHResults.push([a, b, c]);
            } else if (H > maxH) {
                maxH = H;
                maxHResults = [[a, b, c]];
            }
        }
    }
}

console.log(maxH);
console.log(maxHResults);
```

@tab Go

```go :no-collapsed-lines
// compare 函数用于比较两个结果的差异，返回○和△值
func compare(result1, result2 [3]int) (int, int) {
    var count1, count2 int
    for i := range 3 {
        for j := range 3 {
            if result1[i] == result2[j] {
                if i == j {
                    count1++
                } else {
                    count2++
                }
            }
        }
    }
    return count1, count2
}

func main() {
    // 首轮猜测1-2-3，反馈1○1△
    var maybeResult [][3]int
    for a := 1; a <= 9; a++ {
        for b := 1; b <= 9; b++ {
            for c := 1; c <= 9; c++ {
                if a == b || a == c || b == c {
                    continue
                }
                count1, count2 := compare([3]int{1, 2, 3}, [3]int{a, b, c})
                if count1 == 1 && count2 == 1 {
                    maybeResult = append(maybeResult, [3]int{a, b, c})
                }
            }
        }
    } // 这时 maybeResult 应该只有36种可能

    var maxH float64         // 最大信息熵
    var maxHResults [][3]int // 最大信息熵对应的选项
    // 计算每种猜测的信息熵
    for a := 1; a <= 9; a++ {
        for b := 1; b <= 9; b++ {
            for c := 1; c <= 9; c++ {
                if a == b || a == c || b == c {
                    continue
                }
                counts := make(map[[2]int]int) // 统计每种反馈的出现次数
                for i := range maybeResult {
                    count1, count2 := compare([3]int{a, b, c}, maybeResult[i])
                    counts[[2]int{count1, count2}]++
                }
                var H float64 // 信息熵
                for i := range counts {
                    var p = float64(counts[i]) / float64(len(maybeResult))
                    H -= p * math.Log2(p)
                }
                if math.Abs(H-maxH) < 0.0001 { // 浮点数精度
                    maxHResults = append(maxHResults, [3]int{a, b, c})
                } else if H > maxH {
                    maxH = H
                    maxHResults = [][3]int{{a, b, c}}
                }
            }
        }
    }

    fmt.Println(maxH)
    fmt.Println(maxHResults)
}
```

:::

上面的代码可以得到这样的结果：在第一轮得到1○1△的反馈后，只需要固定一个数字作为1○，并从4~9中选择另外两个数字进行猜测，就可以获得最大信息熵，约为2.32。上文列举的1-4-5即为其中之一猜测方案。

接下来，我们每一轮只需要根据反馈缩小可能的范围，再遍历一次找到最大信息熵，这就是**最大化信息熵**的策略。

这种策略的预期猜测次数如下图所示：

```xy
x-axis "猜测次数" [1, 2, 3, 4, 5, 6]
y-axis "概率（%）" 0 --> 65
bar [0.29, 1.19, 6.15, 24.01, 58.73, 9.72]
```