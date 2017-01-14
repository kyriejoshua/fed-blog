---
title: 面试题整理
date: 2017-01-05 22:12:58
tags: interview
---

<hr>

{% asset_img unphoto.jpg fuck interview %}

<blockquote>
面试时遇到的一些没答上来的问题，在这里总结反思。其实很多都并不难，回顾基础大多可以答对，但现实就是要我们在任何时候都做好准备。所以，教训如下。

</blockquote>

<!--more-->

### Interview

#### HTML

* 什么是w3c规范：
  * W3C是英文World Wide Web Consortium的缩写，w3c理事会联盟。它是对网络标准制定的一个非赢利组织，例如制定HTML、XHTML、CSS、XML的标准。

#### CSS

* import和link有什么区别:
  1. link属于html标签，而import是css提供的引入文件方式。
  2. 加载顺序有异。link会在页面加载同时加载，而import会在页面全部下载完后再被加载。
  3. 兼容性差异。import是css2.1才提出的，所以那些老的快掉牙的浏览器(ie5+)并不支持。link则没有该问题。
  4. dom控制样式时，只能改变用link引入的css.而import的css是无法用dom控制的。

#### JavaScript

* 创建对象的几种方式:

  ```javascript
  1. 使用构造函数创建:
  var obj = new Object();

  2. 对象直接量:
  var obj = {};

  3. 自定义构造函数创建:
  function Fun(name) {
    this.name = name;
  }
  var obj = new Fun('joshua');

  4. Object.create(parentObj[,{key: {key: value}}]);
  var obj = Object.create({name: 'kyrie'});
  ```

* 以下代码输出什么:

  ```javascript
  for (var i = 0; i <= 3; i++) {
    setTimeout(function(){
      console.log(i);
    }, 0);
  }

  // 输出 4个4;
  /* 理解如下(待完善):
   由于js是单线程的，只有当前一个逻辑运行结束，才会执行下一个逻辑。
   对应到这里，就是for循环先运行完成，再执行setTimeout.
   这样for循环结束，一共有四次循环，产生四个结果。
   而setTimeout打印每次的结果，所以是4个4。
   */
   
  ```

* 以下代码输出什么：

  ```javascript
  function b() {
    console.log(myVar1);
    console.log(myVar2);
  }
  
  function a() {
    var myVar1 = 1;
    var myVar2 = 2;
    b();
  }
  
  var myVar1 = 11;
  a();
  console.log(myVar2);
  
  // 11;
  // myVar2未定义，报错;
  /* 理解：
    注意这里b不是闭包，无法访问到a函数内的变量。
    所以myVar1会从函数作用域内向全局作用域寻找，输出11
    而myVar2在全局下没有定义，就会报错。
   */

  ```

* 控制台内执行以下代码，然后用户在10秒内连续点击页面三次，请问会输出什么:

  ```javascript
  function waitSomeTime() {
    var st = 10000 + new Date().getTime();
    while(new Date() < st){};
    console.log("don't wait, it's ok");
  }

  function clickMe() {
    console.log('why click me');
  }

  document.addEventListener('click', clickMe);
  waitSomeTime();
  console.log('hello');

  // 会依次输出如下
  "don't wait, it's ok";
  'hello';
  'why click me';
  'why click me';
  'why click me';
  /* 理解如下(待完善):
    由于函数体内的逻辑是顺序执行的, while因条件不对不会触发，所以直接跳过，执行下一句。
   */
  // 因为紧张，这题本来对了被面试官又误导错了。输在心理素质上。

  ```

* 将一个二叉树反向打印:

  ```javascript
      a
     / \
    b   c
   / \   \
  d   e   f

  var a = {value: 'a', left: null, right: null};
  var b = {value: 'b', left: null, right: null};
  var c = {value: 'c', left: null, right: null};
  var d = {value: 'd', left: null, right: null};
  var e = {value: 'e', left: null, right: null};
  var f = {value: 'f', left: null, right: null};

  a.left = b;
  a.right = c;
  b.left = d;
  b.right = e;
  c.right = f;

  // 也许有更好解法
  function walkTree(root) {
    if (root.left || root.right) {
      var temp = root.left;
      root.left = root.right;
      root.right = temp;
      walkTree(root.left);
    }
  }

  ```

* 未完待续……