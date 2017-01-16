---
title: 回顾JS——第一部分
date: 2017-01-15 15:14:56
tags: JavaScript
---

<hr>

{% asset_img unphoto.jpg review javascript %}

<blockquote>
因面试时裸面的惨痛教训，特此回顾从前所学的JS。这个办法也许很蠢，但她肯定有效。

</blockquote>

<!--more-->

## 回顾JavaScript知识点(ES3,ES5为主，部分ES6)

### 什么是JavaScript

* [JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/About_JavaScript): JS是一种轻量的，解释性的，面向对象的头等函数语言。其最广为人知的应用是作为网页的脚本语言，但同时它也在很多非浏览器环境下使用。JS是一种动态的基于原型和多范式的脚本语言，支持面向对象，命令式和函数式的编程风格。

* JavaScript的标准就是ECMAScript.截至2012年为止，所有的主流浏览器都完整的支持ECMAScript 5.1, 旧式的浏览器至少支持ECMAScript 3标准。2015年6月17日，ECMAScript的第六个版本正式发布，该版本正式命名为ECMAScript 2015, 但通常被称为ECMAScript或ES6。

### 网页中编写JS

1. 使用`script`标签
* 可以写在页面的任何位置，随网页解释执行

2. 元素的事件属性
* 事件触发后，才会执行事件处理程序
* `<div onclick="window.alert('Send me a job! Please!')"></div>`

3. 单独的JS文件
* `<script src="index.js"></script>`

### 变量

* 内存中一个数据的空间
* JS中变量不能以数字开头，不能使用保留字，如果有多个单词，一般采用驼峰命名
* 可以使用_或$开头，这是唯二的例外，目前所知。
* 规范：
   * 变量一定要声明，ES5前使用`var`，ES6后使用`let`或`const`.
   * 变量的声明通常在文件顶部(ES5前)，避免因**声明提前**造成的问题。

### [数据类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)

* 原始类型
   * **Undefined**: 一个没有被赋值的变量会有默认值undefined.
   * **Null**: null,常用于清空变量。
   * **String**: JS的字符串类型用于表示文本数据。它是一组16位的无符号“整数值”的元素。一旦创建便无法更改。
   * **Number**: ECMAScript中只有一种数字类型：基于IEEE 754 标准的双精度64位二进制格式的值(-(2^53 - 1) 到 2^53-1)，没有像Java里的那种浮点数整数之分。
   * **Boolean**: 布尔表示一个逻辑实体(true/false).
   * **Symbol** (ES6新增): 符号类型是唯一的并且是不可修改的，而且可以用来作为Object的key的值。
* 引用类型(Object): 对象是指内存中的可以被标识符引用的一块区域。
* **使用`typeof`操作符判断对象类型。**

#### 数据类型转换

* JS是弱类型编程语言
   * 声明变量时，无需提前规定变量的数据类型。
   * 赋值时，根据存入数据，动态决定数据类型
   * 运算时，JS会根据需要动态转换数据类型(隐式转换)

* 隐式转换和强制转换
   * 强制转换
     * `x.toString()`、`String(x)`
     * `parseInt(x)`、`parseFloat(x)`
     * `Boolean(x)`
     * `typeof x` 查看x的数据类型

### [严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)

* ES5中的严格模式是JS中的一种限制性更强的变种方式。
* 严格模式会将JS陷阱直接变成明显的错误。
* 严格模式修正了一些引擎难以优化的错误，同样的代码有些时候严格模式会比非严格模式下更快。
* 严格模式下禁用了一些有可能在未来版本中定义的语法。

### 运算

* `n++`: 将变量本身的值+1，并返回**新值**
* `++n`: 将变量本身的值+1，并返回**旧值**
```javascsript
 var n = 12;
 var n1 = n++; // n1 = 13;
 m = 12;
 m = ++m; // m1 = 12;
```

#### 比较操作符

* 严格比较操作符 `===`
* 非严格比较操作符 `==`
* [Object.is()(ES6新增)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
   * `Object.is(value1, value2)`
   * 和严格比较操作符类似，但更规范

#### 关系运算

* 关系运算中，所有数据默认转为数字类型比较
* 如果无法转为数字，就会转为NaN,如果转为NaN，那不管另一半是什么，都会返回false,NaN和任何数据(包括它自己)比较
* 如果是俩**字符串**比较，则会依次比较字符串中每个字符的unicode码，只要任意一位字符比较出结果就不再继续向后比较
```javascript
 var name1 = 'Eric';
     name2 = 'Scott';
 name1 > name2; // false 'E' -> 69, 'S' -> 83
 var name3 = 'Smith';
 name2 > name3; // false 'c' -> 99, 'm' -> 109
```

* undefined: 自动初始化变量
* null: 主动清空变量
```javascript
 undefined == null; // true 含隐式转换
 undefined === null; // false 不含隐式转换

 typeof null // object
 typeof undefined // undefined
```

#### 逻辑运算

* `&&`
* `||`

#### 位运算

#### 赋值运算

* 如果是原始类型赋值，则原变量不会随着新变量的改变而改变。
* 如果是引用类型的赋值，新变量的改动会随之影响原变量，使其一起改变。因为本质上，它们指向同一对象。

#### **三目运算**
* `condition ? expr1 : expr2`

### 函数

*  在JS中，函数是一等公民，它不仅像对象一样拥有属性和方法，还可以被调用。
*  函数名(name).
*  函数参数列表(params).
*  函数功能(statements).
*  变量作用域
   1. 全局作用域
   * 保存在全局window对象下，任何位置都可以访问
   * 意味着也随时可以修改
   2. 函数作用域
   * 保存在函数内：随每次函数调用时，临时创建。函数调用完即释放内存空间。再次调用再次创建。

*  声明提前：JS程序正式执行前，引擎会预读`var`和`function`到当前作用域的顶部，而赋值留在原地。
*  按值传递：在向函数传入参数时，外部变量仅将值复制一个副本给函数的参数变量。
   * 函数内修改参数变量，不影响函数外原变量(原始类型)的值。理论同赋值运算。

*  全局函数，可以在全局进行调用的函数。
   * `parseInt/parseFloat`
   * `isNaN`
   * `isFinite`
   * `eval`
   * `encodeURI/decodeURI`
   * `encodeURLComponent/decodeURIComponent`

#### 程序结构

*  顺序结构
*  分支结构
   * `if else`
   * `switch case`: 当一个case触发时，之后的所有的case都自动触发。
   * 使用break来退出当前结构。
   * 相邻俩case需要连续时，可省略前一个case中的break。
*  循环结构
   * 循环三要素：循环条件，循环变量，循环体
   * `while`、`do while`、'for'
   ```javascript
   // while
   var n = 0;
   while(n < 3) {
     console.log('n = ' + n);
     n++;
   }
   // n = 0; n = 1; n = 2;

   // do while
   var n = 4;
   do {
     console.log('n = ' + n);
   } while(n < 3);
   // n = 4;

   ```

### 数组

#### 程序 = 数据结构 + 算法

* 数据结构：程序中数据如何存储的机构
* 算法：程序的执行步骤：顺序、分支、循环


#### 数组类型

*  **数组不限制元素个数，数组中的元素可以为任意类型**
*  关联数组(hash数组)
   * 为每个元素自定义*字符串*下标
   ```javascript
   var arrM = [];
   arrM['name'] = 'Sandra';
   arrM['shx'] = 80;
   arrM['yw'] = 65;
   arrM['yy'] = 95;
   ```
   * 关联数组的下标没规律。
   * 关联数组的length属性无效。
   * 使用`for in`循环遍历

*  索引数组：自动从0开始，每个元素有各自编号
```javascript
 var arrM = ['Sandra', 80, 65, 95];
```

#### 数组常用API

* `toString`,`join`,`sort`,'concat','slice',`splice`,`reverse`
* `reduce`,`reduceRight`,`map`,`filter`...
* 控制台里看一下

#### 栈和队列(数据结构)

* 栈和队列：JS中没有专门的栈和队列的类型，是用数组模拟的
* 栈：一端封闭，只能从另一端进出（仅适用于JS）
* FILO：first in last out
* 队列：只能从末尾进入，从头出的数组
* LIFO： last in first out