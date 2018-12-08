---
title: 面试题整理-2018
date: 2018-06-11 19:46:55
tags: interview
categories: Interview
---

![](/jo.github.io/2018/06/11/the-questions-in-interview-part2/unphoto.jpg)

这些题目答不上的话，应该感到羞愧啊！
推荐：★★★

<!-- more -->

## Part 2 2018版

- [JavaScript](#JavaScript)
- [ES6](#ES6)
- [CSS](#CSS)
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

#### var 变量声明

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

### ES6
#### Promise sth
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

#### 浅比较/浅拷贝的实现

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
```

#### jsonp 实现原理及具体实现

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
  script.src = `http://justexample.com?callback=${handleCallback}`
  script.type = 'text/javascript'
  document.body.appendChild(script)
}

handleJsonp()

// 服务端的返回应当是这样，这里是 nodejs 的写法
// `${callback}(${callbackData})`
// handleCallback({ data: 'bad view' })
// 然后客户端执行 handleCallback 函数，打印出结果
```

#### TODO import 和 require 的区别

### CSS

#### `border-box` 和 `content-box` 区别
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

* 浏览器的同源策略规定，**协议相同，域名相同，端口相同。**

### 其他

* 在岛上有100只老虎和1只羊，老虎可以吃草，但他们更愿意吃羊。假设： A：每次只有一只老虎可以吃羊，而且一旦他吃了羊，他自己就变成羊。 B：所有的老虎都是聪明而且完全理性的，他们的第一要务是生存。 问最后这只羊会不会被吃？- 头条的骚题。

* 从一只老虎开始分析，当一只老虎一只羊时，老虎必定吃羊。
* 当两只老虎时，老虎不敢吃羊，因为一旦吃了羊，变成了羊，就会被剩下的老虎吃了。
* 三只老虎时，头一只老虎可以吃了羊，然后问题回到两只老虎的状态，都不敢吃羊。
* 四只老虎时，老虎如果吃羊，就会回到三只老虎的状态，因此任一老虎都不会吃。
* 综上所述，**老虎数量为奇数时，老虎会吃，为偶数时，不会吃。**
