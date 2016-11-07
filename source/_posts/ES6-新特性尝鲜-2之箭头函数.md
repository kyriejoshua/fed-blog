---
title: ES6 新特性尝鲜-2之箭头函数
date: 2016-08-31 17:17:11
tags:
---

<hr>

{% asset_img unphoto.jpeg hey %}

<blockquote>
	最近在准备一个新项目，引入了ES6，平时也常写ts，在越来越多的实战中发现箭头函数确实是ES6里最实用的新特性之一。

</blockquote>

<!--more-->

## Arrow Functions 箭头函数

####	首先来看看ES5之前的函数定义的几种方式:

```javascript
1.函数语句定义
function printProps(o) {
  for (var p in o) {
    console.log(p + ':' + o[p] + '\n');
  };
}

2.表达式定义
var f = function fact(x) {
  if (x < 1) {
    return x;
  } else {
    return x * fact(x - 1);
  };
}

也可以定以后立即调用:

var tensquared = (function(x) {return x * x}(10))

```

*	如果代码中的函数较少，也还好接受。但当函数较多时，满屏的function有些让人烦扰。
*	让我们来试试ES6吧。

#### ES6箭头函数

```javascript
ES6允许用箭头来定义函数。
var f = a => a;
```
等同于

```javascript
var f = function(a) {
  return a;
}
```

*	如果没有参数或多个参数，可以直接使用括号。箭头后紧跟函数体。

```javascript
var f = () => b;
即
var f = function() { return b;}

var sum = (a, b) => a + b;
即
var sum = function(a, b) {
  return a + b;
}
```

*	当返回的是对象时，由于花括号会被解析为函数体，所以要加上括号。

```javascript
var getPerson = () => ({id: 'sdfdkjhgdflg', name: 'kyrie'});
```

*	当返回的是多行语句，需要用花括号括起来。

```javascript
var init = (p) => {
  for (var o in p) {
    console.log(o + ' : ' + p[o]);
  }
}
```

*	当然，出于代码整洁和规范的需要。通常会带上花括号。

```javascript
var init = () => {
  return {
    address: '西湖区',
    point: [120.123, 30.321]
  }
}
```

*	使用箭头函数的好处

1.最大的好处就是使得代码更简洁,尤其是涉及回调的函数。

	```javascript
	var timer = setInterval(function() {
	  console.log(new Date());
	}, 1000);
	可简写为
	var timer = setInterval(() => {
	  console.log(new Date());
	});
	同样的还有使用ajax时，如在angular中使用
	$http.get('api.123feng.com/test')
	.then(() => {
		// do something
	}, () => {
		// do something
	});
	是不是简洁清爽了很多。
	
	```
	
2.还有this只指代定义时的对象，而不是当前对象，所以再也不需要用that来替代this。

	```javascript
	我在写angular时便会遇到，所有定义的变量都相当于是属性，需要用this.prop去访问。
	这里使用了ts。
	export class OrderBatchController {
	  public order: any;
	  constructor(){
	    this.order = {};
	  }
	  getOrder() {
	    var that = this;
	    this.$http('api.123feng.com/test')
	    .then(function(res) {
	      // 将获取的值赋值,如果写成this，则该变量变成是window下的变量了。
	      that.order = res.data;
	    })
	  }
	}
	
	用箭头函数则无须这一步
	getOrder() {
	  this.$http('api.123feng.com/test')
	  .then((res) => {
	    // this始终指代当前的controller。
	    this.order = res.data;
	  })
	}
	```

### 注意点

1.函数体内的this指向定义时的对象，不管嵌套多少层函数，都指向定义时的对象。
```javascript
getOrder() {
  this.$http('api.123feng.com/test')
  .then((res) => {
    // this始终指代当前的controller。
    this.order = res.data;
    setInterval(() => {
      this.order = {};  // controller下面的order又变回{}
    }, 1000)
  })
}
```

2.不能用new一个来创建构造函数，否则将会报错。
3.不可以使用arguments对象，会在箭头函数的函数体内不存在。使用rest参数代替（待探究）

### 小结

*  总体来说，个人觉得ES6的箭头函数和coffee中的箭头函数很相似，使用起来也很方便。最需要注意的地方则是这个this不会再三心二意了。
*  后续如果有其他注意点，再补充。

>	参考
	[ES6入门](http://es6.ruanyifeng.com/#README)

