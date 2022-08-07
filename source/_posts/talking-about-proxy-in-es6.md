---
title: 聊一聊 ES6 中的 Proxy
date: 2022-08-06 21:43:28
tags: ES2015
categories: JavaScript
---

![](/2022/08/06/talking-about-proxy-in-es6/unphoto.jpg)
本文尝试主要从三个方面介绍 ES6 的特性 Proxy 和 Reflect： **Proxy 是什么**，**Proxy 有什么**以及 **Proxy 能做什么**。
介绍完 Proxy 之后，我们再简单探究一下 Proxy 和 Mobx 的联系，以及从 Proxy 的角度去尝试理解 Mobx v5。
推荐：★★★★

<!--more-->

## 01.目录

* [02.Proxy是什么](#02-Proxy是什么)
* [03.Proxy有什么](#03-Proxy有什么)
* [04.Reflect](#04-Reflect)
* [05.Proxy的限制](#05-Proxy的限制)
* [06.Proxy能做什么（应用场景）](#06-Proxy能做什么（应用场景）)
* [07.Proxy的实践](#07-Proxy的实践)
* [08.小结](#08-小结)
* [09.参考](#09-参考)

## 02.Proxy是什么

### 02.01 [MDN 定义](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

> Proxy 对象用于创建一个**对象**的代理，从而实现**基本操作的拦截**和**自定义**（如属性查找、赋值、枚举、函数调用等）。

* 这里有三个关键词，已经分别加粗展示，我们一个个来理解。

#### 目标对象

* Proxy 作为对象的代理，只能用在引用类型的对象上，例如**数组**，**对象**，**函数**等等。
* 代理不可以对基本类型进行处理，如果传入基本类型的参数，在调用构造函数的时候就会报错。

```typescript
const p1 = new Proxy(1, {}); // Uncaught TypeError: Cannot create proxy with a non-object as target or handler
```

#### 基本操作的拦截

* 例如针对对象的读取属性和写入属性操作进行拦截。
* 依次执行下面的代码，可以理解读写的基本操作拦截的简单实现。

```typescript
const myTarget = { name: "Jack" };
const myProxy = new Proxy(myTarget, {
  get(target, property, receiver) {
    console.log(property);
    return "Ross";
  },
  set(target, property, value) {
    if (property === "name") {
      target[property] = value + " Jack";
      return true;
    }
    return false;
  },
});

console.log(myProxy.name); // name Ross
console.log(myTarget.name); // Jack
myProxy.name = "Curry"; // true
console.log(myProxy.name); // name Ross
console.log(myTarget.name); // Curry Jack
console.log(myProxy.foo); // Ross
myProxy.foo = "bar"; // bar
console.log(myProxy); // { "name": "Ross" }
```

#### 自定义操作

* 如定义所言，自定义的操作可以包括**属性查找**、**赋值**、**枚举**、**函数调用**。
* 这里先不展开，后面会详细说明这些处理函数。

### 02.02 基本使用

* Proxy 构造函数接收两个对象作为参数。第一个参数是**目标对象**，如上文所说，这个参数必须是对象格式的，否则调用时就会抛出 TypeError。或者可以我们可以理解为原始对象。
* Proxy 的第二个参数就是**包含处理函数的对象**，它也必须是一个对象。可以给它传入对应的处理函数，当然也可以什么都不做。如果传入的是基本类型的参数，则同样会抛出异常。
* 这是 TS 的定义。可以先关注 new 的部分，可撤销的部分后文会聊到。

```typescript
interface ProxyConstructor<T extends object> {
  revocable<T extends object>(
    target: T,
    handler: ProxyHandler<T>
  ): { proxy: T; revoke: () => void };
  new <T extends object>(target: T, handler: ProxyHandler<T>): T;
}
```

* 下面我们创建一个什么都不做的 Proxy，并打印观察它的行为。

```typescript
const target = { foo: "bar" };
const proxy = new Proxy(target, {});
console.log(target.foo); // bar
console.log(proxy.foo); // bar
proxy.foo = "qux";
console.log(target.foo); // qux
console.log(proxy.foo); // qux
target.foo = "baz";
console.log(target.foo); // baz
console.log(proxy.foo); // baz
```

* 默认情况下，Proxy 和原始目标对象的行为是一致的。

## 03.Proxy有什么

* 上面的代码运行之后发现，代理对象的行为和原始目标对象的行为是一致的，但是这样似乎没有什么实际的意义。而让 Proxy 真正变得强大的，是它的处理函数 `handlers`。

### 03.01 Proxy 的处理函数

* 下面是所有可以**自定义**的处理函数以及它们的 TS 定义，这些函数也被称之为 traps，通常翻译成**捕获器，**也可以理解成**劫持**。

```typescript
interface ProxyHandler<T extends object> {
  apply?(target: T, thisArg: any, argArray: any[]): any;
  construct?(target: T, argArray: any[], newTarget: Function): object;
  defineProperty?(
    target: T,
    p: string | symbol,
    attributes: PropertyDescriptor
  ): boolean;
  deleteProperty?(target: T, p: string | symbol): boolean;
  get?(target: T, p: string | symbol, receiver: any): any;
  getOwnPropertyDescriptor?(
    target: T,
    p: string | symbol
  ): PropertyDescriptor | undefined;
  getPrototypeOf?(target: T): object | null;
  has?(target: T, p: string | symbol): boolean;
  isExtensible?(target: T): boolean;
  ownKeys?(target: T): ArrayLike<string | symbol>;
  preventExtensions?(target: T): boolean;
  set?(target: T, p: string | symbol, value: any, receiver: any): boolean;
  setPrototypeOf?(target: T, v: object | null): boolean;
}
```

#### [`handler.get()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/get) 和 [`handler.set()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set)

* 这两个方法比较接近，所以放在一起说。
* 它们分别会在获取属性值以及设置属性值的操作中被调用。

**get()**

* get 捕获器的返回值可以是任意的。
* 具体的捕获场景有以下四种：
  * `proxy.property`
  * `proxy[property]`
  * `Object.create(proxy)[property]`
  * `Reflect.get(proxy, property, receiver)`


* get 方法的参数：
```typescript
/**
 * @param {T extends Object} target 目标对象
 * @param {string|Symbol} property 引用的目标对象上的字符串键属性或 Symbol 键
 * @param {T extends Object} receiver 代理对象或继承代理对象的对象
 */
get?(target: T, property: string | symbol, receiver: any): any;
```

**set()**

* set 捕获器的返回值是布尔值，标识设置属性值是否成功，不过如果不返回布尔值，也不会抛出异常。
* 具体的捕获场景有以下四种：
  * `proxy.property = value`
  * `proxy[property] = value`
  * `Object.create(proxy)[property] = value`
  * `Reflect.set(proxy, property, value, receiver)`


* set 方法的参数：
```typescript
/**
 * @param {T extends Object} target 目标对象
 * @param {string|Symbol} property 引用的目标对象上的字符串键属性或 Symbol 键
 * @param {any} value 赋给属性的值
 * @param {T extends Object} receiver 接收最初赋值的对象
 */
set?(target: T, property: string | symbol, value: any, receiver: any): boolean;
```

##### 应用 get 和 set

* 下面是简单的使用，读取 proxy 中的属性会触发，但是直接操作目标对象 target，是不会触发代理的事件的。

```typescript
const myTarget = { name: "Bob" };
const myProxy = new Proxy(myTarget, {
  /**
   * @param {T extends Object} target
   * @param {string|Symbol} property
   * @param {T extends Object} receiver
   * @return {boolean}
   */
  get(target, property, receiver) {
    console.log("get()");
    return Reflect.get(...arguments);
  },
  set(target, property, value, receiver) {
    console.log("set()");
    return Reflect.set(...arguments);
  },
});
console.log(myProxy.name); // get()
console.log(myTarget.name); // 不会触发捕获器
myProxy.name = "Stein"; // set()
myTarget.name = "Nash"; // 不会触发捕获器
```

#### [`handler.has()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/has)

* `has()`捕获器会在 in 操作符中被调用。
* 它会返回一个**布尔值**来标识属性是否存在于代理对象中，如果显式返回非布尔值会被隐式转换成布尔值。
* 具体的的捕获场景有以下四种：
  * `property in proxy`
  * `property in Object.create(proxy)`
  * `with (proxy) { (property) }`
  * `Reflect.has(proxy, property)`


* has 方法的参数：
```typescript
/**
 * @param {T extends Object} target 目标对象
 * @param {string|Symbol} property 引用的目标对象上的字符串键属性或 Symbol 键
 */
has?(target: T, property: string | symbol): boolean;
```

#### [`handler.deleteProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/deleteProperty)

* 这个捕获器会在删除属性的时候被调用。
* 它会返回一个布尔值来标识属性是否删除成功，如果显式返回非布尔值会被隐式转换成布尔值。
* 具体的捕获场景有以下三种:
  * `delete proxy.property`
  * `delete proxy[property]`
  * `Reflect.deleteProperty(proxy, property)`


* deleteProperty 方法的参数：
```typescript
/**
 * @param {T extends Object} target 目标对象
 * @param {string|Symbol} property 引用的目标对象上的字符串键属性或 Symbol 键
 */
deleteProperty?(target: T, property: string | symbol): boolean;
```

##### 应用 has 和 deleteProperty

* 下面是简单使用 `has` 和 `deleteProperty` 来判断属性的存在与否。

```typescript
const myTarget = { foo: "bar" };
const myProxy = new Proxy(myTarget, {
  has(target, property) {
    console.log("has()");
    return Reflect.has(...arguments);
  },
  deleteProperty(target, property) {
    console.log("deleteProperty()");
    return Reflect.deleteProperty(...arguments);
  },
});
console.log("foo" in myProxy); // has() true
delete myProxy["foo"]; // deleteProperty
console.log("foo" in myProxy); // has() false
```

* Proxy 的其他自定义函数因为相对使用较少暂且省略介绍，感兴趣的可以前往 MDN 继续了解。

### 03.02 Proxy 的撤销

* 在一般情况下，我们使用 Proxy 不太会想要撤销。而通过 new 运算符创建的 Proxy 对象在其生命周期内是始终和目标对象关联的，没有办法改变。
* 如果期望创建一个能够撤销的 Proxy 对象，可以通过 Proxy 的静态方法 `revocable` 来实现。
* 我们创建一个可以撤销的 Proxy 对象，它和用 new 运算符生成的对象没有什么不同。

```typescript
// revocable<T extends object>(target: T, handler: ProxyHandler<T>): { proxy: T; revoke: () => void; };
const target = { foo: "bar" };
const { revoke, proxy } = Proxy.revocable(target, {});
```

* 执行撤销方法之后，所有关于 proxy 的操作都会抛出异常。撤销之后，也是不可逆的。

```typescript
console.log(proxy.foo); // bar
revoke();
console.log(proxy.foo); // Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked
```

## 04.Reflect

* 在了解 Proxy 的过程中，必须要了解的另一个全局对象是 Reflect。
* 它相当于是把散落各处的全局 API 做一个收拢，可以统一处理并调用。

### 04.01 [MDN 定义](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

> Reflect 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与 proxy `handlers` 的方法相同。
> Reflect 不是一个函数对象，因此是不可构造的，不能通过 new 运算符来调用，它的所有属性和方法都是静态的。类似 `Math` 对象的使用。

### 04.02 Reflect 的处理函数

* 下面是所有的处理函数的 TS 定义。我们通过定义来概览一下 Reflect。

```typescript
declare namespace Reflect {
  /**
   * Calls the function with the specified object as the this value
   * and the elements of specified array as the arguments.
   * @param target The function to call.
   * @param thisArgument The object to be used as the this object.
   * @param argumentsList An array of argument values to be passed to the function.
   */
  function apply(
    target: Function,
    thisArgument: any,
    argumentsList: ArrayLike<any>
  ): any;

  /**
   * Constructs the target with the elements of specified array as the arguments
   * and the specified constructor as the `new.target` value.
   * @param target The constructor to invoke.
   * @param argumentsList An array of argument values to be passed to the constructor.
   * @param newTarget The constructor to be used as the `new.target` object.
   */
  function construct(
    target: Function,
    argumentsList: ArrayLike<any>,
    newTarget?: Function
  ): any;

  /**
   * Adds a property to an object, or modifies attributes of an existing property.
   * @param target Object on which to add or modify the property. This can be a native JavaScript object
   *        (that is, a user-defined object or a built in object) or a DOM object.
   * @param propertyKey The property name.
   * @param attributes Descriptor for the property. It can be for a data property or an accessor property.
   */
  function defineProperty(
    target: object,
    propertyKey: PropertyKey,
    attributes: PropertyDescriptor & ThisType<any>
  ): boolean;

  /**
   * Removes a property from an object, equivalent to `delete target[propertyKey]`,
   * except it won't throw if `target[propertyKey]` is non-configurable.
   * @param target Object from which to remove the own property.
   * @param propertyKey The property name.
   */
  function deleteProperty(target: object, propertyKey: PropertyKey): boolean;

  function get(target: object, propertyKey: PropertyKey, receiver?: any): any;

  function getOwnPropertyDescriptor(
    target: object,
    propertyKey: PropertyKey
  ): PropertyDescriptor | undefined;

  function getPrototypeOf(target: object): object | null;

  /**
   * Equivalent to `propertyKey in target`.
   * @param target Object that contains the property on itself or in its prototype chain.
   * @param propertyKey Name of the property.
   */
  function has(target: object, propertyKey: PropertyKey): boolean;

  function isExtensible(target: object): boolean;

  /**
   * Returns the string and symbol keys of the own properties of an object. The own properties of an object
   * are those that are defined directly on that object, and are not inherited from the object's prototype.
   * @param target Object that contains the own properties.
   */
  function ownKeys(target: object): (string | symbol)[];

  function preventExtensions(target: object): boolean;

  /**
   * Sets the property of target, equivalent to `target[propertyKey] = value` when `receiver === target`.
   * @param target Object that contains the property on itself or in its prototype chain.
   * @param propertyKey Name of the property.
   * @param receiver The reference to use as the `this` value in the setter function,
   *        if `target[propertyKey]` is an accessor property.
   */
  function set(
    target: object,
    propertyKey: PropertyKey,
    value: any,
    receiver?: any
  ): boolean;

  function setPrototypeOf(target: object, proto: object | null): boolean;
}
```

### 04.03 Reflect 结合 Proxy 使用

* Reflect 的处理函数和 Proxy 的处理函数是完全一致的，但显然它们肯定也有着自己的用途。
* 篇幅所限，我们这里着重关注 set 和 get 方法。先看下面的例子。

```typescript
const myTarget = {
  foo: "qux",
  get bar() {
    // console.log('this ===', this, this === myTarget);
    return this.foo;
  },
};
const handler = {
  get(target, property, receiver) {
    console.log(`我被读取了${property}属性`);
    return target[property];
  },
  set(target, property, value, receiver) {
    console.log(`我被设置了${property}属性, value: ${value}`);
    target[property] = value;
  },
};
const myProxy = new Proxy(myTarget, handler);
myProxy.bar; // 我被读取了bar属性
```

* 观察上一段代码并执行，我们的预期是在打印【读取 bar 属性】之后，继续打印出【读取 foo 属性】。
  * 然而实际上并没有。
* 当我们加上打印语句或分析可以发现，实际上这里的访问器属性 this 指向的是目标对象 `myTarget` 而不是代理对象 `myProxy`.
  * 使用 `Reflect.get` 可以解决这个问题.

```typescript
const myTarget = {
  foo: "qux",
  get bar() {
    console.log("this ===", this, this === myTarget);
    return this.foo;
  },
};
const handler = {
  get(target, property, receiver) {
    console.log(`我被读取了${property}属性`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`我被设置了${property}属性, value: ${value}`);
    return Reflect.set(target, property, value, receiver);
  },
};
const myProxy = new Proxy(myTarget, handler);
myProxy.bar; // 我被读取了bar属性 我被读取了foo属性
```

* 根本原因是 `Reflect.get`方法可以正确找到指向的对象。
* 相当于执行了 `target[property].call(target)`.

  > 如果 target 对象中指定了 getter，receiver 则为 getter 调用时的 this 值。
  > 例如当 `target[property]` 是 getter 函数时，receiver 就是对应的 this 值。


* 把 `Reflect.get` 方法的定义单拎出来，可以发现函数参数的定义处有明确的注释说明。

```typescript
/**
 * Gets the property of target, equivalent to `target[propertyKey]` when `receiver === target`.
 * @param target Object that contains the property on itself or in its prototype chain.
 * @param propertyKey The property name.
 * @param receiver The reference to use as the `this` value in the getter function,
 *        if `target[propertyKey]` is an accessor property.
 */
function get(target: object, propertyKey: PropertyKey, receiver?: any): any;
// 分别执行下面
Reflect.get(myTarget, "bar");
Reflect.get(myProxy, "bar");
```

* 同理可以推导出 `Reflect.set` 的使用方式，这里不再详细说明。
* 也是因为 this 的指向问题， Proxy 通常会配合 Reflect 使用。

### 04.04 [比较 Reflect 和 Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/Comparing_Reflect_and_Object_methods)

* 从方法名来看，它的许多 API 和 Object 相同，但有一些细微的区别。

#### [`Reflect.defineProperty()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/defineProperty)

* 例如 `Reflect.defineProperty` 方法，通过 Reflect 调用会返回布尔值，而在 Object 上调用则会在不满足条件的时候直接抛出异常。
* `Object.definedProperty` 实际上也可以操作函数或数组，但如果这样调用，语义上容易令人误解，通过 Reflect 调用就会清晰很多.
  * `Object.defineProperty([], {})` / `Object.defineProperty(() => {}, {})`
  * `Reflect.defineProperty([], {})` / `Reflect.defineProperty(() => {}, {})`

#### [`Reflect.ownKeys()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys)

* 而 `Reflect.ownKeys` 可以在获取对象的常规属性的同时，还可以获取到 `Symbol` 类型的键，而 `Object.keys` 只能获取到常规的字符串属性键。
* 实际效果等同于下面两个方法结合使用。
  * [`Object.getOwnPropertyNames`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)
  * [`Object.getOwnPropertySymbols`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)

```typescript
const obj = {};
const symbolKey = Symbol("key");
obj[symbolKey] = "hello symbol";
obj.key = "normal key";
console.log("Object keys", Object.keys(obj)); // ['key']
console.log("Reflect ownKeys", Reflect.ownKeys(obj)); // ['key', Symbol(key)]
Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj)); // ['key', Symbol(key)]
```

* 可以说，Reflect 是基于 Object、Function 等类型做了扩充和完善，在其行为上保持一致性。
  * 可以把 Reflect 简单理解成是 Object 的扩展。

## 05.Proxy的限制

### 05.01 处理函数的使用遵从不变式

* 如果在处理函数中操作不可配置的属性，则可能会抛出异常。具体每个处理函数都有自己的不变式，出现违背时就会抛 `TypeError`. 我们可以把它理解成是一种强制的约束。

### 05.02 this 的注意事项

* 通常情况下，this 可以执行得到预期的结果。

```typescript
const myTarget = {
  thisValEuqalsProxy() {
    console.log(myTarget === this);
    console.log(myProxy === this);
  },
};
const myProxy = new Proxy(myTarget, {});
myProxy.thisValEuqalsProxy(); // false true
myTarget.thisValEuqalsProxy(); // true false
```

* 这里得到的 this 指向是符合预期的，指向具体的调用方。
* 但如果是另外一个例子。

```typescript
const wm = new WeakMap();

class User {
  constructor(userId) {
    console.log("this ===", this);
    wm.set(this, userId);
  }

  set id(userId) {
    console.log("set ===", this);
    wm.set(this, userId);
  }

  get id() {
    console.log("get ===", this);
    return wm.get(this);
  }
}
const user = new User(123);
console.log(user.id); // 123

const userInstanceProxy = new Proxy(user, {});
console.log(userInstanceProxy.id); // undefined 没有得到预期的结果
console.log(wm); // WeakMap {User => 123}
```

* 究其原因，this 在调用时指向当前上下文。在这个地方，指向的是构造函数。
  * user 的指向是 User 构造函数，可以正常运行。
  * userInstanceProxy 的指向是 Proxy， 就不符合预期了。
* 对其稍加改造一下，可以得到预期的结果。

```typescript
const wm = new WeakMap();

class User {
  constructor(userId) {
    console.log("this ===", this);
    wm.set(this, userId);
  }

  set id(userId) {
    console.log("set ===", this);
    wm.set(this, userId);
  }

  get id() {
    console.log("get ===", this);
    return wm.get(this);
  }
}
const UserProxy = new Proxy(User, {});
const userInstanceProxy = new UserProxy(123);

console.log(userInstanceProxy.id); // 123
userInstanceProxy.id = 78;
console.log(wm); // WeakMap {User => 78}
```

### 05.03 内置插槽（内置方法依赖 this）

```typescript
const myDate = new Date();
const myProxy = new Proxy(myDate, {});
myProxy.getDate(); // TypeError
```

* 在 Reflect 的说明中，我们提到了期望 this 指向符合直觉的实现。然而在某些情况下，我们希望它指向时的上下文是原来的目标对象 target 而不是代理对象。
  * 例如上面的 `getDate` 。因为在日期对象里有许多 Proxy 所没有的数据属性，Proxy 对象在执行时读取不存在的属性，就会导致报错。`getDate` 里对应的数据属性就是 `[[NumberDate]]`.
  * 在类似的实现中，需要手动绑定 this 到原来的目标对象中，才可以执行对应的方法。

```typescript
const myDate = new Date();
const myProxy = new Proxy(myDate, {
  get(target, property, receiver) {
    if (property === "getDate") {
      return target[property].bind(target);
    }
    return Reflect.get(...arguments);
  },
});
myProxy.getDate(); // 3
myProxy.getMonth(); // TypeError 因为缺少另外的内置插槽
```

* 另一个可能比较常见的例子是代理 Map 对象，Proxy 没有 Map 的内部插槽 `[[MapData]]`。因此也需要类似处理，否则会抛出异常。

### 05.04 Proxy 不向下兼容

* Proxy 唯一且可能最大的缺陷，就是不向下兼容，而且也没有 polyfill 能够实现完全一样的效果。

## 06.Proxy能做什么（应用场景）

* 下面我们通过两个具体的实践案例来更进一步了解 Proxy 的使用场景。

### 06.01 代理数组，实现通过负的索引访问数组元素

* 目前 JS 中的数组对象，还不能够像 python 一样通过负数索引来访问数组元素。如果直接设置，最终的结果是数组会像对象一样拥有一个负数作为键的属性，而不是数组元素。
* 这里我们对此加以扩展，得到一个可以通过负数读取和设置元素的代理数组。

```typescript
/**
 * @description: 返回一个代理的数组
 * @param {Array} arr
 * @return {Proxy}
 */
function proxyArray(arr) {
  return new Proxy(arr, {
    get(target, property, receiver) {
      if (Number.isNaN(Number(property))) return;

      if (Number(property) < 0) {
        property = Number(property) + target.length;
      }

      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (Number.isNaN(Number(property))) return false;

      if (Number(property) < 0) {
        property = Number(property) + target.length;
      }

      return Reflect.set(target, property, value, receiver);
    },
  });
}

const myArray = proxyArray([5, 4, 3, 2, 1]);
myArray[-1]; // 1
myArray[-2] = 22;
console.log(myArray);
```

### 06.02 实现可观察对象

* 我们可以通过 Proxy，实现一个可观察的代理对象。

```typescript
/**
 * @description: 实现可观察对象
 * @param {Object} target
 * @return {Proxy}
 */
function makeObservable(target) {
  target.handlers = [];

  target.observe = function (handler) {
    handler && this["handlers"].push(handler);
  };
  return new Proxy(target, {
    set(target, property, value, receiver) {
      const setSuccess = Reflect.set(...arguments);

      // 设置成功
      if (setSuccess) {
        target.handlers.forEach((handler) => handler(property, value));
      }

      return setSuccess;
    },
  });
}

const user = {};
const proxyUser = makeObservable(user);
proxyUser.observe((key, value) => {
  console.log("key is", key, ", value is", value);
});
proxyUser.name = "Bob";
```

* 和直接使用函数实现可观察对象的不同之处在于，通常函数实现会直接修改原对象，在原对象上注入监听方法。而使用代理则可以在不改变原始对象的情况下实现，因为它返回的是代理对象，监听的也是代理对象的变化。

#### React 中使用可观察对象

* 可观察对象的应用是随处可见的，假设我们把它带入到 React 中，则完全可以实现简版的**修改属性值即触发组件更新**的功能，从而略去手动更新 state 的步骤。我们只需要把组件变成可观察对象并注入对应的更新方法。
* 下面是伪代码。

```typescript
const comp = { state: {} }; // 想象这是一个 React 组件
const proxyComp = makeObservable(comp);

// 注入方法，这个步骤可以通过高阶函数或三方库来实现
proxyComp.observe((key, value) => {
  // 更新状态从而让组件自动刷新
  this.setState({ [key]: value });
});

comp.state.name = "UserList"; // 开发者的赋值操作自动触发组件更新
```

* Proxy 的应用场景显然不止上面的这两者，开发者可以用它的能力实现**跟踪属性访问**，**隐藏属性**，**阻止修改或删除属性**、**函数参数验证**，**构造函数参数验证**，**数据绑定**和**可观察对象**等等。
* 而且在创建这些编码模式的时候，都可以通过 Proxy 把原始目标对象和代理对象区分开，在代理对象上实现各类效果而不影响原始对象的行为，真正做到**高内聚低耦合**。同时也符合设计模式中的**单一职责原则**。

## 07.Proxy的实践

### 07.01 Proxy 和 Mobx

* 在较早的版本 Mobx v4 中，Mobx 使用 `Object.defineProperty` 实现对数据的劫持。
* 但在实际中遇到以下问题：
  1.  在 Mobx 中操作的数组不是真正的数组，而是**类数组对象**，因此缺少数组的部分方法或其行为不一致。
      * 例如需要返回真正的数组时要调用 slice 方法来拿到数组。
      * 调用类数组对象的方法 sort 和 reverse 时，其行为和原始的数组不一致，并不会修改原数组顺序。
      * 修改类数组对象的 length，其实是通过 `Object.defineProperty` 来劫持，得到和数组行为一致的返回值。
  2.  不能检测对象属性的增加和删除，因为 `Object.defineProperty` 是对已知的属性进行劫持，未知的属性无法预知。
* 下面是 Mobx v4 劫持类数组对象的 length 属性的实现。

```typescript
Object.defineProperty(ObservableArray.prototype, "length", {
  enumerable: false,
  configurable: true,
  get: function (): number {
    return this.$mobx.getArrayLength();
  },
  set: function (newLength: number) {
    this.$mobx.setArrayLength(newLength);
  },
});
```

* 针对第一个问题，在 Mobx 5+ 的版本后，默认开启 Proxy。使用 Proxy 来实现对数组的劫持，本质上使用的是原生的数组，因此调用各个原生方法的行为也都能够和原生数组保持一致。
* 下面是 Mobx v5 劫持整个数组的实现，包括任意属性的读写。

```typescript
const arrayTraps = {
  get(target, name) {
    if (name === $mobx) return target[$mobx];
    if (name === "length") return target[$mobx].getArrayLength();
    if (typeof name === "number") {
      return arrayExtensions.get.call(target, name);
    }
    if (typeof name === "string" && !isNaN(name as any)) {
      return arrayExtensions.get.call(target, parseInt(name));
    }
    if (arrayExtensions.hasOwnProperty(name)) {
      return arrayExtensions[name];
    }
    return target[name];
  },
  set(target, name, value): boolean {
    if (name === "length") {
      target[$mobx].setArrayLength(value);
    }
    if (typeof name === "number") {
      arrayExtensions.set.call(target, name, value);
    }
    if (typeof name === "symbol" || isNaN(name)) {
      target[name] = value;
    } else {
      // numeric string
      arrayExtensions.set.call(target, parseInt(name), value);
    }
    return true;
  },
  preventExtensions(target) {
    fail(`Observable arrays cannot be frozen`);
    return false;
  },
};
```

* 针对第二个问题，只要通过 Proxy 劫持的是整个对象，对整个对象的属性的变化进行监听，也就能够解决无法检测属性新增/删除的问题。

## 08.小结

* 通过了解 Proxy 的基本自定义处理函数、全局 Reflect 对象，以及几个比较具体的 Proxy 实践的示例，来理解 Proxy 这个在现代开发里应用非常广泛的特性。
* 对于 Proxy 在 Mobx 中的应用，这里也仅仅是粗浅地简析小部分源码，来借此理解 Mobx 框架的一些原理，为后面进一步了解 Mobx 的实践打下部分基础。
* 当然，在本文中其实还有许多点可以深入，例如 Proxy 的限制一小节中，由内置插槽可以引申到 Proxy 的实现原理和 ES 规范中定义的异质对象；由 Proxy 的应用一小节中，可以实现一个完整的可观察对象以及探究观察者模式；还有就是刚才所提到的 Mobx 的部分。碍于自己的精力和能力有限，无法一次性深入聊完。
* 预计下一篇的主题，会是 Proxy 在 Mobx 中的应用，以及 Mobx v6(v7) 的最佳实践。

## 09.参考

> [ES2015规范](https://262.ecma-international.org/6.0/#sec-invariants-of-the-essential-internal-methods)
> [你可能不知道的Proxy](https://mp.weixin.qq.com/s/LFpHyiMHwsZ2aVKWqdM2hg)
> [Proxy详解，运用与Mobx](https://juejin.cn/post/6844903741326360590)
> [awesome-es2015-proxy](https://github.com/mikaelbr/awesome-es2015-proxy)

<!-- 14h+ -->
