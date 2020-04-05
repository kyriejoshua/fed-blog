---
title: H5 兼容问题整理及解决方案
date: 2019-11-30 21:59:22
tags: JavaScript
categories: JavaScript
---

<hr/>

![](/2019/11/30/something-about-h5/unphoto.jpg)

一些 H5 的兼容问题及解决方案。
推荐：★★★

<!-- more -->

* [Issue1](#issue1)
* [Issue2](#issue2)
* [小结](#小结)

### Issue1

简述：input 设置为只读后，ios 中仍然可以点击。

* 业务场景：
  * 页面某个表单填写完成后，手机号等剩余输入框内容设置为只读。

* 具体问题：
  * input 设置为只读后，ios 上仍然可点击，可以上下切换，交互上比较怪异。

* 解决思路：
  * 最初的角度是从取消元素的默认事件切入，`event.preventDefault()`. 但是不生效。
  * 因为 `input` 的默认事件是当值变化时触发，而不是点击事件。
  * 但我仍然觉得需要从事件的角度触发，那么  **`js` 不行，试试 `css`?**
  * 查阅后发现还真有属性来控制鼠标事件 —— `pointer-events`
  * *这个属性指定当前元素在什么情况下成为鼠标事件的目标。*
  * 在当前的场景下，答案自然是任何情况下，都不要成为鼠标事件目标，这样，元素变不可点击了。

* 解决方案：

  ```css
  input {
  	pointer-events: none;
  }
  ```

#### [pointer-events文档地址](https://developer.mozilla.org/zh-CN/docs/Web/CSS/pointer-events)


### Issue2

简述：ios 端键盘弹起后，直接关闭键盘，会导致底部区域多出一片空白——原先键盘占据的位置。

* 业务场景：
  * 在某些申请贷款的业务场景里，存在页面有许多输入项，输入内容几乎占据整个页面。如下图。

![展示输入的页面](/2019/11/30/something-about-h5/demo.png)

* 具体问题：
  * 输入内容较多时，当较底部的输入项输入完毕后，直接关闭键盘，底部会多出空白的键盘区域，整个页面布局上移，表面上元素正常显示，但元素内容的点击事件等却错位，导致 bug 产生。

* 解决思路：
  * 比较直观的思路是，监听键盘关闭的事件，然后手动将页面滚动至底部。
  * 但事实是，没有直接监听键盘关闭的事件，小程序中有，但 H5 中没有。
  * 于是要从侧面去判断，有两个方向。
    * **一个是监听页面大小变化——键盘的弹起收回是否会引起页面整体高度变化。**
    * **另一个是监听输入框失焦——输入完毕后，点击键盘，输入框自然就失焦了。**
  * 查阅后，发现监听大小的方式，在 ios 中不生效，因为它并没有改变页面整体大小，而是把页面往上推移，因此不予采用。
  * 那么就要从输入框失焦的角度。
  * 查到了事件 `focusin` 和 `focusout`. 并且这两个事件是可以**冒泡**的，因此可以直接绑定在 `body` 上。这时，以为解决了，惊喜的写下:

  ```javascript
  componentDidMount() {
    /**
     * [失焦时控制的滚动事件]
     * @param  {[type]} e [description]
     */
    this.handleScroll = (e) => {
      document.body.scrollIntoView()
    }

  	document.body.addEventListener('focusout', this.handleScroll)
  }

  // 别忘了卸载事件
  componentWillUnmount() {
  	document.body.removeEventListener('focusout', this.handleScroll)
  }
  ```

  * 当在手机上实际操作时，尽管每次点击键盘上的关闭，屏幕底部不再出现空白，但却发现输入完每一项，不关闭键盘而直接进入下一项时，页面都会自动向下滚动一次，直接滚到底部，输入框并不在屏幕正中了，体验十分不好。
  * 那，既然每次滚动到底部的体验不好，就每次让他滚动到输入的当前位置，使得输入项仍在屏幕中央，用户是可见的。
  * 要实现这样的效果，就需要每次记录下页面滚动的距离。在 `focusin` 方法中记录。

  ```javascript
  // 这里使用了一个兼容的获取滚动距离的函数
  function getScrollTop() {
    return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
  }

  componentDidMount() {
    /**
     * [聚焦时记录下滚动距离]
     * @param  {[type]} e [description]
     */
    this.recordScroll = (e) => {
      this.scrollTop = getScrollTop()
    }

    this.handleScroll = (e) => {
      document.body.scrollIntoView()
    }

    document.body.addEventListener('focusin', this.recordScroll)
  	document.body.addEventListener('focusout', this.handleScroll)
  }

  componentWillUnmount() {
    document.body.removeEventListener('focusin', this.recordScroll)
  	document.body.removeEventListener('focusout', this.handleScroll)
  }
  ```

  * 输入时乱滚到底部的现象没有了，每次他都会乖乖滚到当前的位置。但是……每次都滚动，给人的感觉还是很怪异，尤其是这里有这么多输入的场景。还是得想办法控制滚动，能不能只在关闭的时候滚动。
  * 先究其原因，`focusout` 事件是冒泡的，因此每一个 input 的失焦事件，都会向上冒泡，而我们从上到下切换输入框时，实际上触发了上一个 input 的失焦事件，从而冒泡至 body. 引发滚动。
  * 要解决，就要区分这类的失焦事件和关闭键盘的失焦事件，然而实际上，并没有专门分方法或属性来区分事件。这里的判断仍然要靠我们自己。
  * 没有办法直接判断，那就每次都执行，但，也每次都取消，直至最后一次。
  * 最终的解决方案有些类似于**函数防抖**，在每次**聚焦时取消失焦时注册的事件**，从而让最终的失焦事件触发。
  * 这里，只有输入框相关的事件，因此我们会做判断，以避免其他意外情况。

* 解决方案：

  ```javascript
  // 这里使用了一个兼容的获取滚动距离的函数
  function getScrollTop() {
    return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
  }

  componentDidMount() {
    /**
     * [聚焦时取消失焦时注册的事件]
     * @param  {[type]} e [description]
     */
    this.recordScroll = (e) => {
      if (e.target && e.target.tagName === 'INPUT') {
    	  window.clearTimeout(this.timer)
  	    this.scrollTop = getScrollTop()
      }
    }

    /**
     * [失焦时设置定时器异步触发事件，并记录返回值以供取消]
     * @param  {[type]} e [description]
     */
    this.handleScroll = (e) => {
      if (e.target && e.target.tagName === 'INPUT') {
        this.timer = window.setTimeout(() => {
  		    document.documentElement.scrollTop = this.scrollTop;
      		document.body.scrollTop = this.scrollTop;
        }, 10)
      }
    }

    document.body.addEventListener('focusin', this.recordScroll)
  	document.body.addEventListener('focusout', this.handleScroll)
  }

  componentWillUnmount() {
    document.body.removeEventListener('focusin', this.recordScroll)
  	document.body.removeEventListener('focusout', this.handleScroll)
  }
  ```

#### [focusin文档](https://developer.mozilla.org/zh-CN/docs/Web/Events/focusin)
#### [focusout文档](https://developer.mozilla.org/zh-CN/docs/Web/Events/focusout)

### 小结

* 有段时间没有开发 H5 内容了，兼容性上还是踩了不少坑，这里取了两个比较有代表性也比较常见的，解决方案可以参考，或者互相探讨是否有更好的解决方案，后续如果有新的问题，也会一一记录。
