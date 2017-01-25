---
title: 回顾JS-第二部分
date: 2017-01-25 14:10:00
tags: JavaScript
categories: JavaScript
---

<hr>

{% asset_img unphoto.jpg review javascript %}

<blockquote>
第二部分。

</blockquote>

<!--more-->

### JS中内置对象

* `String`、 `Number`、 `Boolean`、 `Array`、 `Date`、 `Math`、 `RegExp`、 `Error`、 `Object`、 `Function`、 `Global(window)`
* 注意和基本数据类型的区别。
* 包装类型？：临时封装原始类型数据，并提高对数据操作方法的对象————类型名和原始类型名相同。

### 正则表达式

* 贪婪模式：默认情况下，正则表达式会匹配最大的符合条件的字符串。
* 懒惰模式：仅匹配最小的符合规则的字符串。

  ```javascript
   // 筛选网页中的a元素
   // 贪婪模式 => 懒惰模式 .*?

   // 贪婪模式
   <a\s+(.*)href\s*=\s*[""]([^""]*)[""]

   // 懒惰模式
   <a\s+(.?)href=\s*=\s*[""]([^""]*)[""]
  ```

#### RegExp

* 封装一个正则表达式，提供了利用正则表达式执行验证和查找的功能

  ```javascript
   // 正则不会改变时
   var reg = /正则表达式/ig;

   // 正则可能会改变时
   var reg = new RegExp('', 'ig');
   // 注意转义 '\'和'"'
   new RegExp('^\\s+|\\s+$', 'ig');
   new RegExp('<a\\s+(.*?)href\\s*=\\s*[\'\"][^\'\"]*[\'\"']', 'ig');
  ```

#### RegExp API

* String:
   * `match`: 所有关键内容的个数
   * `search`: 查找有没有,返回布尔值


* RegExp:
   * reg.exec(str):既获得内容，又获得位置
   * reg.text(str):返回布尔值

### Math

#### Math API

* `ceil`、 `floor`、 `round`、 `pow`、 `sqrt`、 `random`

### Date

* 每个时间都有get/set方法，除了setDay.


* 命名:
  * 年月日星期不带s结尾
  * 时分秒毫秒以s结尾


* 取值:
  * 只有月中的日从1开始到31结束
  * 其余都是从0开始，到进制-1结束


* 所有set方法，都会自动调整进制.


* 时间计算：
  * 两日期对象相减：得到毫秒差 -> 进制 -> 小时
  * 单个时间点做加减(人为操作)
    * 取分量
    * 做加减
    * set 回去


* 时间显示:
  * `date.toString()`: 默认以标准时间显示日期
  * `date.toLocaleString()`: 将日期转为操作系统当地时间
  * `date.toLocaleDateString()`: 仅获取Date对象中的日期部分
  * `date.toLocaleTimeString()`: 仅获取 Date对象中的时间部分

### 错误处理

*  错误：程序运行过程中发生的异常状态。
*  错误处理：当程序发生错误时，保证程序不退出的机制。
*  发生错误时，程序会自动抛出一个Error对象:
   * Error对象中封装了错误信息。
   * JS中的6种错误对象:
     1. SyntaxError: 语法错误。
     2. ReferenceError: 引用错误。
     3. TypeError: 类型错误，错误的使用了类型或类型的方法。
     4. RangeError: 范围错误，特指函数的参数范围。
     5. EvalError: 调用eval函数时发生的调用错误。
     6. URLError: URL错误。


```javascript
     try {
     // 正常执行流程(可能出错)
     } catch(err) {
     // 错误发生时执行的代码
     // 1. 记录/显示错误信息
     // 2. 继续向调用者抛出异常
     } [finally {
     // 非必须
     // 无论对错，必须始终执行的代码
     // 一般finally, 释放占用的资源
     }]
```

*  错误处理中的 return:
   * 其他位置的 return 会先确定要返回的值，暂时挂起，再执行finally,finally中的操作不影响其他位置已经确定的 return 值。
   * finally 中有 return, 会替换其他位置的 return.


* 应用场景：
   1. 用户输入数据可能出现的问题。
   2. 使用个别浏览器不兼容的对象。
   3. 向服务器发送/接收消息时。
   4. null/undefined.

#### 抛出自定义错误

* 自己实现的函数，被他人调用时，为了向浏览器提示开发错误，都要主动抛出错误信息。
* `throw new Error('信息内容')`
* 该代码片段后的代码不再执行
* 优先选择`if else`, 因为`try catch`更占资源，创建了新的变量err等等


### Function对象

* 普通对象：封装数据，并提供对数据的操作。
* 函数对象：不封装数据，反而是一个可调用的对象。
* 重载： 多个函数(方法), 拥有相同的函数名，但不同的参数列表。调用时，可根据传入的参数值列表，自动调用匹配的函数。
* 当一件事可能根据参数的不同，执行不同的流程时，使用重载。
* JS使用arguments对象(类数组对象)，模拟重载的效果。
* 函数创建方式：

  ```javascript
   // 1. 声明方式,声明提前，可以写在任意地方
   function getName(name) {
     return name;
   }

   // 2. 直接量方式,必须写在调用地方之前
   var getName = function(name) {
     return name;
   }

   // 3. 构造函数方式(必须使用字符串包裹),执行效率低，因为在运行时动态修改函数体的内容
   var getName = new Function('name', 'return name');
  ```

#### 内存中的函数对象(待理解)

* 声明函数时，创建了两个对象。
  * 函数对象：保存函数的定义本身。
  * 作用域链对象：顺序保存了函数可用的变量范围的地址。
  * 默认情况下：作用域链对象只有一个元素，指向 window.


* 调用函数时，

  1. 在作用域链对象中追加一个新元素。
    * 新元素指向将要创建的函数对象。

  2. 创建本次调用的活动对象。
    * 活动对象：调用临时创建的，仅保存函数的*局部变量*的对象。
    * 调用时，使用便利的优先级遵循先局部，后全局的顺序。
    * 如果活动对象中有，就不用全局。

  3. 调用后，作用域链中指向活动对象的引用，出栈活动对象的引用出栈，活动对象变回垃圾，被回收，局部变量不复存在。

#### 匿名函数

* 一个函数只被调用一次——自调的方式。
* 函数不是自己调用，传递给别人用——回调。

  ```javascript
  // 回调
  arr.sort(function(a, b) {return a-b;})
  // 自调
  (function(a, b){return a-b;})();
  ```

#### 闭包

* 希望共享局部变量，又不希望被随便篡改时，就要构建一个闭包结构。
* 使用外层函数封装受保护的局部变量。
* 在外层函数内定义专门操作局部变量的内层函数**并返回**。
* 在全局调用外层函数，获得内层函数的对象，保存在全局变量中反复使用。


* 特点：
  * 嵌套函数。
  * 内层函数使用了外部函数的局部变量。
  * 内层函数对象被返回到外部，在全局反复调用。


* 作用：保护可共享的局部变量。


* 外层函数调用了几次，就有几个受保护的局部变量。

  ```javascript
    function fun() {
      var n = 999;
      nAdd = function() {n += 1;};
      function f2(){alert(n)};
      return f2;
    }
    var result = fun(); // 创建了一个闭包
    result(); // 999
    nAdd();   // 使局部变量n+1
    result(); // 1000
  ```

### OOP: 面向对象程序设计

* 对象：程序中描述现实中一个物体的属性和功能的机构。
* 一个对象代表现实中的一个物体。
    * 封装事物的属性和功能的结构。

#### 创建对象的几种方式

1. 对象直接量。
```javascript
 var obj = {
   key: value
 }
```

2. 使用构造函数创建多个统一结构的对象,可以反复创建。
```javascript
 // 定义构造函数
 function OperateFun(name, age) {
   this.name = name;
   this.age = age;
   var _this = this;
   this.getName = function (){
     return _this.name;
   }
 }
 // 调用该构造函数
 var obj1 = new OperateFun('Lily', 45);
 console.log(obj1.name);
 console.log(obj1.age);
 console.log(obj1.getName());
```
  * 过程中执行了以下四步：
    1. new 创建空对象空间。
    2. 调用构造函数，在对象中添加属性和功能。
    3. 将新对象的 `__proto__` 属性指向构造函数的 prototype 对象。
    4. 将新对象地址，返回调用者。

3. 创建空对象，再设置属性。
```javascript
 var obj = new Object();
 obj.name = 'Sun';
 obj.age = 17;
```

4. 使用`Object.create()`方法创建对象。
```javascript
 /**
  * [Object.create description]
  * @param  {Object || null} proto  [一个对象，作为新创建对象的原型]
  * @param  {Object} prpertiesObject [可选参数，属性与值]
  * @return {Object}        [description]
  */
 // 一个原型为null的空对象
 var obj1 = Object.create(null);
 // 以字面量方式创建的对象
 var obj2 = Object.create(Object.prototype, {
   // name会是新创建对象的数据属性
   name: {
     writable: true,
     configurable: true,
     value: 'Hency'
    }
  });
```

#### this

* this: 只用于对象中的方法，访问对象自己的属性
* this指代正在调用方法的当前对象
    * this和定义在哪无关。只和调用时的对象有关。

#### 原型

* 面向对象：封装，继承，多态
* **原型**：几种保存所有对象公用属性值的方法的对象。
* 每个函数都有一个属性prototype,指向自己的原型对象。
* 每个对象都有一个__proto__属性，指向创造自己的构造函数的原型(prototype).
* 重点作用于构造函数。
* 封装：将现实中一个事物的属性和功能，集中定义在程序中的一个对象里。
* 多态：一个对象在不同情况下显示不同的状态。JS中对多态支持不好，只讨论重写。

##### 继承

* **继承**：父对象中的属性值或方法，子对象可以直接使用。
  * 设置子对象继承父对象：3种
    1.单独修改一个对象的父对象，不影响其他对象。
      * `Object.setPrototypeOf(childObject, parentObject);`

    2.直接修改构造函数的原型对象。
      * 不影响已创建的对象，会影响之后新创建的对象。

    3.创建新对象同时，手动设置父对象。
      * `Object.create(parentObject, null);`


* 检查两对象之间的继承关系(包含整个原型链上的所有父对象):
    * `parentObject.prototype.isPrototypeOf(childObject);`

##### 原型链

* **原型链**：由每个对象的__proto__构成的多级继承关系。
* 所有**对象**的原型链的顶部都继承自Object.prototype.
   * `Object.prototype.__proto__ === null; // true`
* 所有**函数对象**的原型链一定都继承自Function.prototype.
   * `Function.prototype._proto__ === Object.prototype; // true`

##### 检查某个对象中是否拥有指定的属性或方法

* 检查原型链中是否包含
 1. `属性名 in 对象` => `name in Object`.
 2. 判断存在:
  * `if (Object.name !== undefined || Object.name)`


* 仅检测自有属性:
     * `Object.hasOwnProperty(Object.name);`


* 扩展内置对象的内置方法

  ```javascript
   // 给Array添加类似String的indexOf方法
   // 首先检查原来的原型链中是否有该方法
   function indexOf(value) {
     if (!this.indexOf && !Array.prototype.indexOf) { // 疑问: 为什么这里this.indexOf in Array.prototype 会返回false
       // 使用this来指代当前的调用对象(数组)
       for (var i = 0; i < this.length; i++) {
         if (this[i] === value) {
           return i;
         }
       }
       return -1;
     }
   }

   // 可以简写成以下这样
   Array.prototype.indexOf = Array.prototype.indexOf || indexOf;
  ```

<div class="page-reward"><a href="javascript:;" class="page-reward-btn tooltip-top"><div class="tooltip tooltip-east"><span class="tooltip-item">赏</span><span class="tooltip-content"><span class="tooltip-text"><span class="tooltip-inner"><div class="reward-box"></div></span></span></span></div></a></div>

{% asset_img reward.jpeg Thanks %}
