---
title: 如何清除input元素自定义样式
date: 2016-10-01 23:28:16
tags: 
---

<blockquote><br/>有注意到input在不同状态下，或者不同浏览器下都会有显示的问题。例如ios下的浏览器里input有边框显示问题，设置input属性appearance为none即可解决。但最近新发现的是input的type属性设置为number时的样式问题。

</blockquote>

<!--more-->

### input样式问题

* 当type的值设置为number时，聚焦状态下会出现一个小边框，如下图：

  {% asset_img input-number.png input-number%}

* 因强迫症和需求以及正常的审美观要求，一致确定去掉这个丑陋的多余项。

* 查阅部分资料后找到解决办法如下： 

```javascript
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0; // Apparently some margin are still there even though it's hidden -清除margin。
}
```



*  ***原理就是关闭input自带的number按钮选项。***

<blockquote><br/>参考：[Turn Off Number Input Spinners](https://css-tricks.com/snippets/css/turn-off-number-input-spinners/)

</blockquote>