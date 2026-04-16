---
title: Go对JSON中的int类型的处理
icon: b:golang
order: 13
category: 编程日记
tags: 
  - Go
  - JSON
date: 2026-04-16
toc: false
---

Go 语言对 JSON 中`int`类型的处理非常方便，基本涵盖了大多数特殊情况。

<!-- more -->

## 本地是 int，但 JSON 中是 string

有的时候，我们本地结构是一个较大的`int`类型，如果按照正常的方式序列化，会得到`{"bar": 9223372036854775807}`。然而，JavaScript 中采用 IEEE 754 双精度浮点数（即`Number`类型）来存储所有数字，其能安全表示的最大整数是 2^53^ - 1。因此如果使用 JavaScript 做前端，处理这个 JSON 时就会丢失精度。这种情况下，我们可能会约定在 JSON 中将这个`int`类型加上引号，作为字符串来传输。对于这种情况，我们可以这样定义结构体：

```go
type foo struct {
    Bar int `json:"bar,string"`
}
```

这样在序列化时，`int`类型的`Bar`字段会被转换成字符串形式的数字（带引号）。在反序列化时，也会正确地将其解析成一个`int`类型的值。值得一提的是，在反序列化时，如果 JSON 中不带引号，但这里加了`string`选项，就会解析失败。

当然，这种方式也适用于其他基本类型，比如`float64`、`bool`等，都只要在 JSON 标签中加上`string`选项即可。

## 不确定是 int 还是 string

有的时候，由于供应方的 API 不规范，对于某个字段，它是一个数字，但它在 JSON 中有可能直接作为数字（不带引号），也有可能作为一个字符串（带引号）。这种情况我们就可以这样定义结构体：

```go
type foo struct {
    Bar json.Number `json:"bar"`
}
```

这样不管传过来的是`{"bar": 123}`还是`{"bar": "123"}`，都可以正确解析。

我们查看`encoding/json`包的源码，找到其中`json.Number`的定义：

```go
// A Number represents a JSON number literal.
type Number string

// String returns the literal text of the number.
func (n Number) String() string { return string(n) }

// Float64 returns the number as a float64.
func (n Number) Float64() (float64, error) {
	return strconv.ParseFloat(string(n), 64)
}

// Int64 returns the number as an int64.
func (n Number) Int64() (int64, error) {
	return strconv.ParseInt(string(n), 10, 64)
}
```

可以看到，`json.Number`的底层是`string`。在调用`json.Unmarshal`时，如果字段类型是`json.Number`，无论它是否带引号，以一个字符串的形式存储（只会做一个轻量级的格式校验，判断是否能解析成数字）。当我们调用它的`Int64()`、`Float64()`等方法时，才会真正去解析这个字符串并返回对应的数值。这个方式叫做**延迟解析**。

值得一提的是，在序列化的时候，如果字段类型是`json.Number`，会得到一个数字类型（不带引号）。如果我们想要在序列化时保持字符串的形式（带引号），可以在 JSON 标签中加上`string`选项：

```go
type foo struct {
    Bar json.Number `json:"bar,string"`
}
```

## 不想延迟解析怎么办？

`json.Number`采用了**延迟解析**的方式，但我们有可能遇到这样一种情况，在代码中我们对这个字段有大量调用，我们不希望每次调用`Int64()`、`Float64()`等方法时都要判断返回的`error`，这也有办法解决。

`encoding/json`包中有一个`Unmarshaler`接口：

```go
type Unmarshaler interface {
	UnmarshalJSON([]byte) error
}
```

只要我们实现这个接口，就可以自定义 JSON 反序列化的行为了。我们可以定义一个新的类型`Int64`，它的底层类型是`int64`，并实现`UnmarshalJSON`方法来处理 JSON 中既可能是数字又可能是字符串的情况：

```go
type Int64 int64

func (i *Int64) UnmarshalJSON(data []byte) error {
	if len(data) >= 2 && data[0] == '"' && data[len(data)-1] == '"' {
		data = data[1 : len(data)-1]
	}
	v, err := strconv.ParseInt(string(data), 10, 64)
	*i = Int64(v)
	return err
}

// 序列化时默认不带引号，如果想要带引号，就可以再实现一下 MarshalJSON 方法
func (i Int64) MarshalJSON() ([]byte, error) {
	str := strconv.FormatInt(int64(i), 10)
	return strconv.AppendQuote(nil, str), nil
}
```