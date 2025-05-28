---
title: 点和凸多边形的问题
icon: draw-polygon
order: 1
date: 2024-06-20
category: 数学
excerpt: <ul><li>判断点是否在凸多边形内</li><li>判断凸边形外的点到凸多边形的距离</li></ul>
tags:
  - 几何
  - Python
  - Go
---

## 判断点是否在凸多边形内

已知凸多边形的所有顶点的坐标，如何判断一个点是否在这个多边形内？

我们把每条边看做一个向量，$\overrightarrow{AB}, \overrightarrow{BC}, \overrightarrow{CD}, \dots$。我们知道，平面向量叉乘结果的数值正负，取决于两个向量位置关系。

那么我们换个思路来思考，点在凸多边形内，其实就等价于点在每条边决定的向量的同一侧。

这样一来，问题就简单了，我们假设点为 $P$，那么我们只需要判断 $\overrightarrow{AB} \times \overrightarrow{AP}, \overrightarrow{BC} \times \overrightarrow{BP}, \overrightarrow{CD} \times \overrightarrow{CP}, \dots$ 的结果的正负号是否相同即可。当且仅当所有结果的正负号相同，说明点 $P$ 在多边形内；如果有正有负，说明点 $P$ 在多边形外。

::: code-tabs

@tab Python

```python :no-collapsed-lines
# 已知凸多边形的N个顶点坐标points = [(x1, y1), (x2, y2), (x3, y3), ...]
# 已知点P的坐标p = (x, y)
def check(points, p):
    old_result = 0
    for i in range(1, len(points)):
        dx1 = points[i].x - points[i-1].x
        dy1 = points[i].y - points[i-1].y
        dx2 = p.x - points[i-1].x
        dy2 = p.y - points[i-1].y
        result = dx1 * dy2 - dy1 * dx2
        if result == 0:
            continue # 允许在边上就continue，不允许就直接return False
        if old_result == 0:
            old_result = result
        elif (result > 0) != (old_result > 0):
            return False # 正负号不同，说明在多边形外
    return True
```

@tab Go

```go :no-collapsed-lines
// 已知凸多边形的N个顶点坐标points = [(x1, y1), (x2, y2), (x3, y3), ...]
// 已知点P的坐标p = (x, y)
func check(points []Point, p Point) bool {
    var oldResult int
    for i := 1; i < len(points); i++ {
        dx1, dy1 := points[i].X-points[i-1].X, points[i].Y-points[i-1].Y
        dx2, dy2 := p.X-points[i-1].X, p.Y-points[i-1].Y
        result := dx1*dy2 - dy1*dx2
        if result == 0 {
            continue // 允许在边上就continue，不允许就直接return false
        }
        if oldResult == 0 {
            oldResult = result
        } else if (result > 0) != (oldResult > 0) {
            return false
        }
    }
    return true
}
```

:::

::: tip 那如果是凹多边形怎么办？

把凹多边形切分成几个凸多边形即可。

:::

### 特殊情况

对于矩形等旋转之后很容易判断的情况，可以把整张图旋转一下再进行判断，可能会更快。

例如：一个矩形的四个顶点为 $(0, 0), (1, 1), (0, 2), (-1, 1)$，我们知道绕原点顺时针旋转45°之后，就变成了一个在第一象限的边长为$\sqrt{2}$的正方形，因此我们将点 $P(x, y)$ 也绕原点顺时针旋转45°变成 $P'(x', y')$，那么我们只需要判断 $0 < x' < \sqrt{2}$ 且 $0 < y' < \sqrt{2}$ 即可。

将点 $(x, y)$ 绕点 $(x_0, y_0)$ **逆时针**旋转 $\theta$ 角度得到点 $(x', y')$ 的公式为：

$$
\begin{aligned}
x' - x_0 & = (x-x_0) \cdot \cos{\theta} - (y-y_0) \cdot \sin{\theta}\\
y' - y_0 & = (x-x_0) \cdot \sin{\theta} + (y-y_0) \cdot \cos{\theta}
\end{aligned}
$$

当 $(x_0, y_0)$ 是原点时，公式简化为：

$$
\begin{aligned}
x' & = x \cdot \cos{\theta} - y \cdot \sin{\theta}\\
y' & = x \cdot \sin{\theta} + y \cdot \cos{\theta}
\end{aligned}
$$

## 判断凸边形外的点到凸多边形的距离

已知凸多边形的所有顶点的坐标，如何判断凸边形外的一个点到这个多边形的距离？

点到凸多边形的距离，其实就是点到凸边形周长上所有点的最短距离。再进一步转化就是，点到凸多边形的每一条边的线段的距离的最小值。

那么如何求点到线段的距离呢？
- 如果点在直线的投影在线段上，那么点到线段的距离就是点到投影的距离，即垂直距离。
- 如果点在直线的投影在线段外，那么点到线段的距离就是点到线段两端点的距离的最小值。

用公式描述就是：
  - 如果 $\overrightarrow{AB} \cdot \overrightarrow{AP} < 0$ ，说明点 $P$ 在点 $A$ 的投影在线段外靠近点 $A$ 这一侧，距离就是点 $P$ 到点 $A$ 的距离。
  - 如果 $\overrightarrow{AB} \cdot \overrightarrow{AP}$ > $||\overrightarrow{AB}||^2$，说明点 $P$ 在点 $B$ 的投影在线段外靠近点 $B$ 这一侧，距离就是点 $P$ 到点 $B$ 的距离。
  - 否则，说明点 $P$ 在点 $A$ 和点 $B$ 之间，距离就是点 $P$ 到线段的垂直距离：$\dfrac{||\overrightarrow{AP} \times \overrightarrow{AB}||}{||\overrightarrow{AB}||}$。

上述三者取最小值，即为点到线段的距离。

那么问题就简单了，遍历多边形的每一条边，计算点到线段的距离，然后取最小值即可。

::: code-tabs

@tab Python

```python :no-collapsed-lines
# 计算点到凸多边形的距离
def distance(p, rect):
    minDist = float('inf')
    for i in range(len(rect)):
        a = rect[i]
        b = rect[(i + 1) % len(rect)]
        dist = distanceToSegment(p, a, b)
        if dist < minDist:
            minDist = dist
    return minDist
    
# 计算点P到线段AB的最短距离
def distanceToSegment(p, a, ab):
    dx = ab.x - a.x
    dy = ab.y - a.y
    if dx == 0 and dy == 0:
        return pointDistance(p, a)
    ap_x = p.x - a.x
    ap_y = p.y - a.y
    len_squared = dx * dx + dy * dy
    t = ap_x * dx + ap_y * dy
    if t < 0:
        return math.sqrt(ap_x*ap_x + ap_y*ap_y)
    elif t > len_squared:
        return math.Sqrt((p.X-ab.X)*(p.X-ab.X) + (p.Y-ab.Y)*(p.Y-ab.Y))
    else: # 计算垂直距离
        numerator = abs(dy * (p.x - a.x) - dx * (p.y - a.y))
        return abs(numerator) / math.sqrt(len_squared)
```

@tab Go

```go :no-collapsed-lines
// 计算点到凸多边形的距离
func distance(p Point, rect []Point) float64 {
    minDist := math.MaxFloat64
    for i := range rect {
        a, b := rect[i], rect[(i + 1) % len(rect)]
        dist := distanceToSegment(p, a, b)
        if dist < minDist {
            minDist = dist
        }
    }
    return minDist
}

// 计算点P到线段AB的最短距离
func distanceToSegment(p, a, b Point) float64 {
    dx, dy := b.X - a.X, b.Y - a.Y
    if dx == 0 && dy == 0 {
        return pointDistance(p, a)
    }
    apX, apY := p.X - a.X, p.Y - a.Y
    lenSquared := dx*dx + dy*dy
    t := apX*dx + apY*dy
    if t < 0 {
        return math.Sqrt(apX*apX + apY*apY)
    } else if t > lenSquared {
        return math.Sqrt((p.X-b.X)*(p.X-b.X) + (p.Y-b.Y)*(p.Y-b.Y))
    } else { // 计算垂直距离
        numerator := math.Abs(dy*(p.X-a.X) - dx*(p.Y-a.Y))
        return math.Abs(numerator) / math.Sqrt(lenSquared)
    }
}
```

:::