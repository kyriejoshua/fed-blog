---
title: 被人忽视的 es6 重要类型 symbol 简单入门
date: 2020-06-13 16:48:38
tags: JavaScript
categories: JavaScript
---
<hr/>

![](/2020/06/13/learning-about-symbol/unphoto.jpg)
随着 ES6 的广泛应用，似乎其实还有一些它的特性，明明推出时影响巨大，却并没有掀起多少波澜。本文尝试着探究它，搞清楚它是什么，它能做什么，以及为什么它不火。
推荐：★★★☆

<!--more-->

## 索引

* [Symbol介绍](#Symbol是什么)
* [Symbol怎么用](#Symbol怎么用)
* [Symbol应用场景](#Symbol应用场景)
* [小结](#小结)
* [参考](#参考)

### Symbol是什么

* 从较官方的文档上看，它*是一种基本数据类型 （[primitive data type](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive)）。`Symbol()`函数会返回 `symbol` 类型的值，该类型具有静态属性和静态方法。它的静态属性会暴露几个内建的成员对象；它的静态方法会暴露全局的symbol注册，且类似于内建对象类，但作为构造函数来说它并不完整，因为它不支持语法：`new Symbol()`。*

* 通俗一些，讲人话就是，它是 ES6 推出的新的基本类型，它的"构造"函数每一次调用返回的值都是唯一的。

  ```javascript
  const symbol1 = Symbol();
  const symbol2 = Symbol(1234);
  const symbol3 = Symbol('foo');
  const symbol4 = Symbol();

  console.info(typeof symbol1); // symbol
  console.info(symbol1 === symbol4); // false
  console.info(symbol2 === 1234); // false
  console.info(symbol3 === 'foo'); // false
  ```

* 可以看到，以上的输出结果通通都是 `false`, 它们都互不相等. 且获取到的类型是类型 `symbol`.

### Symbol怎么用

#### 基本使用

* 上文简要介绍了 Symbol 和它的使用。现在我们来详细看一下它是一个怎样的存在。
* 它的语法很简单 **`Symbol([description])`**. 入参是可选的。仅用作调试。
  * 但比较怪异的是，它不支持 `new Symbol` 创建的语法。如果要这么执行，会抛出异常 `Uncaught TypeError: Symbol is not a constructor`。
  * 猜测这是因为它本质上还是原始类型的值，而不是对象。
    * `const num = new Number(1);`
    * ` typeof num; // 输出 object` 其实构造函数返回的是对象。
  * 而上文提到的入参，目前是没有官方方法提供的，只是在 ES2019 的标准里是可以直接访问了。`symbol3.description // output: foo`.


* 好的，我们回过头看这个可选的参数支持什么样的数据类型。

  ```javascript
  const num = Symbol(123); // Symbol(123)
  const str = Symbol('string'); // Symbol(string)
  const bol = Symbol(false); // Symbol(false)
  const obj = Symbol({}); // Symbol([object Object])
  const foo = Symbol(() => {}); // Symbol(() => {})
  const nul = Symbol(null); // Symbol(null)
  const und = Symbol(undefined); // Symbol()
  ```

* 运行后发现，这些类型当作入参都是支持的，并且最终输出都转化成了字符串。就像是使用 `String(description)` 先调用了一次转成了字符串类型。只有 `undefined` 的输出里，`description` 被吞了。`undefined` 这里为何不输出我在目前的文档里还没有找到解释。实际使用中，这种场景可能也较少。

#### 作为属性使用

* 实际上，`Symbol` 作为属性值或者属性名来使用，会更有实际意义一些。
* 需要注意的是，`Symbol` 不是字符串类型，所以不管是访问还是定义，都需要用中括号包裹。

  ```javascript
  const desc = Symbol('desc');
  let symbolObj = {
      [Symbol('name')]: 'kyrie',
      [desc]: 'desc'
  };
  symbolObj.desc; // output: undefined
  symbolObj[desc]; // output: desc
  ```

* 以上可以看到，如果用 `.` 属性访问，实际是访问的字符串属性，而非 `Symbol` 属性。这里我们并没有赋值，因此是 `undefined` 的。
* 作为使用来说，自然是为了防止属性名相同时，有值被意外覆盖。以下定义了多个 `name` 属性，而最终它们都是存在的。

  ```javascript
  symbolObj[Symbol('name')] = 'jody';
  const symbolObj2 = {
      [Symbol('name')]: 'ella'
  };
  const newSymbolObj = Object.assign({}, symbolObj, symbolObj2);
  console.info(newSymbolObj); // output: {Symbol(name): "kyrie", Symbol(name): "jody", Symbol(name): "ella"}
  ```

* 最后，这三个属性都是在的。不管是新增的属性亦或是合并的属性，都列出来了。那么我们会很自然的想到，都长一样了，咋去访问呢。
* 有的人可能会觉得，这玩意儿不是很像字符串么，那我索性通通 `JSON.stringify()` 序列化一遍好了。到时都是字符串，还怕取不出。不幸的是，序列化还真不行。`stringify` 方法先前我们知道，是不能单独序列化 `undefined` 和 任意函数的。这回，还得加上 `Symbol`。

  ```javascript
  JSON.stringify(newSymbolObj); // "{}"
  JSON.stringify(() => {}); // undefined
  JSON.stringify(); // undefined
  ```

* 因此，大可不必费周章使用旁门左道。如果只是访问的话，且看下文。

##### `Object.prototype.getOwnPropertySymbols`

* Object 原型上是有提供这样一个方法来访问 `Symbol` 属性的。
* 以数组形式返回属性名，有些类似 `Object.keys` 的效果。

  ```javascript
  const symbolKeys = Object.getOwnPropertySymbols(newSymbolObj);
  console.info(symbolKeys); // output: [Symbol(name), Symbol(name), Symbol(name)]
  ```

* 这个返回，似乎没有什么用。毕竟我们刚刚设置了几个同名描述值的 `Symbol` 属性嘛。但对不同描述值的 `Symbol` 属性来说，自然是直观一些的。

  ```javascript
  symbolKeys.forEach((key) => console.info(newSymbolObj[key]));
  // kyrie
  // jody
  // ella
  ```

* 依次输出了三个属性值。这个顺序，据我个人观察，是按照定义先后顺序来的。这里也并没有找到明确的说法。
* 这个方法用完，似乎我明白了它为啥不火了。
* 当然，可以用作变量名作属性来区分，不过很现实的感受是，可以，但没必要。

  ```javascript
  const name1 = Symbol('name');
  const name2 = Symbol('name');
  const symbolObj = {
      [name1]: 'kyrie',
      [name2]: 'jody'
  };
  symbolObj[name1]; // 可以访问修改，但仅作访问用时，属实没必要
  ```

### Symbol应用场景

* 从上文的描述来看，似乎它只能用作数据存储了，甚至是比较适合查看，而不适合修改。那它就真没有场景可以使用了吗？那倒不至于。

#### 消除魔法字符串

* 在实际业务中，就有一个真实场景，例如某个详情页面的 tab 切换。
* 简单介绍下这里的业务逻辑，是在订单详情页面里，有几个 tab 需要展示，当切换到某一个 tab 比如物流轨迹的时候，需要特殊处理，调用获取轨迹接口。下面是原来的代码。

  ```javascript
  /**
    * 在订单物流轨迹 tab 下，需要获取物流轨迹
    * @param {String} activeTabKey
    */
  handleChangeTab = (activeTabKey) => {
      this.setState({ activeTabKey });

      if (activeTabKey !== 'logistic') { return; }

      this.getLogisticTrack(this.state.currentLogisticNo);
  }
  ```

  ```jsx
  <Tabs onChange={this.handleChangeTab} activeKey={this.state.activeTabKey}
      tabBarExtraContent={this.renderTitle()}
      type="card"
      data-rpno={RED_PILLS.TAB_CHANGE}
  >
      <TabPane tab="基本信息" key="detail" />
      <TabPane tab="物流信息" key="logistic" />
      <TabPane tab="交流版" key="issue" />
  </Tabs>
  ```

* 可以看到，不论是标题或是 `key`，都很适合使用 `symbol` 来标识，尤其是 `key`，它本身并无意义，只需保证它的唯一性，用 `symbol` 替换，可以以此消除逻辑与字符串之间的强耦合。
* 这里的改变很简单，只需定义一个对象来保持即可。

  ```javascript
  /**
   * 标签页对应 key
   */
  const TABS_SYMBOL = {
      detail: Symbol('detail'),
      logistic: Symbol('logistic'),
      issue: Symbol('issue'),
  };
  ```

* 相应的，render 和操作函数里都加上对应的变量值。

  ```javascript
  handleChangeTab = (activeTabKey) => {
      this.setState({ activeTabKey });

      if (activeTabKey !== TABS_SYMBOL.logistic) { return; }

      this.getLogisticTrack(this.state.currentLogisticNo);
  }
  ```

  ```jsx
  // render 内容 简写如下
  <TabPane tab="基本信息" key={TABS_SYMBOL.detail} />
  <TabPane tab="物流信息" key={TABS_SYMBOL.logistic} />
  <TabPane tab="交流版" key={TABS_SYMBOL.issue} />
  ```

* 这样，key 之间的耦合就消除了，我们仍可以做的再激进一点，把这里的 tab 标题也替换了。将这些属性当成是属性，不过这里仅作 symbol 当作属性的例子用，实际开发中这么做，后来的开发者可是会过来砍人的哟。

  ```javascript
  const detail = Symbol('detail');
  const logistic = Symbol('logistic');
  const issue = Symbol('issue');
  const tabTitle = {
      [detail]: '基本信息',
      [logistic]: '物流信息',
      [issue]: '交流版',
  };

  // render 内容 简写如下
  <TabPane tab={tabTitle[detail]} key={TABS_SYMBOL.detail} />
  <TabPane tab={tabTitle[logistic]} key={TABS_SYMBOL.logistic} />
  <TabPane tab={tabTitle[issue]} key={TABS_SYMBOL.issue} />
  ```

* 以上这段代码虽然有点多余，但是呢，还有一点借鉴意义。就是可以防止后来者更改这些属性，假如有个小伙伴觉得这个基本信息应该换个标题，而它又没有发现上面的变量，直接给这个属性重新赋值，这时是不会影响原有值的。

  ```javascript
  tabTitle[Symbol('detail')] = '详情信息';
  tabTitle[detail]; // 基本信息
  ```

* 或许这样写更加直观。

  ```javascript
  const tabTitle = {
      [Symbol('detail')]: '基本信息',
  };
  const newTabTitle = {
      [Symbol('detail')]: '详情信息',
  };
  const finalTabTitle = Object.assign({}, tabTitle, newTabTitle);
  // output: {Symbol(detail): "基本信息", Symbol(detail): "详情信息"}
  ```

* 看起来我们有了两个一样属性的不同值。只要它们都在，那么数据就是完好的。

### 小结

* 写到这里，似乎我有些明白了它为何不火。根本原因是它的适用场景，在前端应用的多数业务中，是较少的。保存实际数据的时候，防止数据键值重复，这看起来就像是要在前端保存一个小型数据库。而大多数时候，我们不需要去在前端系统里维护一个小型数据库。我们定义对象的时候，通常就知道了里面的属性，并且有轨迹可逊。至少这样看下来，只有消除魔法字符串这个场景，能在我们的实际业务场景中用到。当然，如果有其他比较经典的适用场景，也可以一并交流。
* 有关 `Symbol` 的介绍，其实这是一篇比较浅薄的入门，解决了一个微不足道但比较实际的问题。至于它的更多方法和应用，就有待读者大佬们自己发掘体验了，也可在评论区交流分享～

#### 参考

> [Symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol)
> [ES6中的Symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
> [Symbol in ES6](https://2ality.com/2014/12/es6-symbols.html)
> [阮一峰文档](https://es6.ruanyifeng.com/#docs/symbol)

<!--5.5h-->
