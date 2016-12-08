---
title: ES6 简单特性尝鲜-1
date: 2016-07-24 17:40:54
tags: ES6
---

<hr>

{% asset_img unphoto.jpeg Hey ES2015 %}

<blockquote>
ES6的出现，无疑是对现有的ES5的一次巨大冲击。某种程度上，部分人觉得这是给开发人员带来的巨大惊喜。它保证现有的基础之外，增加了很多好用的语法糖，使得对后端转入的javascript更为友好。尽管有些人在ES5上还未站稳脚跟——譬如我，但已经迫不及待地想去尝试ES6。

尽管在我的工作曾写过coffeescript,typescipt，但我始终觉得基础的才是实用的。让我们抛开那些多样的Javascript超集不谈，回归到js本身来。

</blockquote>

<!--more-->

__1.Block-Scoped Constructs Let and Const (构造let和const及块作用域)__

*  在我刚开始学习js的时候，我的老师教导在js中声明变量，一定要用var声明。否则这些可能原本应当属于你的孩子，最终都会被window抢走。
*  后来在工作中，更规范的写法是将所有的变量声明在js顶部，以防止声明提前带来的糟糕影响。

*  __而ES6中的let，则让你更容易地避免以上两种易犯的错误。__
*  `let`是一种新的变量声明的方式，它允许你把变量作用域控制在块级里面。

   *你可能不信，让我们先苦后甜——以一个糟糕的例子开头


```javascript
  function checkYourMoney(you) {
    var money = 0;
    if (you) {
      var money = 5;
    }
    {
      var money = 100;	//	混淆你的视线
      {
        var money = 1000;	//	再次混淆
      }
    }
    return money;
  }
	
  console.log(checkYourMoney(true));
```

*  不管你信不信，控制台里输出的都是冷冰冰的1000。尽管现实中你可能希望钱确实能无故多出来，但在代码这儿可不行。

   *反面教材结束，正面登场

```javascript
  function checkYourMoney(you) {
    let money = 0;
    if (you) {
      let money = 5;
    }
    {
      let money = 100;
      {
        let money = 1000;
      }
    }
    return money;
  }
  
  console.log(checkYourMoney(true));
```

*  这回变了，输出为0。
   *let的好处是让你在任何块内定义都不会互相影响，尽管在别的块内你定义了money不同的值，但对于return而言，只获取邻近的变量。

   *相对而言，`const`的使用较少一些。它的作用是声明常量。虽然这么说，不过它的作用更类似于一个指针指向某个引用，这么听起来好像有些git的感觉。尽管它用于定义常量，但这常量并非一成不变。

```javascript
  const GIRL = ['lovely'];	// 定义一只可爱的妹子
  GIRL.push('beautiful');  // 再漂亮点儿
  console.log(GIRL);	//	['lovely', 'beautiful']
  GIRL = 'lovely and beautiful';  // TypeError: Identifier 'GIRL' has already been declared(…)	//	您的妹子已被认领
```

*	`let`和`const`的基本用法就是这样，还有几点需要注意的是
   *	let声明的变量不具备声明提前的属性，意味着可以就近使用。
      * let和const只在最靠近的块(作用域/花括号)中有效。
   *	使用const声明时采用大写方式。
   *	const在声明时必须赋值。
   *	let为编写者带来了很多便利，相应地维护成本也增加了，因为你需要非常了解每个声明的变量所处的块作用域。


__2.Template Literals (模板对象)__

*	我在工作中有写coffeescript，里面的`#{}`用法很方便，让你即使在字符串中也可以很自如地穿插变量，现在，ES6推出了类似的写法。
*	即`${}`——注意这里的分隔符是反引号**`**不是**'**。
*	小试一把

```javascript
  let code = 'cold';
  console.log(`My code is ${code}`);
```
```javascript
  //	在我的日常中更广泛的用法是——譬如angular中
  $http.get(`${config().lala_url}/abc/book?page${page}=&count=${count}`)
  //	do something...
```

**3.Muti-line Strings (多行字符串)**

*	相信不少人在使用jquery的时候都拼接过字符串，而如果一旦内容较多，画面一定很香艳。
*	true story——请感受一下冰山一角

```javascript
let order = '<div class="order">'
 + '<div class="orderTitle">'
   + '<div class="fl">'
     + '<div class="orderNum ml10">'
     + order.number
     + '</div>'
   + '</div>'
 + '</div>'
+ '</div>'
```

*	而有了ES6的反引号**``**，妈妈再也不用担心我的拼接了！

```javascript
let order = `<div class="order">
  <div class="orderTitle">
    <div class="fl">
      <div class="orderNum ml10">
      order.number
      </div>
    </div>
  </div>
 </div>`
```

*	请忽略这是段糟糕代码的事实——看！是不是清爽多了。

<br>

####	*未完待续……*


>	参考：
>	>	1.[前端开发者不得不知的ES6十大特性](https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651551064&idx=1&sn=341d021ae1bd0f3cd28d7868271711af&scene=1&srcid=0724xCQ1rJWgMrU50XdGz0PZ&key=77421cf58af4a653461fba296e96872e2715a294ed34c7fb49ddd6407cf6da67909214d917189477fd576b9232f7700c&ascene=0&uin=MTMxNzIxNjQwMA%3D%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.11.5+build(15F34)&version=11020201&pass_ticket=c7Yh9%2F%2BIn%2FGijh%2B4%2BO4woXjDX0Z7CZPLJ3RU4OSXBwKIZsuXR7JF%2F6eQuiz9CwSj)
>	>	2.[ECMAScript 6 扫盲](https://mp.weixin.qq.com/s?__biz=MzAxODE2MjM1MA==&mid=2651551048&idx=2&sn=5f774837f3d15598bf214093a8260d22&scene=0&key=77421cf58af4a653545020c9c6e435766cc9f001dad993790afb7d37f64f860e986557f6f2e891fd4ffb0bbd17678ae0&ascene=0&uin=MTMxNzIxNjQwMA%3D%3D&devicetype=iMac+MacBookPro12%2C1+OSX+OSX+10.11.5+build(15F34)&version=11020201&pass_ticket=Et6ONVlb%2FAvtJ1F2RhJ0%2B9Fgp347EX4ziPKzR5tTKUrSqpaxXrVZABtlsquUNvfc)

