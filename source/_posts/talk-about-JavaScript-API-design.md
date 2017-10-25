---
title: 浅谈JavaScript API设计原则
date: 2016-06-23 19:13:28
tags: JavaScript
categories: JavaScript
---

<hr>

{% asset_img unphoto.jpeg trunks %}

<blockquote>
__近期整理项目，发现有一些api的写的比较好，风格统一，流畅，可以对比学习。下面罗列一些设计api时应当遵循的原则。以web-order仓库为例。__

</blockquote>

<!--more-->

###	1.流畅性

*	简单易懂

```javascript
var a = _.pick(obj, ['name', 'age', 'address']);

_.pick是lodash的方法，从对象obj中取出name和age，address属性。

但是这个操作需要经常调用，完全可以封装起来。

function a(obj){
	return _.pick(obj, ['name','age','address']);
}

这样每次调用a方法即可。明确易用。
```


*	可读性

```javascript
一开始接手这个web-order的时候，我是非常头疼的。到处是函数式编程，一层嵌套一层。这个时候如果没有交接，代码对新接触的人来说是非常痛苦的，所以有必要增强方法的可读性。

下面是整理过后的：

function generateChoosenPeople(people){
	return _.pick(people, ['name','age','address']);
}

获取选中的人————名字即说明了该函数做的事情，可读性较好。

但是，还有一点并不太令人舒服的地方，就是名字取得太长了。容易读懂，但不容易记住，也不方便使用。所以就需要下一点。
```

*	减少记忆成本

```javascript
将名字简化：

function getMan(man){
	return _.pick(man, ['name','age','address']);
}

这样既简明，也方便调用。
```

#### 2.一致性

*	api的一致性
	*	现在的项目中，一个人开发一个项目的情况非常少见，而且即使一个人开发，代码的风格统一也是很有必要。更何况通常是多人开发。目前遇到的最头痛的一个问题，不是不知道一个问题怎么解决。而是要尝试解决的时候要先上手，看懂别人的代码，毕竟总不能说重写就重写。

	* 请看下列方法取名：

	```javascript
		closeTips();
		closePrintModel();
		printChoosenOrder();
		getListByOrderPackage();
		getOrdersLength();
	```

*	对这些方法的第一印象是很长。但仔细看，api命名风格是统一的。各方法做什么事都在名字中已体现。一目了然，清晰明确。大大减少上手时间。

* 规则很简单：
	* 1.一律采用驼峰命名，首字母小写。
	* 2.第一个单词是动词。

#### 3.错误处理

*	预见错误并处理错误
	* 在第一个示例中提到的方法，`getMan`,要求传入的参数是对象，但如果传入的是数组或是字符串呢，这个时候就需要对参数进行检查并抛出错误。

	* 对方法改写如下：

	```javascript
	function getMan(man){
		if (Array.isArray(man) || typeof order !== 'object' ) {
			console.error('param a must be type of string');
			return;
		}
		return _.pick(man,['name','age','address']);
	}

	当传入参数不符合条件的时候，先抛出错误。

	先判断是不是数组，然后再判断是不是对象，否则就抛出错误。
	```
*	另一个常见的是ajax请求的错误处理，最先接触ajax的时候，从没想过请求失败的情况。经同事提醒，才了解到这样对用户很不友好。
* 	上一个最早写的ajax请求,用angularjs的http：

	```javascript
	$http.get('http://123lalala.com/test')
	.then(() => {
		// do something...
	})
	```

*	这种情况只考虑了正常的情况下所做的操作，没有考虑其他情况。
*	其实很简单，只要再加上一段。但是之后对用户就友好许多，增加了错误提示。


	```javascript
	$http.get('http://123lalala.com/test')
	.then(() => {
		// do something
	}, (err) => {
		console.error('请求失败');
		// or
		window.alert('请求失败' + err.msg);
	})
	```

#### 4.后续如果有补充再更新，有疑问或指正请提出。
