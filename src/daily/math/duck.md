---
title: 池塘问题
icon: fish
order: -2
date: 2019-08-21
category: 数学
tags:
  - 概率
  - Java
toc: false
---

有这样一个问题：

4条小鱼在一个大的圆形水池中，分别随机的出现在圆圈中的任意一点。4条小鱼出现在同一个半圆的概率是多少？

![duck.svg =x300](/math/duck.svg)

<!-- more -->

::: warning 注意

以下内容含有大量剧透。

如果对题目感兴趣的话，可以先思考一下再往下看。

:::

作为一个程序员，我在毫无思路的情况下首先想到的方法就是用代码模拟：

```java ::collapsed-lines=7
public class Test {
    private static Random random = new Random();
    public static void main(String[] args) {
        int count = 0;
        for (int i = 0; i < 100000000; i++)
            if (check(random(), random(), random(), random()))
                count++;
        System.out.println(count / 1000000.0);
    }
    private static boolean check(Point a, Point b, Point c, Point d) {
        if (a.x == 0 && a.y == 0 || b.x == 0 && b.y == 0 || c.x == 0 && c.y == 0 || d.x == 0 && d.y == 0)
            return true; // 有一个点在圆心，概率极低，忽略
        // 如果存在一个点，过圆心和这个点做连线，另外三个点在连线的同一边，说明在同一个半圆
        return check2(a,b,c,d) || check2(b,a,c,d) || check2(c,a,b,d) || check2(d,a,b,c);
    }
    private static boolean check2(Point a, Point b, Point c, Point d) {
        // 向量叉乘，右手定则，正或负代表顺时针或逆时针
        double[] result = {b.x * a.y - b.y * b.x, c.x * a.y - c.y * a.x, d.x * a.y - d.y * a.x};
        return result[0] > 0 && result[1] > 0 && result[2] > 0 || result[0] < 0 && result[1] < 0 && result[2] < 0;
    }
    private static Point random() {
        while (true) {
            double x = 1 - random.nextDouble() * 2;
            double y = 1 - random.nextDouble() * 2;
            if (x * x + y * y <= 1)
                return new Point(x, y);
        }
    }
}
```

可以看到，我模拟了1亿次，最终共半圆的次数基本在!!4999万到5001万之间，说明概率应该是1/2!!。

## 数学原理

那么到底是为什么呢？于是我深入思考了一下：

首先，小鱼随机分布在池塘的一个点，这个问题太复杂了。由于池塘是个圆形，要求小鱼在同一个半圆，其实与小鱼距离圆心的距离是没有关系的，只与小鱼在哪条半径上（换句话说就是所在位置的角度）有关。因此，这个问题我们可以等价地转化为**小鱼分布在池塘的周长上**。

经过这样一番简化以后，上述的问题就简单多了，甚至可以推广到N条小鱼。

接下来，我们随机放入第一条小鱼，它的位置是随机的。在第一条小鱼的位置已经确定了的情况下，后面每一条小鱼的位置，要么在第一条小鱼的顺时针方向0-180°之间，要么在第一条小鱼的逆时针方向0-180°之间。那么剩下(N-1)条小鱼全部在顺时针方向0-180°之间的概率就是$\dfrac{1}{2^{N-1}}$。

由于我们是随机取的第一条小鱼，那么每一条小鱼都有可能是第一条小鱼，所以我们需要乘以N。最后的结果就是：$\dfrac{N}{2^{N-1}}$。

我们再来理一下思路：每一条小鱼都可能是这个半圆中**最逆时针**方向的那条小鱼，剩下(N-1)条小鱼都是在它的**顺时针0-180°之间**，所以上面这个推断是没有问题的。

将$N=4$代入上面的公式，得到的结果就是：$\dfrac{N}{2^{N-1}}=\dfrac{4}{2^{3}}=\dfrac{1}{2}$。

这与上面用代码随机模拟的结果是一致的。

为了验证这个公式的正确性，我用代码测试了一下3条小鱼和5条小鱼的情况，结果都和公式一致：

当$N=3$时，$\dfrac{N}{2^{N-1}}=\dfrac{3}{2^{2}}=\dfrac{3}{4}$

当$N=5$时，$\dfrac{N}{2^{N-1}}=\dfrac{5}{2^{4}}=\dfrac{5}{16}$

这里就不再展示验证代码了。