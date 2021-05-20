---
title: 可以了解一下 Map、 WeakMap、 Set 和 WeakSet 的
date: 2021-05-10 22:51:46
tags: ES2015
categories: JavaScript
---

![](/2021/05/10/the-map-the-weakmap-the-set-and-the-weakset/unphoto.jpg)
本文的初衷是自己对这 Map 和 Set 两个数据类型及相关类型学习的沉淀与总结。希望也可以对其他人起到一个入门的学习效果。
推荐：★★★☆

<!--more-->

## 索引

* [Map](#Map)
* [WeakMap](#WeakMap)
* [Set](#Set)
* [WeakSet](#WeakSet)
* [参考](#参考)

## [Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)

### 定义

* 新的集合类型，真正实现了键值对形式的存储机制。

### 基本 API

#### 初始化

* 与 Object 可以使用对象字面量的形式来创建不同，Map 使用构造函数来创建。

* 传入的参数必须是可迭代对象。

  ```javascript
  // 不带参数
  const m1 = new Map();

  // 可迭代参数
  const m2 = new Map([
    ['key1', 'value1'],
    ['key2', 'value2'],
  ]);

  // 自定义可迭代参数
  const m3 = new Map({
    [Symbol.iterator]: function *(){
      yield ['key1', 'value1'];
      yield ['key2', 'value2'];
      yield ['key3', 'value3'];
    }
  });
  ```

* m2 和 m3 的键值对是相等的，但他们本身不相等。

* 通过 `size` 属性来查看键值对的长度。

  ```javascript
  m1.size; // 0
  m2.size; // 2
  m3.size; // 3
  ```

#### set

* Map 初始化之后如果想要添加值，可以使用 `set` 方法。它按顺序接收**键**和**值**作为参数。

* 其中键和值的数据类型都不受限定，这点与 `Object` 不同，它可以设置任意的数据类型。

* 而且调用之后，返回的是当前对象，也就是说，它支持**链式调用**。

  ```javascript
  m1.set('myKey1', 'myValue2');

  const symbolKey = Symbol();
  const functionKey = function(){};
  const booleanKey = false;
  const objectKey = {};

  m1.set(symbolKey, 'symbol');
  m1.set(functionKey, 'function');

  // 链式调用
  m1.set(booleanKey, true).set(objectKey, "{}");
  m1.size; // 5
  ```

#### get

* Map 的取值也有特定的方法，不能像对象那样直接通过访问形式来取得。

  ```javascript
  m1.get(symbolKey);
  m1.get(functionKey);

  // 改变键或值的属性，不影响键的取值
  objectKey.key = 'key';
  m1.get(objectKey); // "{}"
  ```

#### has

* Map 也有自己的方法来判断是否存在某个键，类似 `Object.prototype.hasOwnProperty` 那样。

  ```javascript
  // 显然没有的
  m1.has(123); // false

  m1.has(symbolKey); // true
  m1.has(objectKey); // true

  // 并不指向同一个引用
  m1.has(Symbol()); // false
  m1.has({}); // false
  ```

#### delete

* Map 通过 `delete` 方法来删除属性，并返回布尔值来表示该键是否存在于当前键值对当中，换句话说，也可用来检测键是否存在，类似 `has`.

  ```javascript
  m1.delete(functionKey); // true
  m1.delete(456); // false
  m1.size; // 4
  ```

#### clear

* Map 通过 `clear` 方法来清空所有键值对。

  ```javascript
  m1.clear();
  m1.size; // 0
  ```

### 顺序与迭代

* Map 是可迭代的,而且会记住插入键值对的顺序。

#### entries

* 按顺序获取键值对。

  ```javascript
  for (let pair of m2.entries()) {
    console.info(pair); // 输出 ['key1', 'value1'] 等
  }
  for (let pair of m2[Symbol.iterator]) {
    console.info(pair); // 输出 ['key1', 'value1'] 等
  }
  ```

#### keys

* 按顺序获取键。

* 遍历时可以修改当前键。

  * 其中原始字符串不可修改。
  * 修改后的键不影响原始键取值。

  ```javascript
  for (let key of m2.keys()) {
    console.info(key); // key1 key2
    key = 'kkk';
    console.info(m2.get(key), m2.get('key1')); // undefined 'value1'
  }
  ```

#### values

* 按顺序获取值。

* 遍历时可以修改当前值。与键类似。

  * 原始字符串不可修改。
  * 修改后的值可以通过原来的键取到。

  ```javascript
  for (let value of m2.values()) {
    console.info(value); // value1 value2
    value = 'val';
    console.info(m2.get('key1'), value); // 'value1' 'val'
  }
  ```

#### forEach

* 值得注意的是，这里的遍历第一个参数是**值**，第二个参数是**键**.

  ```javascript
  m2.forEach((value, key) => {
    console.info(value, key); // 输出 ['value1', 'key1'] 等
  })
  ```



### Map 与 Object 的选择

* 对于大多数开发者来说，其实这更像是个人偏好的选择。两者之间的差距并没有想象的那么大。

#### 优劣势比较

* 内存占用：给定固定大小的内存，Map 可以多存 50%
* 插入性能：涉及大量的插入的时候，Map 的性能稍好一些。
* 查找速度：涉及大量的查找的时候，Object 会更好一些。（也许是 Map 会维护顺序的缘故）
* 删除性能：Object 的 delete 在不同的浏览器里性能饱受诟病，因此 Map 更好。

##  [WeakMap 弱映射](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)

### 定义

* 只能使用对象作为键的映射，且键的对象失去引用之后，会被垃圾回收。

### 基本 API

#### 初始化

* 初始化的方式和 Map 类似。

  ```javascript
  const wm1 = new WeakMap();
  const wm2 = new WeakMap([
    [{}, '{}'],
    [objectKey, {}]
  ]);
  // 下面的声明会报错，因为只能使用对象作为键
  const wm3 = new WeakMap([
    [12, 34],
    ['str', 'string']
  ]);
  // 抛出异常：Uncaught TypeError: Invalid value used as weak map key
  ```

#### set/get/has/delete

* WeakMap 也可以使用这些方法，但它不支持 `clear`, 也没有迭代的方法，也没有 `size` 属性。

* 不过可以用重新定义一个 WeakMap 的方式来模拟 `clear` 方法.

  ```javascript
  class ClearableWeakMap {
    constructor(init) {
      this._wm = new WeakMap(init);
    }
    clear() {
      return new WeakMap();
    }
    delete(key) {
      return this._wm.delete(key);
    }
    set(key, val) {
      this._wm.set(key, val);
      return this;
    }
    has(key) {
      return this._wm.has(key);
    }
  }
  ```

### 键回收

* 来看下键被回收的具体案例。

* 需要注意的是，因为垃圾回收时机很难确认，在常规 js 环境中执行，结果显示也许会不准确。可以在 Chrome 的 Devtools 里点击 collect garbage 来尝试手动回收。
* 或者以下案例在 node 环境中执行并直接拿到内存数据，则可以查看确切的效果。

  ```javascript
  // 如果定义了如下的弱映射，则其实始终无法获取到值
  const wm3 = new WeakMap([
    [{}, { key: 'val '}]
  ]);
  // 实际上没有对应的引用，它是空的
  wm3.get({}); // undefined

  // 引用被清除
  const container = {
    key: {}
  }
  function removeReference() {
    container.key = null;
  }
  const m4 = new Map([
    [container.key, 'val']
  ]);

  const wm4 = new WeakMap();
  wm4.set(container.key, 'val');

  console.info(wm4.get(container.key), m4.get(container.key)); // 有键值对
  removeReference();
  console.info(wm4.get(container.key), m4.get(container.key)); // wm 没有键值对
  ```

### WeakMap 的使用场景

#### 部署私有变量

* 使用闭包防止 wm 被外界获取到。

  ```javascript
  const User = (() => {
    const wm = new WeakMap();
    class User {
      constructor(id) {
        this.idProperty = Symbol('id');
        this.setId(id);
      }
      setPrivate(property, value) {
        const privateMembers = wm.get(this) || {};
        privateMembers[property] = value;
        wm.set(this, privateMembers);
      }
      getPrivate(property) {
        const privateMembers = wm.get(this) || {};
        return privateMembers[property];
      }
      setId(id) {
        return this.setPrivate(this.idProperty, id);
      }
      getId(){
        return this.getPrivate(this.idProperty);
      }
    }
    return User;
  })();

  const userA = new User('biaomianshiluanma');
  ```



#### 存储 dom 元数据

* 如果该按钮从页面上删除了，这里仍然会保留引用，从而占用不必要的内存，因此更好的方式是采用弱映射。

  ```javascript
  const btnEle = document.querySelector('#btn');
  const domWm = new WeakMap();
  const domM = new Map();
  domwWm.set(btnEle, { disable: true });
  domM.set(btnEle, { disable: true });
  // 当 dom 节点从页面上删除后，domWm 存储的相关数据会被自动回收
  ```

## [Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)

### 定义

* 集合类型：任意值的集合。
* 其中的值可以是任意类型，但值始终唯一。

### 基本 API

* 需要注意的是，Set 并没有取值的方法。

#### 初始化

* 使用数组初始化集合。

* 也可以使用迭代器来初始化。

  ```javascript
  const s1 = new Set(['val1', 'val2', 'val3']);
  const s2 = new Set({
    [Symbol.iterator]: function *() {
      yield "val1";
      yield "val2";
      yield "val3";
    }
  });
  s1.size; // 3
  s2.size; // 3
  ```

#### add

* Set 初始化之后，想要继续添加值。可以使用 `add` 方法，参数可以是任意类型。

* 同时，它返回当前调用的对象，也就是说它也支持链式调用。

  ```javascript
  const arr = [1, 2, 3, 4];
  s1.add(4);
  s1.add({});
  s1.add(arr);
  s1.add(true);
  s2.add(4).add('5');
  s1.size; // 7
  s2.size; // 5
  ```

#### has

* Set 也有自己的方法来判断是否存在某个键，类似 `Array.prototype.includes`。

  ```javascript
  s1.has(4); // true
  s1.has('4'); // false
  s1.has(arr); // true
  s1.has({}); // false 不指向同一个内存地址
  s2.has('5'); // true
  ```

* 和 Map 类似，如果修改 Set 中某个对象的属性，不影响 `has` 方法的判断。

  ```javascript
  const s3 = new Set();
  let obj = { name: 'kk' };
  s3.add(obj);
  obj.age = 29;
  // 仅更新了属性
  s3.has(obj); // true
  obj = { alias: 'hh' };
  // 更新了引用
  s3.has(obj); // false
  ```

#### delete

* Set 同样也通过 `delete` 来删除，也同样返回布尔值标识是否存在该键。

  ```javascript
  s2.delete(123123); // false
  s2.delete(2); // true
  ```

#### clear

* Set 也使用 `clear` 来清除所有值。

  ```javascript
  s3.clear();
  s3.size; // 0
  ```

### 顺序与迭代

* Set 会维护存入值的顺序。

#### keys/values

* 因为 Set 中没有键值对的概念，从而这两者在 Set 上的返回相同，都返回一个新的迭代器对象。

  ```javascript
  // 迭代结果也一样，迭代顺序是插入的顺序
  for (let key of s1.keys()) {
    console.info(key, 'key');
  }

  for (let val of s1.values()) {
    console.info(val, 'val');
  }

  // val1
  // val2
  // val3
  ```

#### entries

* 以键值对的形式返回，也就是返回两个相同的值。

  ```javascript
  for (let o of s1.entries()) {
    console.info(o, 'entries');
  }

  // 得到下面的结果
  // ['val1', 'val1']
  // ['val2', 'val2']
  // ['val3', 'val3']
  // [4, 4]
  // ['5', '5']

  // 下面的结果也类似
  for (let [k, v] of s1.entries()) {
    console.info(k, v, 'entries');
  }
  ```

#### forEach

* 就像遍历数组一样，Set 也可以使用 forEach.得到和 keys/values 方法类似的结果。

  ```javascript
  s1.forEach((value) => console.info(value));
  // val1
  // val2
  // val3
  // 4
  // '5'
  ```

### Set 的应用场景

* 值的唯一性使得 Set 很适合来做去重处理，同时可以通过处理取得交集，并集等。

* 以下是具体实现:

  ```javascript
  class XSet extends Set {
    isSuperXSet(set) {
      return XSet.isSuperXSet(this, set);
    }
    union(...sets) {
      return XSet.union(this, ...sets);
    }

    intersection(...sets) {
      return XSet.intersection(this, ...sets);
    }

    difference(sets) {
      return XSet.difference(this, sets);
    }

    symmtricDifference(sets) {
      return XSet.symmtricDifference(this, sets);
    }

    powerSet() {
      return XSet.powerSet(this);
    }

  	/**
     * 是否是另一个的子集
     * @param setA
     * @param setB
     * @returns
     */
    static isSuperXSet(setA, setB) {
      for (const val of setA) {
        if (!setB.has(val)) {
          return false;
        }
      }
      return true;
    }

    /**
     * 返回并集
     * @param setA
     * @param setsB
     * @returns
     */
    static union(setA, ...setsB) {
      const unionSet = new XSet(setA);
      for (const valA of setA.values()) {
        for (const valB of setsB) {
          if (valB.has(valA)) {
            continue;
          }
          unionSet.add(valA);
        }
      }
      return unionSet;
    }

    /**
     * 返回交集
     * @param setA
     * @param setsB
     * @returns
     */
    static intersection(setA, ...setsB) {
      const intersectionSet = new XSet(setA);
      for (const valA of setA) {
        for (const bSet of setsB) {
          if (bSet.has(valA)) {
            continue;
          }
          intersectionSet.delete(valA);
        }
      }

      return intersectionSet;
    }

    /**
     * 返回差集
     * @param setA
     * @param setB
     * @returns
     */
    static difference(setA, setB) {
      const differenceSet = new XSet(setA);

      for (const b of setB) {
        if (differenceSet.has(b)) {
          differenceSet.delete(b);
        }
      }

      return differenceSet;
    }

    /**
     * 对称差集
     * @param setA
     * @param setB
     * @returns
     */
    static symmtricDifference(setA, setB) {
      return setA.union(setB).difference(setA.intersection(setB));
    }
  }

  // 实例化之后，就可以使用了
  const xSet = new XSet([1, 2, 3, 4]);
  const xSetChild = new XSet([1, 2, 3]);
  xSetChild.isSuperXSet(xSet); // true
  ```



## [WeakSet 弱集合](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)

### 定义

* 弱集合。其中的值只能是 `Object` 类型或者继承自 `Object` 类型。
* 尝试设置非对象的值会抛出异常 `TypeError`。

### 基本 API

* 与 Set 类型，它也有这些 api，唯独少了 `clear` 方法。可以用重新定义一个 WeakSet 的方式来模拟 `clear`.

#### add

#### has

#### delete

### 弱值

* 弱集合的特殊性使得它方便垃圾回收处理。

  ```javascript
  // 声明一个空对象，且没有其他地方引用这个对象
  const wSet = new WeakSet([{}]);
  // 在声明之后，这个空对象就会被垃圾回收处理，使得 wSet 的内容是空的
  console.info(wSet);
  // 有时可能打印出来还会有内容，可能是还未触发浏览器的垃圾回收，参见上面介绍的 WeakMap
  ```

* 下面这个例子或许更加直观。

  ```javascript
  const container = {
    val: {}
  };
  const wSet1 = new WeakSet([container.val]);

  /**
   * 移除引用
   */
  function removeReferrence() {
    container.val = null;
  }

  console.info(wSet1, wSet1.has(container.val)); // true
  removeReferrence();
  console.info(wSet1, wSet1.has(container.val)); // false
  ```

### 不可迭代性

* 因为弱集合中的值都是弱值，随时可能会销毁，因而没有必要提供迭代的能力。
* WeakSet 之所以限制只能是对象作为值，是为了保证只有通过值对象的引用才能取得值。如果允许原始值，就没有办法区分初始化使用的字符串字面量和初始化之后使用的一个相等的字符串了。

### WeakSet 的应用场景

* WeakSet 也可以用来存储 dom 元数据。

  ```javascript
  const disabledElements = new WeakSet();
  const loginBtn = document.querySelector('#login');

  // 只要任意有按钮从页面上删除，disabledElements 就可以释放相应的内存
  disabledElements.add(loginBtn);
  ```

## 参考

> JavaScript 高级程序设计（第4版）
> [一些参考](https://github.com/frontend9/fe9-library/issues/275)

<!-- 6h -->
