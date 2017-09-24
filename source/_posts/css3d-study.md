---
title: CSS3 实现🎲旋转教程
date: 2017-09-23 17:03:18
tags: CSS3
categories: CSS
---

<hr>

{% asset_img unphoto.jpg 可视化与🎲 %}

<blockquote><br/>最近的工作开始接触到可视化的 3D 部分，因此自己也抽时间温习了以前学习的 css3 知识点，顺便完成一个入门小 demo —— 实现一个旋转的骰子。这个例子里有重温 css3 的一些知识点——用它来实现立体和旋转效果，然后用 flex 布局来实现骰子的点的排列。这个案例对于以后熟练使用 css 和 flex 有一定的帮助，所以这里也做一份教程和总结。最终效果就在页面右下角，相信眼不尖的人也注意到了。

</blockquote>

<!-- more -->

## 索引

- [分解步骤](#分解步骤)
- [执行步骤](#执行步骤)
- [完整代码](#源码)

### 分解步骤

* 要完成这个案例，我们先来分解实现过程，再按步骤一步一步来实现。
1. 首先实现整体界面和骰子的基本界面，一共有六个面，包括面和点的基本样式。
2. 然后实现每个面上的骰子点数排列布局，完成所有的界面。
3. 使用 transform 实现立体形状，给骰子添加立体效果。
4. 为骰子添加旋转动画效果。

### 执行步骤

#### 1. 基本界面

* 这一步很基础，直接看代码。

```css
  .dice-content {
    position: relative;
    margin: 50px auto;
    width: 200px;
    height: 200px;
  }
  .dice-section {
    position: absolute;
    top: 0;
    left: 0;
    width: 200px;
    height: 200px;
    background-color: #e8e8e9;
    border: 1px solid #e0e0e0;
    border-radius: 15px;
  }
  .dice-point {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: inset 3px 3px 5px black;
    background-color: #333;
  }
```
```html
<div id="dice" class="dice">
  <div class="dice-content">
    <div class="dice-section">
      <!-- 这里为了使代码区分明显，点数用 span 来实现，因为在 flex 布局下它会以块级元素方式呈现 -->
      <span class="dice-point"></span>
    </div>
    <div class="dice-section">
      <span class="dice-point"></span>
      <span class="dice-point"></span>
    </div>
    <div class="dice-section">
      <span class="dice-point"></span>
      <span class="dice-point"></span>
      <span class="dice-point"></span>
    </div>
    <!-- 4、5、6等等 -->
  </div>
</div>
```

* 这是包了六个面的骰子的 div, 每个面的位置以绝对定位重叠在同一位置，便于之后修改。
然后我在外层再放了一个 div 来实现定位、透视等效果，这点后续会再提到。

#### 2. 点数排布

* 骰子每个面上的点数不一，每个面里面的点数的排列因此也不一样，但排列都是依循一定的规律。所以非常适合用 flex 布局来实现。

* 在点数布局中，我们主要使用了以下几个属性来实现——`flex-direction`、`justify-content`、`align-item`.

* 点数为 1 的情况最为简单，只要实现垂直居中。而 flex 实现垂直居中非常方便。`align-items`指定了 flex 容器中项目的对齐方式。所以父元素设置居中，子元素设置 auto 即可。

```css
  .dice-section {
    display: flex;
    align-item: center;
  }
  .dice-point {
    margin: auto;
  }
```

* 点数 4 和 点数 6 的实现方式类似，首先它们被分割成 2 行。然后分别排列点数，分别显示在每一行的两侧。

```css
  .dice-section {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .dice-section-row {
    display: flex;
    justify-content: space-around;
  }
```
```html
  <div class="dice-section">
    <div class="dice-section-row">
      <span class="dice-point"></span>
      <span class="dice-point"></span>
    </div>
    <div class="dice-section-row">
      <span class="dice-point"></span>
      <span class="dice-point"></span>
    </div>
  </div>
```

* 我们使用 `space-around` 项让行内元素均匀分布在行内。
* 这里值得注意的是我们对行也做了同样的处理，只不过是用 `column` 换了个方向，让行上下均匀分布在面上，撑满整个面，否则会挤在一块。

* 然后点数 2 和 点数 3 的实现方式类似，它们被分割成 2 行和 3 行。然后分别排列点数，分别显示在左中右的位置。

```css
  .dice-section {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .dice-section-row-start {
    display: flex;
    justify-content: flex-start;
  }
  .dice-section-row-center {
    display: flex;
    justify-content: center;
  }
  .dice-section-row-end {
    display: flex;
    justify-content: flex-end;
  }
```
```html
  <!-- 以点数 3 为例 -->
  <div class="dice-section">
    <div class="dice-section-row-start">
      <span class="dice-point"></span>
    </div>
    <div class="dice-section-row-center">
      <span class="dice-point"></span>
    </div>
    <div class="dice-section-row-end">
      <span class="dice-point"></span>
    </div>
  </div>
```

* `flex-start`、`center`、`flex-end`表明行内元素分别从行首、行中、行尾开始排列，这样使得点数正好分别排在行内的左中右位置。

* 同理，点数 5 的排列则是结合了 `space-around` 和 `center` 来实现。

* 到这里点数的骰子的界面基本完成，接下来是给骰子加上立体效果。

#### 3. 立体效果

* 有两种方式可以让元素以 3D 效果方式呈现。
  * 给父元素添加 `transform-style: preserve-3d` 告诉元素以 3D 方式呈现。它会影响子元素的呈现。
  * 给父元素添加 `perspective` 属性，这个属性就是眼睛离画布的距离，值越小离画布越近，效果越明显(头越晕)。通常设置一个较大值来观察，这样更加清楚。


* 这里我们采用第一种方式。然后开始对每个面加以处理。

* 我们使用 `transform` 属性的 `rotate` 来实现旋转，用 `translate` 来实现平移。
* 6个面里，前后面的改动是最小的。立体形象中，我们以立方体的正中心作为中心点。那么正面需往前平移，然后背面要离正面一个面的长度大小，所以背面沿三维面的 Z 轴向后平移。

```css
  .dice-pos-front {
    transform: translateZ(100px);
  }
  .dice-pos-back {
    transform: translateZ(-100px);
  }
```

* 上下面的显示应当是沿 X 轴旋转，然后再位移，需注意旋转后基准的坐标系也变了，看似是上下沿着 Y 轴位移，实际是参照旋转前的 Z 轴位移。

```css
  .dice-pos-top {
    transform: rotateX(90deg) translateZ(100px);
  }
  .dice-pos-bottom {
    transform: rotateX(90deg) translateZ(-100px);
  }
```

* 左右面也是类似的道理。

```css
  .dice-pos-left {
    transform: rotateY(90deg) translateZ(100px);
  }
  .dice-pos-right {
    transform: rotateY(90deg) translateZ(-100px);
  }
```

* 到这里，一个完整的立方体效果应当出来了。但界面上可能还看不出，我们给这个立方体旋转一定角度，让它呈现得更立体一些。

```css
  .dice-content {
    transform: rotateX(-30deg) rotateY(-40deg);
  }
```

* 效果如下:

{% asset_img dice.png dice %}

#### 4. 动画效果

* css3 的动画从关键帧 `keyiframe` 开始，定义初始状态和结束状态。然后加以应用。

```css
  /* 定义一个名为 rotate 的动画 */
  @keyframe rotate {
    from {
      transform: rotateX(-30deg) rotateY(-30deg)
    }
    to {
      transform: rotateX(180deg) rotateY(360deg)
    }
  }

  /* 然后应用，配置动画时长，动画效果等参数 */
  .dice-content {
    animation: rotate 10s infinite;
  }
```

* 到这里，最基本的一个旋转的骰子就实现了。

* 我们还可以通过 `animation` 的其他属性为这个旋转添加一点速度效果。

### 源码

* 我将常用的样式类提取了出来。
* 添加了 `perspective` 来增强效果。
* 添加 `animation-timing-funtion` 在各关键帧切换时添加速度效果。

```html
<!DOCTYPE html>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>🎲</title>
  <style>
    .flex {
      display: flex;
    }
    .flex-column {
      flex-direction: column;
    }
    .jc-c {
      justify-content: center;
    }
    .jc-sa {
      justify-content: space-around;
    }
    .jc-fs {
      justify-content: flex-start;
    }
    .jc-fe {
      justify-content: flex-end;
    }

    .dice {
      perspective: 1000px;
    }
    .dice-content {
      /* 设定一个初始角度值以便查看效果 */
      transform: rotateX(-30deg) rotateY(-40deg);
      position: relative;
      margin: 50px auto;
      width: 200px;
      height: 200px;
      transform-style: preserve-3d;
      -webkit-transform-style: preserve-3d;
      transform-origin: 50%;
      -webkit-transform-origin: 50%;
      animation: rotate 7s infinite;
      -webkit-animation: rotate 7s infinite;
      animation-timing-function: ease;
      -webkit-animation-timing-function: ease;
    }
    .dice-section {
      position: absolute;
      top: 0;
      left: 0;
      width: 200px;
      height: 200px;
      background-color: #e8e8e9;
      border: 1px solid #e0e0e0;
      border-radius: 15px;
    }
    .dice-point {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      box-shadow: inset 3px 3px 5px black;
      background-color: #333;
    }

    /* 前后面不做翻转，只在 Z 轴坐标系上平移 */
    .dice-pos-front {
      transform: translateZ(100px);
    }
    .dice-pos-back {
      transform: translateZ(-100px);
    }
    /* 上下面是沿 X 轴翻转并位移, 从效果上看是沿 Y 轴平移，但因为加了翻转效果，其实是在 Z 轴上平移 */
    .dice-pos-top {
      align-items: center;
      transform: rotateX(90deg) translateZ(100px);
    }
    .dice-pos-top .dice-point {
      margin: auto;
      background-color: red;
      box-shadow: inset 3px 3px 5px #333;
    }
    .dice-pos-bottom {
      transform: rotateX(90deg) translateZ(-100px);
    }
    /* 左右面是沿 Y 轴翻转并位移, 从效果上看是沿 X 轴平移，但因为加了翻转效果，其实是在 Z 轴上平移 */
    .dice-pos-left {
      transform: rotateY(90deg) translateZ(-100px);
    }
    .dice-pos-right {
      transform: rotateY(90deg) translateZ(100px);
    }

    /* 定义一个名为 rotate 的动画 */
    @-webkit-keyframes rotate {
      0% {
        transform: rotateX(-30deg) rotateY(-40deg)
       }
      35% {
        transform: rotateX(180deg) rotateY(360deg)
      }
      75% {
        transform: rotateX(-90deg) rotateY(-180deg)
      }
      100% {
        transform: rotateX(30deg) rotateY(40deg)
      }
    }
  </style>
</head>
<body>
  <!-- 纯 css3 实现 🎲 -->
  <div id="dice" class="dice" title="🎲 点我就消失">
    <div class="dice-content">
      <!-- 1 -->
      <div class="dice-section dice-pos-top flex">
        <span class="dice-point"></span>
      </div>
      <!-- 2 -->
      <div class="dice-section dice-pos-left flex flex-column jc-sa">
        <div class="flex jc-fs">
          <span class="dice-point"></span>
        </div>
        <div class="flex jc-fe">
          <span class="dice-point"></span>
        </div>
      </div>
      <!-- 3 -->
      <div class="dice-section dice-pos-front flex flex-column jc-sa">
        <div class="flex jc-fs">
          <span class="dice-point"></span>
        </div>
        <div class="flex jc-c">
          <span class="dice-point"></span>
        </div>
        <div class="flex jc-fe">
          <span class="dice-point"></span>
        </div>
      </div>
      <!-- 4 -->
      <div class="dice-section dice-pos-back flex flex-column jc-sa">
        <div class="flex jc-sa">
          <span class="dice-point"></span>
          <span class="dice-point"></span>
        </div>
        <div class="flex jc-sa">
          <span class="dice-point"></span>
          <span class="dice-point"></span>
        </div>
      </div>
      <!-- 5 -->
      <div class="dice-section dice-pos-right flex flex-column jc-sa">
        <div class="flex jc-sa">
          <span class="dice-point"></span>
          <span class="dice-point"></span>
        </div>
        <div class="flex jc-c">
          <span class="dice-point"></span>
        </div>
        <div class="flex jc-sa">
          <span class="dice-point"></span>
          <span class="dice-point"></span>
        </div>
      </div>
      <!-- 6 -->
      <div class="dice-section dice-pos-bottom flex jc-sa">
        <div class="flex flex-column jc-sa">
          <span class="dice-point"></span>
          <span class="dice-point"></span>
          <span class="dice-point"></span>
        </div>
        <div class="flex flex-column jc-sa">
          <span class="dice-point"></span>
          <span class="dice-point"></span>
          <span class="dice-point"></span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```
