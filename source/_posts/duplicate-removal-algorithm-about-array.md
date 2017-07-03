---
title: JavaScript数组去重
date: 2016-12-05 09:36:02
tags: JavaScript
categories: JavaScript
---

<hr/>

{% asset_img unphoto.jpg Array Array Array %}

<blockquote>
  整理了部分常用的数组去重方法。

</blockquote>

<!-- more -->

### ES3实现

*  采用和冒泡排序相似的思路，一一对比后将确定不重复的元素放入新数组。

```javascript
function unique(arr) {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    var isUnique = true; // 标识该元素是否唯一
    for (var j = i + 1; j < arr.length - i; j++) {
      if (arr[i] === arr[j]) {
        isUnique = false;
      }
    }
    if (isUnique) {
      res.push(arr[i]);
    }
  }
  return res;
}

var arr = [0, 0, 1, 1, 2, '2'];
unique(arr);
```

### ES5实现

1.方法一：数组的indexOf方法——**Array.prototype.indexO**f

*  如果查找到的当前元素的位置和和实际位置相同，那么向新数组里添加。

```javascript
function unique(arr) {
  let res = [];
  for (var i = 0; i < arr.length; i++) {
    (arr.indexOf(arr[i]) === i) && res.push(arr[i]);
  }
  return res;
}

var arr = [1, 1, 2, 2, 3];
unique(arr); // [1, 2, 3];
```

2.方法二：数组的filter方法——**Array.prototype.filter**

*  使用indexOf方法和ES5提供的数组方法filter, 返回查询到位置相应的元素
```javascript
function unique(arr) {
  return arr.filter(function(value, index, array) {
    return array.indexOf(value) === index;
  })
}

var arr = [0, '0', 0, 1, 1, '1'];
unique(arr); // [0, '0', 1, '1'];
```

*  filter方法接受一个函数，里面是判断条件，符合条件为true的数组元素组成一个数组，最终的返回这个数组。

```javascript
/**
 * [unique 数组去重，使用ES5的filter方法]
 * @param  {[obj]} value [数组元素]
 * @param  {[number]} index [索引值]
 * @param  {[array]} arr [原始数组]
 * @return {[type]}     [description]
 */
function filter(value, index, arr) {
  return arr.indexOf(value) === index;
}

// 所以以上的去重函数可简化为：
function unique(arr) {
  return arr.filter(filter);
}
```

3.方法三：采用属性哈希值的方法.如果当前元素在对象中没有对应的属性存在，则设置该属性值为true.

*  该方法可以用于去重由纯数字类型的元素组成的数组。

```javascript
function unique(arr) {
  var obj = {};
  return arr.filter(function(value) {
    return obj.hasOwnProperty(value) ? false : (obj[value] = true);
  });
}

var arr = [1, 1, 2, 2, 3];
unique(arr); // [1, 2, 3];
```

* 但是该方法无法判断含字符串类型的元素的内容, 因为对象的属性默认会保存为字符串类型。(该方法可能有限制，暂未发现)

```javascript
var arr = [1, 1, '1', 2, '2', 3];
unique(arr); // [1, 2, 3]; 无法区分数字类型和字符串类型

// 加上类型保存
function unique(arr) {
  var obj = {};
  return arr.filter(function(value) {
    return obj.hasOwnProperty(typeof(value) + value) ? false : (obj[typeof(value) + value] = true);
  });
}
unique(arr); // [1, '1', 2, '2', 3];
```

### ES6实现

1.方法一：**Array.from与Set**

* 首先使用Set定义一个没有重复值的可遍历对象。再使用ES6提供的数组方法from()将其转化为数组，或者使用扩展运算符`...`将其转化为数组。

```javascript
function unique(arr) {
  return Array.from(new Set(arr));
}

const arr = [1, "1", 1, 2, 2];
unique(arr); // [1, '1', 2]; 不会进行类型转换
```

* 这里使用了ES6提供的两种新的数据结构(Set和Map)之**Set**.

  * 它类似于数组，但每个属性(值)都是唯一的。可使用构造函数Set生成。
  * Set有内置属性size，可以查看数组的长度。

  ```javascript
  // 数组作为参数传入
  const set = new Set([1, 2, 3, 4, 5, 5]);
  set.size; // 5

  // 类数组对象传入
  function getDivs() {
    return [...document.querySelectorAll('div')];
  }
  const set2= new Set(getDivs());
  set2.size; // 192
  ```

  ​

* ES6中，数组扩展了很多方法。这里用到了Array.from方法。它用于将两类对象转为真正的数组:

  * 1.类似数组的对象(array-like-object)
  * 2.可遍历(iterable)的对象,包括ES6新增的数据结构Set和Map

* 以上的Set则属于第二种，可遍历的对象。

2.方法二：扩展运算符(**…**)与**Set**

* 首先使用Set定义一个没有重复值的可遍历对象。再使用ES6新增的扩展运算符`...`将其转化为参数序列并作为数组的内容。

```javascript
function unique(arr) {
  return [...new Set(arr)];
}

const arr = [0, '0', 1, 1, 2, 2];
unique(arr); // [0, '0', 1, 2]
```

* 扩展运算符 `...`用于实现将一个数组转化为逗号分隔的参数序列。

### 持续更新……
