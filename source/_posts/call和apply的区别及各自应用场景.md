---
title: call和apply的区别及各自应用场景
date: 2016-11-04 16:16:10
tags:
---

<hr>

{% asset_img unphoto.jpeg mac %}

<blockquote><br>call和apply是js里非常常见的两个概念。但自己从来没有好好的深入理解这两者，尤其是在何时使用，如何使用才适合这两个问题上，没有进一步的思考。这里写一篇笔记来反思。

</blockquote>

<!--more-->

### call和apply的定义

* 在JavaScript权威指南上是这么定义的：

* call()和apply()可以看做是某个对象的方法，通过调用方法的形式来简洁调用函数。

* call, apply都属于Function.prototype的方法。因此所有函数都有该方法。

* call()和apply()的第一个实参是要调用函数的母对象，是调用上下文，在函数体内通过this来获得对它的引用。要想以对象o的方法来调用函数f(),可以这样使用它们。

  ```javascript
  f.call(o);
  f.apply(o);
  等同于
  o.m = f;
  o.m();
  delete o.m;
  ```

* 代码可以理解，但描述理解起来实在困难。

### 具体说明

*  定义都是用来考试时死记硬背的。所以来看看实例。

*  首先要明确一点：**call()和apply()的作用是一样的，只是调用方式不同。**

*  例如：`foo.call(this, arg1, arg2, arg3) == foo.apply(this, arguments) == this.foo(arg1, arg2, arg3/* arguments */)`

*  两者唯一的不同点在于第二个传入的参数。

*  第一个实参指代当前调用的对象，如果在ES5严格模式下，第一个实参不管传入什么null或undefined或其他，都会变成this。

*  第二个实参，call方法可以传入任意的实参，不论数量长度。如`foo.call(this, arg1, arg2, arg3…)`

*  apply方法则传入的是数组，可以是任意长度的数组，而且传入的数组包括类数组对象。如`foo.apply(this, arguments)`

### 应用场景

*  我觉得这部分才是要深入理解的，何时去调用它们，使用它们有什么方便之处。

*  call和apply的用途是借用别人的方法来调用，或者说，是动态改变this这个对象。

*  前者或许更好理解。来看看这样一个例子。

   ```javascript
            const a = {
              name: 'mdzz',
              say: (name) => {
                console.log(name)
              	window.alert(`我是 ${name}`);
              }
            } 
            const b = {};
            // b也是zz,但没有相应的say方法，所以此时b想借用a的方法。
            // 调用a的方法给b使用
            a.say.call(b);
            b.name = 'yrmdzz';
            // 传入参数时
            a.say.call(b, b.name);
            a.say.apply(b, [b.name]);
   ```

   ```javascript
         /* 或者这样定义更为明显 */
            function Foo(){};
            // 添加原型属性
            Foo.prototype = {
              name: 'mdzz',
              say: function() {
                console.log(this); // 当前调用的对象Foo
                alert(`I am ${this.name}`);
              }
            }

            // new 生成一个实例对象
            const people = new Foo();
            console.info(people);
            people.say();

            // 定义一个没有say方法的对象animal
            // 让它调用people的say方法
            const animal = {
              name: 'kitty'
            }
            people.say.call(animal);

   ```

   ```javascript
          /* 在参数不定时，则可使用apply */
            // 这里的例子改写自权威指南
            // 内置Math对象有一个max方法，接受任意个参数，返回其中的最大值
            // 但有时我们调用时，无法预知参数的个数，而且这种取最大值的情况通常在数组中发生

            // 假如有这样一个数组
            let arr = [4,98,34,90,41,78];

            // 直接Math.max会返回NaN,因为它不接受数组作为参数
            Math.max(arr); // 返回NaN

            // apply方法接受数组作为参数
            let biggest = Math.max.apply(Math, arr);
            console.info(biggest); // 98

            // 第一个参数Math可以替换为任何其他值，如下的也都可以
            let biggest2 = Math.max.apply(this, arr);
            let biggest3 = Math.max.apply(null, arr);
            console.info(biggest2); // 98
            console.info(biggest3); // 98
   ```




*  所以我的理解是以下在两种情况下使用call(), apply():

  1.动态改变调用的对象，或者说使**没有该方法的对象**调用**有该方法的对象**的方法。

  2.改变方法的传入参数为数组。

*  就目前看来，肯定还有更多的使用场景。但我还未遇到，等遇到或理解的更深一步的时候，再来补充。

<blockquote><br/> 参考：

《JavaScript权威指南》

</blockquote>