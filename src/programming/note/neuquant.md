---
title: 一种图像量化算法的分享
order: 7
category: 编程随笔
icon: image
tags:
  - 算法
  - Go
date: 2021-12-23
---

## 什么叫图像量化？

假设我们有一张彩色图像，例如RGB图像，我想要存成gif格式，以压缩文件大小。gif图片首先有一个调色板，这个调色板有256种颜色，然后每个像素只需要一个字节(0-255)来表示选用调色板上的哪个颜色。

那么现在问题就来了，一个RGB图像有256^3^种颜色，而gif图像只有256种颜色，如何将256^3^种颜色映射到256种颜色上呢？这就是**图像量化**的问题。

<!-- more -->

**图像量化**肯定是**有损**的，但我们希望尽可能地让图像不过于失真。那么思路就是：变化比较多的颜色，我们在调色板上多分配一点，而变化比较少的颜色，我们在调色板上少分配一点。这样一来，调色板上的颜色就会比较均匀地分布在整个RGB空间中。

Go、Java等语言在标准库中实现了一些图像量化算法，大家可以直接使用。除此之外，还有一些其它的图像量化算法。

## Neuquant

Anthony H. Dekker 在 1994-08-01 发表的论文 《Kohonen neural networks for optimal colour quantization》 中提到了一种基于神经网络的方法。具体的思路大家感兴趣可以查看论文。

我使用Go语言对这个算法进行了实现：[https://github.com/CuteReimu/neuquant](https://github.com/CuteReimu/neuquant)

简单做一个测试，看看失真程度如何：

```go :no-collapsed-lines
package main

import (
	"github.com/CuteReimu/neuquant"
	"image/gif"
	"image/jpeg"
	"os"
)

func main() {
	f, _ := os.Open("1.jpg")
	defer f.Close()
	img, _ := jpeg.Decode(f)

	f2, _ := os.Create("1.gif")
	defer f2.Close()
	_ = gif.Encode(f2, img, neuquant.Opt())
}
```

![neuquant.jpg =x300](/programming/neuquant.jpg)![neuquant.gif =x300](/programming/neuquant.gif)

可以看出，有一定的失真，但是整体效果还是可以的。

在这个基础上，我们应该就很容易做出gif动画，比如说：

```go
package main

import (
	"github.com/CuteReimu/colortools"
	"github.com/CuteReimu/neuquant"
	"image"
	"image/color"
	"image/gif"
	"image/jpeg"
	"os"
)

func main() {
	f, _ := os.Open("1.jpg")
	defer func() { _ = f.Close() }()
	img, _ := jpeg.Decode(f)
	result := &gif.GIF{}
	for j := 0; j < 360; j += 30 {
		c := make([]color.Color, 361)
		p := make([]float64, 361)
		for i := 0; i <= 360; i++ {
			c[i] = &colortools.HSV{H: float64(i + j), S: 1.0, V: 0.5}
			p[i] = float64(i) / 360.0
		}
		img1 := colortools.NewLineGradChgColorImage(img.Bounds(), c, p, img.Bounds())
		img2 := colortools.Screen(img1, img)

		img3 := neuquant.Paletted(img2)

		result.Image = append(result.Image, img3)
		result.Delay = append(result.Delay, 10)
	}
	f2, _ := os.Create("1.gif")
	defer func() { _ = f2.Close() }()
	_ = gif.EncodeAll(f2, result)
}
```

![neuquant_animate.gif =x300](/programming/neuquant_animate.gif)