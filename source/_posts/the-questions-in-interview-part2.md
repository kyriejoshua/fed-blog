---
title: 面试题整理-2018
date: 2018-06-11 19:46:55
tags: interview
categories: Interview
---

![](/2018/06/11/the-questions-in-interview-part2/unphoto.jpg)

P6 的标准。这里所有的题都应该十分熟悉。
推荐：★★★☆

<!-- more -->

## Part 2 2018版

- [JavaScript](#JavaScript)
  - [类型判断](#类型判断)
  - [函数防抖和函数节流](#函数防抖和函数节流)
  - [浅比较和浅拷贝的实现](#浅比较和浅拷贝的实现)
  - [函数柯里化](#函数柯里化)
- [ES6](#ES6)
  - [Promise](#Promise)
- [React](#React)
- [CSS](#CSS)
  -  [BFC](#BFC)
  -  [行内元素](#行内元素)
- [浏览器](#浏览器)
  - [同源策略](#同源策略)
  - [跨域方案](#跨域方案)
- [前端安全](#前端安全)
- [其他](#其他)

### JavaScript

#### 酷家乐面试题
```javascript
// 引用类型(引用值传递和堆栈模型，这是最主要的)
var a = {
  b: 1
}
function changeA(obj) {
  obj.b = 2
  return obj
}
let aa = changeA(a)
console.info(a.b) // 2
console.info(aa.b) // 2
aa = {
  b: 3
}
console.info(a.b) // 2
console.info(aa.b) // 3

// 事件模型
var len = 6
for (var i = 0; i < len; i++) {
  setTimeout(function() {
    console.info(i) // 6 个 6，异步执行宏任务
  }, 1000)
}
console.info(i) // 6 异步执行，所以这里优先打印

// 考察类型判断和声明提前
function temp() {
  console.info(typeof bbb) // undefined
  console.info(typeof f) // function 声明提前
  bbb = 1
  function f() {}
}
console.info(typeof temp()) // undefined 没有 return 返回值

// 匿名函数 this 指向 window
var obj = {
  getBar: function() { return this.bar },
  bar: 1
};
(function() {
  return typeof arguments[0]() // undefined 相当于 typeof window.bar
})(obj.getBar)

// 不用循环实现一个工具函数 f(n, v), 生成 n 个 v 的数组。递归
function f(n, v) {
  return n < 1 ? [] : [v].concat(f(n - 1, v))
}
f(10, 1)
```

#### var 变量声明及原型

```javascript
function Foo() {
  getName = function() { console.log(1) }
  return this
}
Foo.getName = function() {
  console.log(2)
}
Foo.prototype.getName = function() {
  console.log(3)
}
var getName = function() {
  console.log(4)
}
function getName() {
  console.log(5)
}
// 请写出以下输出结果
Foo.getName(); // 2
getName(); // 4 函数直接量的定义会声明提前从而被 var 声明的所取代
Foo().getName(); // 1 window.Foo().getName() this 指向 window
getName(); // 1 由于调用了 Foo().getName()，而该方法内没用 var/let 声明的变量，都是 window 的，因此 window 上的 getName 被改写
new Foo.getName(); // 2 函数的属性方法调用
new Foo().getName(); // 3 函数的原型链上的方法随着继承而调用
new new Foo().getName() // 3 函数的原型连上的方法随着继承而调用

// 原型
var obj = {}
obj.__proto__ // Object.prototype
Object.__proto__ // function() {}
Object.prototype.__proto__ // null
Function.__proto__ // function() {}
Function.prototype.__proto__ // Object.prototype
```

#### 类型判断

* [**typeof**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof)
* [**instanceof**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof)： 测试构造函数的 prototype 是否出现在对象的原型链之中。由于 prototype 是可更改的，所以同样的表达式不一定会返回一样的结果。
  * `object instanceof constructor`

```javascript
typeof [] === typeof {} // 'object'
typeof Object === typeof Array // 'function' 构造函数
typeof null // 'object'
typeof undefined // 'undefined'
typeof NaN // 'number'

111 instanceof Number // false
'111' instanceof String // false
// 因为它们都不是用构造函数实例化的对象，所以不是
// 下面则是
var num = new Number(111)
num instanceof Number // true
var str = new String('curry')
str instanceof String // true
{} instanceof Object // 报错
[] instanceof Array // true
[] instanceof Object // true

// 通常的判断
Object.prototype.toString.call(obj)
```

#### 函数防抖和函数节流

* 函数防抖：频繁调用的事件，在事件触发超出时间间隔时才执行，当一次事件执行时，后一次要等时间间隔过去才能再次执行
  * 应用场景：输入框校验，输入完成后进行。

<span></span>

* 函数节流：指定时间间隔内只触发一次，在间隔内触发多次，则只有一次生效
  * 应用场景：
    * scroll 到底部的判断，debounce 的话只有停止滚动才判断。所以是 throttle.
    * 拖拽，缩放事件等。`resize`, `scroll`，`mousemove` 事件等。
    * 输入框搜索联想 `keyup` 时间等。


* [**在线 Demo-直观清晰**](http://demo.nimius.net/debounce_throttle/)

```javascript
/**
 * [debounce 函数防抖]
 * @param  {Function} fn    [执行函数]
 * @param  {Number}   delay [延时时间]
 * @return {Function}       [返回函数]
 */
let debounce = (fn, delay = 100) => {
  let timer = null
  // 使用非箭头函数，这样可以获取 arguments 对象
  return function () {
    // 清除上次定时器, 定时器可以用变量保存
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      // 这里类数组对象可以作为参数传入
      fn.apply(this, arguments)
    }, delay)
  }
}

/**
 * [throttle 函数节流]
 * @param  {Function} fn    [执行函数]
 * @param  {Number}   delay [延时时间]
 * @return {Function}       [返回函数]
 */
let throttle = (fn, delay = 100) => {
  let isRunning = false
  // 使用非箭头函数，这样可以获取 arguments 对象
  return function () {
    if (isRunning) { return }
    isRunning = true
    setTimeout(() => {
      fn.apply(this, arguments)
      isRunning = false
    }, delay)
  }
}
// 举例
let throttleEvent = throttle(() => {
  console.info(new Date().getTime())
}, 1000)
let debounceEvent = debounce(() => {
  console.info(new Date().getTime())
}, 1000)

window.addEventListener('scroll', debounceEvent) // 不恰当，只为看效果
window.onresize = throttleEvent
```

#### 函数柯里化

* 蚂蚁的题。

```javascript
function sum(a, b, c) {
  return a + b + c
}

var currySum = curry(sum)
// currySum(1)(2)(3) = sum(1, 2, 3) // 实现这样的效果

// 兼容参数个数的实现
function curry(fn, args) {
  let arr = args || [] // 入参，在第二次调用时会有初始值
  let len = fn.length // 函数参数的数量
  return function () {
    res = arr.concat(Array.prototype.slice.call(arguments)) // 传入的参数与原来的参数整合
    // 参数长度不足时，仍然传入原函数
    if (res.length < len) {
      // 调用柯里化函数，并传入原函数和参数
      return curry(fn, res) // 等同于 curry.call(null, fn, res)
    // 参数长度足够时，输出结果
    } else {
      return fn(...res) // 等同于 fn.apply(null, res)
    }
  }
}
currySum(1)(2)(3) === sum(1, 2, 3) // 6

// 30 秒代码上的实现，更加简约
// 该地址已失效：https://30secondsofcode.org/function#curry
// https://www.30secondsofcode.org/js/s/curry/
// args 这里不是很理解
const curry = (fn, len = fn.length, ...args) => {
  return len <= args.length ? fn(...args) : curry.bind(null, fn, len, ...args)
}
```

### ES6

#### Promise
```Javascript
  const wait = ms => new Promise((resolve) => setTimeout(resolve, ms))

  wait().then(() => console.info(4))
  Promise.resolve().then(() => console.info(2)).then(() => console.info(3))
  console.info(1)
  // 1 2 3 4
  // 传递到then中的函数被置入了一个微任务队列，而不是立即执行，这意味着它是在JavaScript事件队列的所有运行时结束了，事件队列被清空之后才开始执行.
  // 微任务(promise)优先于宏任务(setTimeout)执行。
```

#### Promise 串行的实现

* reduce 方法的思路
```javascript
let a = (v = 0) => {
  return Promise.resolve(v + 1)
}
let b = (v = 0) => {
  return Promise.resolve(v + 3)
}
let c = (v = 0) => {
  return Promise.resolve(v + 5)
}

let arr = [a, b, c]
function handlePromiseList(arr) {
  return arr.reduce((promise, fn, index) => {
    console.info(`当前是 ${index}`)
    return promise.then((res) => {
      return fn(res)
    })
  // 需要传入初始值供链式调用
  }, Promise.resolve())
}
handlePromiseList(arr)
```

* TODO: 循环的思路

#### [`for in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 和 [`for of`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of) 区别

* 两者在循环数组时，前者循环出的是 key, 后者循环出的是 value
* 后者是用来迭代可迭代对象(`Array`, `Map`, `Set`, `String`, `TypedArray`, `arguments`)，但不包括**对象 `Object`**
* `for in` 可以迭代出原型上的属性

#### [`for in`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 和 [`Object.keys`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) 的区别

* `Object.keys` 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和使用 `for in` 循环遍历该对象时返回的顺序一致。
* 它们的区别在于 `Object.keys` 只循环对象的可枚举属性。
* `for in` 则循环对象的可枚举属性和对象的原型链上的可枚举属性。

#### 浅比较和浅拷贝的实现

``` javascript
// 这里的 shallowEqual 就是浅比较，这个方法经过小部分的扩展，也可以实现 Object.assign 方法，后续补充上
// 内部实现其实主要依赖于 es6 的一个方法 Object.is
// 它类似于 === 的功能，但补充了 === 在比较时的不足，
// 例如 +0 === -0 和 NaN === NaN 这两种特殊情况

// 这里做一个模拟 Object.is 的实现
/**
 * [is 其实就是 Object.is]
 * @param  {Any}  a [description]
 * @param  {Any}  b [description]
 * @return {Boolean}   [description]
 */
function is(a, b) {
  if (a === b) {
    // 处理 +0 === -0 返回为 true
    return a !== 0 || b !== 0 || 1 / a === 1 / b
  } else {
    // 处理 NaN === NaN 为 false 的情况
    return a !== a && b !== b
  }
}

/**
 * [shallowEqual 浅比较]
 * @param  {Any} obj1 [description]
 * @param  {Any} obj2 [description]
 * @return {Boolean}      [description]
 */
function shallowEqual(obj1, obj2) {
  // 对基本数据类型的比较
  if (is(obj1, obj2)) return true

  // 这里是对上述遗漏的基本类型的对比的补充，但暂时没想到在哪些情况下会进入到此逻辑中
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null ) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  // 如果长度不等，直接返回不等
  if (keys1.length !== keys2.length) return false

  // 相等时，再做遍历的比较
  for (let i = 0; i < keys1.length; i++) {
    let key = keys1[i]
    // 使用 hasOwnProperty 来判断在 obj2 中是否有 obj1 的方法
    if (!Object.hasOwnProperty.call(obj2, key) || !is(obj1[key], obj2[key])) {
      return false
    }
  }

  // 到此结束，也就是说，无法在对象的属性里再比较对象类型的数据
  // 如果要深比较，则涉及到递归遍历，下次再拓展
  return true
}
```

#### TODO 深拷贝的实现

#### 实现 [`Array.prototype.map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 方法

* 链接中的方法更完善，此为简易版。

```javascript
Array.prototype.map = function (callback) {
  if (!Array.isArray(this)) { throw new TypeError('Param must be Array') }
  if (typeof callback !== 'function') { throw new TypeError('callback is not a function')}
  let res = []
  let len = this.length
  for (let i = 0; i <= len - 1; i++) {
    res[i] = callback(this[i], i, this)
  }
  return res
}
```

```javascript
const a =  [1, 2, 3, 4, 5]
a.multiply() // [1, 4, 9, 16, 25]

function multiply() {
  if (!Array.isArray(this)) { throw new Error() }
  return this.map((item) => {
    return item * item
  })
}
Object.assign(a.__proto__, { multiply })
```

#### jsonp实现原理及具体实现

* 蚂蚁面试时被问到了 jsonp 的实现原理，虽然答出了原理，但具体的实现逻辑有所遗忘，这里做一个简易版但是是完整的实现。
* 利用 script 标签可以跨域请求资源的原理。

```javascript
/*
 * 回调函数，服务端响应数据后执行
 */
function handleCallback(res) {
  console.info(res.data)
}

function handleJsonp() {
  let script = document.createElement('script')
  script.src = `http://justexample.com?callback=handleCallback`
  script.type = 'text/javascript'
  document.body.appendChild(script)
}

handleJsonp()

// 服务端的返回应当是这样，这里是 nodejs 的写法
// `${callback}(${callbackData})`
// handleCallback({ data: 'bad view' })
// 然后客户端执行 handleCallback 函数，打印出结果
```

#### **import** 和 **require** 的区别

* **规范:**
  * ***import:*** ES6 的语法规范——模块化方案。仅在现代浏览器上支持，在其他浏览器上需转成 ES5 运行，也就是说其实仍然是转成 require 的方式运行。
  * ***require:*** nodejs 提供的社区方案，遵循 CommonJS/AMD 规范。

<span></span>

* **调用时间：**
  * ***import:*** 编译时执行。因此必须放在文件开头。
  * ***require:*** 运行时加载。当**首次**调用时，会执行请求的文件的脚本代码，执行后生成一个对象在内存中。之后再引用时，并不会重新执行代码，而是从缓存中读取对象。
    * 循环取值的情况。
    * [官方文档](https://nodejs.org/api/modules.html#modules_cycles)
    * [阮一峰解读](http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html)

<span></span>

* **本质：**
  * ***import:*** 值引用，所取的值仅仅是可读的。见下文。数据无法重新赋值，基础数据类型无法更改，对象类型无法赋值，但可以定义属性。[在React中查看](https://github.com/kyriejoshua/react-tutorial/blob/ba578f52ebc38fd719b008cfc3762b577f0c44f6/react-deep/scripts/_pureComponent.js#L9)
  * ***require:*** 值拷贝，浅拷贝。基础类型相当于直接赋值。对象类型，相当于获取了值，并浅拷贝给当前的值。
  ```javascript
  // a.js
  module.exports = 0
  // b.js
  export const b = 0
  // main.js
  let a = require('a.js')
  import b from 'b.js'
  ++a // 1
  ++b // 报错，因为这个值是 read-only 的
  ```

* **写法：**
```javascript
// import 的方式较多
import React from 'react'
import * as React from 'react'
import { default as React } from 'react'
import React, { Component } from 'react'
import { Component } from 'react'
import { PureComponent as PC } from 'react'
// export
export default fs
export const fs
export * from 'fs'
export { readFile, writeFile }
export function readFile
// require 方式很少
const fs = require('fs')
module.exports = () => { console.info('A') }
exports.fs = {}
```

#### window.open 的使用 - by 丁香园

* [**window.open**](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/open)
* 该方法接受三个参数：
  * strUrl: url 地址。设置的值没有 http 时，打开的新窗口是当前 url 的相对地址。
  * strWindowName: 窗口名称，不是窗口标题，并不会显示。如果已存在同名的 strWindowName 的窗口，就不再打开新窗口，而是在那个窗口中加载。除非将它设置为 '_blank'.
  * strWindowFeature: 窗口的属性，字符串形式，以逗号分隔。
  * `window.open('http://www.google.com', 'newWindow', 'resizable,scrollbars')`

#### this 指向 window - by 丁香园

```javascript
const obj = {
  name: 'james',
  show: function(name) {
    console.info(name)
  }
}
obj.show(this.name) // 空，因为当前的 this 指向 window

// TODO 不知道这题的意义
const result = (function (){
  return '1';
}, function() {
  console.info(2)
  return 2;
})()
typeof result // "number" result 是 2

document.body.addEventListener('click', function(e) {
  console.info(e.target, this) // this 指向 body, 绑定对象时指定了 this
}, false)

document.body.addEventListener('click', (e) => {
  console.info(e.target, this) // this 指向 window
}, false)
```

### React

#### componentWillMount

* TODO: 为什么不推荐该生命周期，以及为什么不推荐在这里使用 ajax.
* `componentWillMount` 内的报错会阻塞后续生命周期的执行，即 DOM 的挂载等等。
* 如果异步请求后续有涉及 DOM 的操作，可能会因为 DOM 还未生成而找不到 DOM 而报错。
* 存疑：v16+ 的版本里，在 fiber 的机制下，开启 async rendering, render 之前的生命周期函数可能会执行多次，导致发送多次 ajax。
* 服务端渲染 SSR，`componentWillMount` 也会触发？

### CSS

#### [BFC](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)

* 块级格式化上下文: 布局过程中生成的块级盒子区域。规定了内部块级元素的布局规则，默认情况下只有 body 一个 BFC 块级上下文.
* 规则：
  * 盒子块会在垂直方向上放置。
  * 相邻的盒子块在垂直方向上的 margin 会合并。
  * 每个元素的 margin box 左边，与包含 border box 的左边相接触（对于从左往右的格式化，否则相反）。即使存在浮动也是如此。（这部分不太理解）[Demo](https://codepen.io/kyriejoshua/pen/ZVBrgN)
  * BFC 区域不会与 float box 重叠。[Demo](https://codepen.io/kyriejoshua/pen/MZbryb)
  * BFC 是页面上隔离的独立的容器，容器内部的子元素不会受外部影响，也不会影响外部元素。
  * 计算 BFC 的高度时，浮动元素也参与计算。

<span></span>

* 触发条件：
  * 根元素或包含根元素的元素。
  * 行内块元素：`display` 为 `inline-block`.
  * 浮动元素：`float` 有值(不为 none).
  * `overflow` 不为 `visible` 的块元素.
  * 绝对定位元素：`position` 为 `fixed` 或 `absolute`.
  * 弹性元素：`display` 为 `flex` 或 `inline-flex` 元素的直接子元素。
  * 网格元素：`display` 为 `grid` 或 `inline-grid` 元素的直接子元素。
  * 等等。

<span></span>

* 实际应用：很多 CSS 的布局方案都是通过创建 BFC 来解决的。
  * 不使用 BFC 实现文字环绕效果。使用 BFC 实现排列效果。[**在线 Demo**](https://codepen.io/kyriejoshua/pen/MZbryb)
  * 例如解决 margin 合并的问题，方案就是创建两个 BFC。使元素处在不同的 BFC 中。[**在线 Demo**](https://codepen.io/kyriejoshua/pen/BvQZqb)
  * 例如清除浮动，父元素添加了 `overflow: hidden` 属性后，生成了一个 BFC，而 BFC 的高度计算是包括浮动元素在内的，因此计算后的父元素高度包括了浮动元素，当前的原本脱离了文档流的浮动元素又被包括在父级 BFC 内。[**在线 Demo**](https://codepen.io/kyriejoshua/pen/roWzqd)
    * `display: inline-block;float: left;position: absolute;` 等等能创建 BFC 的方式都可以清除浮动，但还是要看具体的应用场景。

#### `border-box` 和 `content-box` 区别

* [**box-sizing**](https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing)
```css
.parent {
  box-sizing: border-box;
  width: 200px;
  height: 200px;
  margin: 20px;
  padding: 10px;
  border: 10px solid pink;
  background: red;
}
.child {
  width: 100%;
  height: 100%;
  background: yellow;
}
/* 说明各区域颜色及 child 宽高. */
/*
 * border-box 是 width 包括 border, padding，但不包括 margin
 */
```

#### 用 css 实现子元素宽度为父元素宽度一半的正方形 - by 头条

* [在线 Demo](https://codepen.io/kyriejoshua/pen/xQaOVq)

```css
// 父元素大小未知，这里假定
.parent {
  width: 720px;
  height: 420px;
  background: red;
}
// 使用 padding 将其撑开
.son {
  width: 50%;
  padding-top: 25%;
  padding-bottom: 25%;
  background: lightgreen;
}
```

#### 行内元素

* 行内元素例如 `<span>` 是可以设置宽高的，但是设置无效，**除非将 `display` 的值修改为 `inline-block` 或 `block`。**
* [在线 demo](https://codepen.io/kyriejoshua/pen/pQMXMb)

### 浏览器

#### [同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)

* 浏览器的同源策略规定，**协议相同，域名相同，端口相同(该条 IE 除外)。**
* 影响：
  * [`Cookie`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies), `LocalStorage`, `IndexDB` 无法读取。
  * 无法使用 AJAX.
  * 无法获取 DOM.

<span></span>

* 但是有几个标签的请求是绕过同源策略的。
  * `<img src='' />`
  * `<link href='' />`
  * `<script src='' />`

#### 跨域方案

* [**JSONP**](#jsonp实现原理及具体实现)
* [**CORS**](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)：比较常规的解决方案。
  * `access-control-allow-origin` 这个参数添加域名或设置为 `*`.
  * 简单请求浏览器直接发送。
  * 非简单请求，浏览器自动先发送预检请求 `options`, 然后再发送非简单请求。

<span></span>

* [**window.postMessage**](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage)：个人理解比较适用于 iframe 间的通信。
  * `window.postMessage(message, targetOrigin, [transfer])` 接收三个参数。
  * `message`: 消息内容，会被自动序列化，无需手动序列化。
  * `targetOrigin`: 要发送的域名。
  * `transfer`: TODO
  * 手动接收事件
  * `window.addEventListener('message', receiveMessage, false)`
  * `message`: 包括 `data`, `origin`, `source`
    * `data`: 传过来的数据对象。
    * `origin`: 发送方的源地址。
    * `source`: 发送方窗口的引用。
  * `receiveMessage`: 回调函数。

<span></span>

* node 中间件代理
  * 思路是 node 服务端获取到客户端请求，再从 node 服务器发出，请求后数据再返回给客户端。
  * 这样从服务端发起请求，没有同源策略影响。

<span></span>

* TODO: nginx 反向代理
  * 类似 node 中间件代理，搭建一层服务器作为中转。
  * ssh 登录上服务器，修改 nginx 的配置文件。然后重启 nginx. `nginx -s reload`
  * 在 `nginx.conf` 文件里修改
  ```shell
  server {
    listen  80;
    server_name www.domain1.com;
    location / {
      proxy_pass www.domain2.com:8080; #反向代理
      index index.html;
    }
  }
  ```

<span></span>

* TODO: websocket

### 前端安全

* TODO：https://github.com/riotkkwok/blog/issues/8,https://zhuanlan.zhihu.com/p/31553667
https://tech.meituan.com/fe_security.html
* **XSS**:
* **CSRF**

### 其他

* 在岛上有100只老虎和1只羊，老虎可以吃草，但他们更愿意吃羊。假设： A：每次只有一只老虎可以吃羊，而且一旦他吃了羊，他自己就变成羊。 B：所有的老虎都是聪明而且完全理性的，他们的第一要务是生存。 问最后这只羊会不会被吃？- 头条的骚题。

* 从一只老虎开始分析，当一只老虎一只羊时，老虎必定吃羊。
* 当两只老虎时，老虎不敢吃羊，因为一旦吃了羊，变成了羊，就会被剩下的老虎吃了。
* 三只老虎时，头一只老虎可以吃了羊，然后问题回到两只老虎的状态，都不敢吃羊。
* 四只老虎时，老虎如果吃羊，就会回到三只老虎的状态，因此任一老虎都不会吃。
* 综上所述，**老虎数量为奇数时，老虎会吃，为偶数时，不会吃。**

#### 单双向数据流的理解

* TODO
* **单向数据流：** 简单的理解，可认为水（数据）往低处流。高处是用户，低处是视图。用户的交互行为使得动作发生变更，派发后触发回调函数，进而引起视图的监听事件的调用，最终导致视图的更新。换句话说，视图的变更不会引起数据的变化，否则这就是双向数据绑定了。当然，目前谈论到的数据变化，是以 UI 控件为前提。
* user interaction => dispatch(action) => callback => store(update) => change events => view(react component)

* **双向数据流：**
