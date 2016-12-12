---
title: 理解JavaScript中的类
date: 2016-12-12 17:01:53
tags: javscript
---

<hr>

{% asset_img unphoto.jpg Class%}

<blockquote><br/>整理了部分类的知识点。类的定义，如何实现一个类，类有哪些特点，等等。

</blockquote>

<!--more-->

### 理解JavaScript中的类

- **类的作用**：让每个对象都共享某些属性。

- **类的实现**：基于JavaScript的原型继承机制。

- **类的特性**：动态可继承(编程哲学——鸭式辩型)。

- **类的核心**：原型对象。所有类的实例都会从同一个原型对象中继承。属性

- **类的定义**：通常使用构造函数:
  - 调用构造函数会自动创建一个新对象，构造函数只需初始化这个新对象的状态，而新对象的原型正是构造函数的prototype
  - 意味着同一个构造函数创建的所有对象都继承自一个相同的对象,因此他们都是同一个类的成员
  - 构造函数可看做是类的'外在表现'

- 为方便标识，字符串相关部分使用了ES6的模板字符串。

- **编程约定**：构造函数(类名)首字母大写:构造函数就是用来构造新对象的，必须通过关键字new调用，开发者可以通过命名约定来判断是否是构造函数。

```javascript
/**
 * [Girl 定义一个拥有几个属性的妹子类]
 * @param {[String]} pretty [可爱属性，以字符串标识]
 * @param {[Number]} sexualLow [性感属性，以数字标识]
 * @param {[Number]} sexualHigh [性感属性，以数字标识]
 */
function Girl(pretty, sexualLow, sexualHigh) {

  // 类型检查
  if (isNaN(sexualHigh) || isNaN(sexualLow)) {
    throw new TypeError();
  }
  this.pretty = pretty;
  this.sexualLow = sexualLow;
  this.sexualHigh = sexualHigh;
}
```

- 在原型对象上定义类方法。

- 该prototype是每个JavaScript函数都自动拥有的,它本身的值就是一个**对象**，这个对象包含一个唯一一个不可枚举的属性constructor。

- constructor的值是一个**函数对象**。

```javascript
/**
 * [foreach 传入方法处理每个属性]
 * @param  {[type]} f [description]
 * @return {[type]}   [description]
 */
Girl.prototype.foreach = function(f) {
  f.call(this, this.pretty, this.sexualLow, this.sexualHigh);
};

/**
 * [include 是否在Girl的性感区间内(判断妹子是否性感)]
 * @param  {[type]} sexual [description]
 * @return {[type]}        [description]
 */
Girl.prototype.include = function(sexual) {
  return sexual > this.sexualLow && sexual < this.sexualHigh;
}

/**
 * [toString 查看这个妹子类的平均水平]
 * @return {[type]} [description]
 */
Girl.prototype.toString = function() {
  console.info(`This girl: ${(this.sexualLow + this.sexualHigh) / 2}${this.pretty}`);
};

// 声明一个妹子类的实例
var lisa = new Girl('B', 32, 36);
lisa.include(34); // 查看该妹子是否在区间内
lisa.foreach(console.warn); // 打印出该妹子实例的各个属性
lisa.toString(); // 查看该妹子平均指标
```

```javascript
var p = Girl.prototype; // 定义一个原型对象
var c = p.constructor;  // 该原型对象的构造函数
c === Girl; // true Girl.prototype.constructor === Girl 原型对象的构造函数指向其本身

// 对实例对象来说，它的构造函数就是它的类
lisa.constructor === Girl; // true
lisa.__proto__ === Girl.prototype; // __proto__指向构造函数的原型对象
lisa instanceof Girl // true 继承自Girl类
```

- **构造函数对象**：用于生成类的函数，为JavaScript的类定义了名字。

- **原型对象**：类的唯一标识————原型对象的属性被所有实例所继承。如果某个属性是函数的话，就会作为类的实例的方法来使用。

- **实例对象**：类的实例，每一个都是独立的对象。在该实例上添加属性是不会影响其他实例的，但在原型对象上添加方法会影响所有实例。

- 定义在实例上的非函数属性，实际上是实例字段。




- 下面定义一个函数，分三步定义一个类。

- 我们将定义类的步骤封装成一个函数。

```javascript
// 需要提前声明一个函数
/**
 * [extend 合并对象属性，复制p中对象属性到o中]
 * @param  {[type]} o [description]
 * @param  {[type]} p [description]
 * @return {[type]}   [description]
 */
function extend(o, p) {
  for (prop in p) {

    // 并不会覆盖对象中原有属性
    if (o[prop] === void 0) {
      o[prop] = p[prop];
    }
  }
  return o;
}

/**
 * [defineClass 定义类的函数]
 * @param  {[type]} constructor [构造函数]
 * @param  {[type]} method      [在原型对象上添加属性，可继承]
 * @param  {[type]} static      [直接在类上添加属性， 不可继承]
 * @return {[type]}             [返回构造函数]
 */
function defineClass(constructor, method, static) {
  if (method) {
    extend(constructor.prototype, method);
  }
  if (static) {
    extend(constructor, static);
  }
  return constructor;
}

// 调用该方法生成另一个类
var Girl2 = defineClass(
  function(pretty, sexualLow, sexualHigh) {
    if (isNaN(sexualLow) || isNaN(sexualHigh)) {
      throw new TypeError();
    }
    this.pretty = pretty;
    this.sexualLow = sexualLow;
    this.sexualHigh = sexualHigh;
  },
  {
    foreach: function(f) {
      f.call(this, this.pretty, this.sexualLow, this.sexualHigh);
    },
    include: function(sexual) {
      return sexual > this.sexualLow && sexual < this.sexualHigh;
    },
    toString: function() {
      console.info(`This girl: ${(this.sexualLow + this.sexualHigh) / 2}${this.pretty}`);
    }
  },
  // 随机生成一个性感的妹子
  {
    random: function() {
      var hour = new Date().getMinutes();
      var type = (hour % 3) === 0 ? 'A': (hour % 3) === 1 ? 'B' : 'C';
      return `${Math.ceil(Math.random() * 10) + 30}${type}`;
    }
  }
)

// 生成一个Girl2的实例
var monika = new Girl2('D', 34, 38);
monika.foreach(console.info); // D 34 38
monika.include(31); // false
monika.include(35); // true
monika.toString(); // [Object Object] 因extend不会覆盖原方法，所以这里仍然是Object.prototype.toString自带方法, 如果要去掉，将extend中的if条件判断去除即可
monika.random(); // 报错 Uncaught TypeError: monika.random is not a function(...) 因为monika实例未继承类自身的方法
Girl2.random(); // 随机生成 例如：'36C'
```



* 毕竟不是灵魂画手，大概便是这样……

{% asset_img understand-prototype.jpeg understanding prototype %}