---
title: 你可能还不知道的 flex 属性细节
date: 2020-08-20 22:05:41
tags: CSS3
categories: CSS
---
<hr/>

![](/2020/08/20/something-you-need-know-about-flex/unphoto.jpg)
众所周知，flex 布局是如今最常见的布局方式之一。但在我们设置单个元素的属性的时候，通常只用到flex 的一个值，或者使用若干个值，却不了解它的具体计算逻辑，只知道它会填充。这篇文章，尝试解读 flex 属性的作用和算法。
推荐：★★★☆

<!--more-->

## 索引

* [flex 属性定义](#flex属性定义)
* [flex 属性分配](#flex属性分配)
* [flex 算法](#flex算法)
* [flex 实践](#flex实践)
* [参考](#参考)

### flex属性定义

* 目前我们已知，flex 是三个属性的简写。这三个属性按顺序分别为 `flex-grow`, `flex-shrink`, `flex-basis`. 他们的含义分别是——用我自己的理解来解释
  * 父元素容器宽度**富余**时，分配多余的宽度的比例，单位是数字
  * 父元素容器宽度**不足**时，分配欠缺的宽度的比例，单位是数字
  * 父元素容器宽度分配的基准值，也就是最小的**计算单位**，数值是宽度
* 这样表达不知是否容易理解，实际这和我自己之前的理解是相悖的，之前我一直以为是按比例分配的是父元素整个容器的宽度，其实不然。不知是否有小伙伴和我一样理解有误。

### flex属性分配

* flex 设置为 1 的时候。其三个元素的默认值是 `1, 1, auto`.
* 可以理解为大家平分。
* 这里不多赘述，这是我们最常用的方式。
* 这篇文章主要讨论的是它们的分配逻辑，计算方式。
* 下面就用公式和实例来详细解释个中的含义。

### flex算法

* 这里要注意的是，主要关注点在于区分父元素容器还有没有富余的情况。打个比方，就是你爷爷有没有留下多余的地给孩子们分，如果有，就使用 `flex-grow`, `flex-basis` 计算，不然就使用 `flex-shrink`, `flex-basis`
* 是的，没看错。不管在哪种情况下，实际只有两个属性是生效的，有一个属性不在计算范围之内，需要略过。
* 纳入计算的总的田地（宽度），是超出父容器的，或者少于父容器的部分。
  * **那么什么时候子元素的总和会出现以上两种情况呢，因为默认 flex 布局本身是适应的。答案就是设置了 flex-basis 的情况，手动设置的 flex-basis 之和超出了父元素的宽度值。**
  * 下面是子元素宽度之和少于父元素的情况下( `child_width1 + child_width2 + ... < parent_width`)，计算的方式。这里为了方便理解，设定是两个子元素，实际上多个子元素的算法也是完全一样的。

```javascript
// 超出的宽度
const extra_all_width = parent_width - (flex_basis1 + flex_basis2);

// 假设有两个子元素，则下面是两者各自的总宽度
const basic_width1 = flex_grow1 * flex_basis1;
const basic_width2 = flex_grow2 * flex_basis2;

// 总宽度
const all_width = basic_width1 + basic_width2;

// 富余的宽度的具体分配，按各自的比例，乘以超出的总宽度来分配
const extra_width1 = (basic_width1) / all_width * extra_all_width;
const extra_width2 = (basic_width2) / all_width * extra_all_width;

// 基准宽度加上超出的分配到的宽度，就是最终宽度
const width1 = flex_basis1 + extra_width1;
const width2 = flex_basis2 + extra_width2;
```

* 有了以上的算法，那么就会比较容易推算出父元素宽度不足的情况下( `child_width1 + child_width2 > parent_width`)的计算方式。比例的参考值从 `flex-grow` 改为 `flex-shrink`

```javascript
// 缺少的宽度
const shortage_all_width = (flex_basis1 + flex_basis2) - parent_width;

// 假设有两个子元素，则下面是两者各自的总宽度
const basic_width1 = flex_shrink1 * flex_basis1;
const basic_width2 = flex_shrink2 * flex_basis2;

// 总宽度
const all_width = basic_width1 + basic_width2;

// 缺少的宽度的具体分配，按各自的比例，乘以缺少的总宽度来分配
const shortage_width1 = (basic_width1) / all_width * shortage_all_width;
const shortage_width2 = (basic_width2) / all_width * shortage_all_width;

// 基准宽度减去超出的分配到的宽度，就是最终宽度
const width1 = flex_basis1 - shortage_width1;
const width2 = flex_basis2 - shortage_width2;
```

### flex实践

* 有了以上的算法，那么来计算宽度就轻而易举了。
* 这里罗列了设定了父元素宽度，且有两个子元素的情况。分别是宽度超出和不足的情况。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    * {
      padding: 0;
      margin: 0;
    }
    .container {
      width: 600px;
      height: 300px;
      display: flex;
    }
    .left {
      flex: 1 2 500px;
      background: red;
    }
    .right {
      flex: 2 1 400px;
      background: blue;
    }

    .left1 {
      flex: 1 2 200px;
      background: yellow;
    }
    .right1 {
      flex: 2 1 100px;
      background: olivedrab;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="left"></div>
    <div class="right"></div>
  </div>
  <div class="container">
    <div class="left1"></div>
    <div class="right1"></div>
  </div>
</body>
</html>
```

* 计算宽度不足的场景，套用下以上的公式。

```javascript
// 缺少的宽度
const shortage_all_width = (500 + 400) - 600; // 300

// 假设有两个子元素，则下面是两者各自的总宽度
const basic_width1 = 2 * 500;
const basic_width2 = 1 * 400;

// 总宽度
const all_width = 1000 + 400; // 1400

// 缺少的宽度的具体分配，按各自的比例，乘以缺少的总宽度来分配
const shortage_width1 = 1000 / 1400 * 300; // 214.28
const shortage_width2 = 400 / 1400 * 300 // 85.72

// 基准宽度减去超出的分配到的宽度，就是最终宽度
const width1 = 500 - 214.28; // 285.72
const width2 = 400 - 82.72; // 314.28
```

* 这里实践下来，相信是比较容易理解的了。那么在以上的代码里，还剩下一个宽度富余的场景，各位有兴趣可以自行计算一下子元素 `left1`, `right1`的宽度。
* 如果以上有计算错误或理解有误的地方，欢迎指正。

### 参考

> * [flex 布局](http://ddrv.cn/a/125011)
> * [伸缩性](https://developer.mozilla.org/zh-CN/docs/Glossary/Flex)
> * [css-flexbox](https://www.w3.org/TR/css-flexbox/#main-size)

<!-- 2.5h -->

