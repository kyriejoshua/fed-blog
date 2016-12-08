---
title: 微信内置浏览器兼容性问题汇总
date: 2016-11-01 14:34:11
tags: 兼容性
---

<hr>

{% asset_img unphoto.jpeg Actually I dont like wechat %}

<blockquote><br>本文列举了个人在微信公众号里开发时所遇到的浏览器兼容性问题。不定期更新。

</blockquote>

<!--more-->

1.ios内置微信浏览器不支持active伪类。

- 解决办法：添加触摸事件：

```javascript
document.body.addEventListener('touchstart',function(){})
```

2.百度地图api在微信内不生效，应当是微信做了屏蔽工作

3.ios端微信浏览器会给input框加上自带的样式，例如圆角和内阴影。是因为-webkit-appearance这个属性的影响

- [appearance CSS规范](http://www.w3school.com.cn/cssref/pr_appearance.asp)
  *解决办法：给input添加以下样式

```css
input {
    appearance: none;
    -webkit-appearance: none; /* safari */
    -moz-appearance: none;
}
```

4.ios端微信浏览器，包括ios上所有使用Safari内核的浏览器，都会有该问题——

- 直接在window, document, body下绑定click事件，点击body不会触发

- 几个解决办法

  - 使用touch事件，但在弹出层上会有点透问题

  - 避免bug触发：不要委托事件在body结点上。可以指定任何除了上述元素外的父元素，给该元素下的元素绑定事件。

  - 已触发情况：safari对事件的解析比较特殊，事件有响应过，则会一直冒泡（捕获）到根节点，对于**大规模**触发的情况，只要在body元素的所有子元素绑定一个空事件，如：

    ```javascript
     $('body > *').on('click', function() {});
    ```

5.ios系统下的浏览器，会自动识别疑似电话号码的数字，将其添加自动拨号功能：

- 18878898922会被自动修改为`<a href="tel:18878898922"></a>`,就有了自动拨号功能。
- 但有时是不需要这个鸡肋功能的，解决办法是在页面顶部添加一行`<meta name="format-detection" content="telephone=no">`禁用该功能。
- `format-detection`决定启用或禁用该功能

6.微信分享的缩略图

* 微信中分享网页时会有缩略图，该缩略图默认是网页中的第一张图片，无论显不显示

* 但是图片大小小于400px * 400px 时，或者直接将图片隐藏会导致无法显示

* 所以较好的解决方案是在标签 img 外面加父元素 div ,给 div 设置:

  ```html
  <div style="margin: 0 auto;width: 0;height: 0; overflow: hidden"></div>
  ```

* 而图片无需处理，最终可写成如下:

  ```html
  <div style="margin: 0 aut0; width: 0; height: 0; overflow: hidden;">
    <img src="./images/pic.png"/>
  </div>
  ```