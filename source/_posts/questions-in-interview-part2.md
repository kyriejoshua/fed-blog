---
title: 面试题整理2
date: 2018-06-11 19:46:55
tags: interview
categories: Interview
---
<hr>

![](/jo.github.io/2018/06/11/questions-in-interview-part2/unphoto.jpg)

这些题目答不上的话，应该感到羞愧啊！

<!-- more -->

## Part 2

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
getName(); // 1
new Foo.getName(); // 2
new Foo().getName(); // 3 
new new Foo().getName() // 3 
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

#### for in 和 for of区别
```javascript
// 两者在循环数组时，前者循环出的是 key, 后者循环出的是 value
// 后者是用来迭代可迭代对象(Array, Map, Set, String, TypedArray, arguments)
// for in 可以迭代出原型上的属性
```

### CSS

#### border-box 和 content-box 区别
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
