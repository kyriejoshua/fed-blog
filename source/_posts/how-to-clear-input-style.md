---
title: 如何清除input元素自定义样式
date: 2016-10-01 23:28:16
tags: css
---

<hr>

{% asset_img unphoto.jpg Input...%}

<blockquote><br/>有注意到input在不同状态下，或者不同浏览器下都会有显示的问题。例如ios下的浏览器里input有边框显示问题，设置input属性appearance为none即可解决。但input仍然留下许多样式坑。

</blockquote>

<!--more-->

### input(type=number)样式问题

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

### input作为表单自动提交时

*  当input作为表单时，会自动记录之前的填写项，并自动补充，如果选择自动补充的选项，而且本身给input设置了样式时。画面就会非常唯美（丑陋）。

{% asset_img input-ugly.png ugly %}

*  这里有两种解决方案：

*  1.修改自动填充的样式（推荐）:

   ```javascript
      // 使用以下样式来覆盖原有的，更改了背景和字体颜色
      input: -webkit-autofill,
      textarea: -webkit-autofill,
      select: -webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #323339 inset;
        -webkit-text-fill-color: white;
      }
      // 覆盖以下的chrome自带样式
      input: -webkit-autofill, textarea: -webkit-autofill, select: -webkit-autofill {
        background-color: rgb(250, 255, 189);
        background-image: none;
        color: rgb(0, 0, 0);
      }
   ```

*  原理是通过打补丁来解决自定义样式——是不是优雅了很多~

{% asset_img input-perfect.png perfect %}

*  2.通过关闭表单的自动填充功能来彻底根除该问题：

```javascript
  <input type="number" autocomplete="off"/>
```

*  这样就连提示也没有了~也是种解决办法。

<blockquote><br/>参考：[Turn Off Number Input Spinners](https://css-tricks.com/snippets/css/turn-off-number-input-spinners/)

</blockquote>