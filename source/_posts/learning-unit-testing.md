---
title: 单测入门笔记
date: 2018-06-29 10:02:28
tags: Unit-Testing
categories: Unit-Testing
---

<hr>

![](/jo.github.io/2018/06/29/learning-unit-testing/unphoto.jpeg)

以前因为技术氛围和开发需求等种种原因限制，还没有写过单元测试。近期入职一家技术氛围较好，并且推崇单测的公司。所以也有必要了解和熟悉下单测(单元测试)。

<!-- more -->

## 索引

- [单测是什么](#单测是什么)
- [单测框架概览](#单测框架概览)
- [上手 Jest](#上手Jest)
- [使用匹配器](#使用匹配器)
- [在 React 中使用](#在React中使用)
- [小结](#小结)

### 单测是什么

* 单测是至对程序中最小单元的验证和检查。具体化些，就是对一个模块，一个函数的验证。再应用到 React 项目中，通常是对 reducer 的验证。

### 单测框架概览

* js 的单测框架选择也并不少，常用的有 Mocha，Jest，Jasmine 等。最近的项目里主要是 Jest 和 Mocha，其中 Jest 更多。下面说下自己对这两者的区别的一些初步理解。
  * Mocha 是现在较为成熟，生态较完善的单测框架。
  * Jest 由 Facebook 出品，由 Jasmine 演化而来。相对 Mocha 诞生较晚，但背后有着 Facebook 的支持，可见生态社区也会越来越完善。而且和 React 搭配使用也会更友好。

### 上手[Jest](http://jestjs.io/docs/zh-Hans/getting-started)

* 项目中 Mocha 和 Jest 都有，但 Jest 似乎更多。目前准备写的也是应用了 Jest 的项目，所以准备先入门 Jest。
* 首先新建一个项目 unit-test 并初始化，然后安装相关依赖。

```shell
mkdir unit-test
npm init
npm install jest
```

* 在 package 中添加相应脚本。

```shell
scripts: {
  "test": "jest"
}
```

* 项目中已有了 Jest. 此时我们来测试一个简单的加法函数。
* 新建一个 index.js.

```javascript
function sum(a, b) {
  return a + b
}
module.exports = sum
```

* 再创建一个 index.test.js 用于验证。

```javascript
var sum = require('./index')
test('1 + 2 equals to 3', () => {
  expect(sum(1, 2)).toBe(3)
})
```

* 然后运行测试，观察输出。

```shell
npm run test
```

* 如果验证通过的话，可以在终端看到如下通过提示。

{% asset_img testing.png unit-testing %}

* 至此，一个简单的测试完成了。
* 不过通常情况下，我们会结合 ES6，React 使用，所以会配合上 Babel，需要安装其他依赖。

```shell
npm install babel-jest babel-core regenerator-runtime babel-presets-env babel-presets-react
```

* 然后添加一个 babel 配置文件 .babelrc.

```json
{
  "presets": ["env", "react"]
}
```

* 然后我们就可以使用 ES6 语法了。可以将原来的 `require`改为 `import`等。

### 使用匹配器

* 刚才我们使用 expect(sum(1, 2)) 来输出期望的值，再用 toBe 方法来比较值是否相等。这里 toBe 就是相应的匹配器。
* toBe 内部使用 Object.is 方法来判断，该方法和全等(===)判断类似，但略有不同。例如 Object.is 会区分 -0 和 +0，但不会区分 Number.NaN 和 NaN.

```javascript
Object.is(-0, 0) // false
-0 === 0 // true
Object.is(Number.NaN, NaN) // true
Number.NaN === NaN // false
```

* toBe 方法通常可以用来比较数字，字符串等基本类型。但如果要比较对象等引用类型。可以使用 toEqual,它会递归比较对象中的值。下面来试着使用下 toEqual 方法。

```javascript
test('比较对象相等', () => {
  const data = { a: 1, b: '2' }
  expect(data).toEqual({ a: 1, b: '2' })
})
```

* 相应的，在各类型中还有对应的方法，例如使用 `toBeNull` 来匹配 `null`，使用 `toBeCloseTo` 来匹配浮点数，使用 `toMatch` 来匹配正则字符串，使用 `toContain` 来匹配数组是否包含某项等等。这些都可在 `Jest` 官网上找到。

### 在React中使用

* 通过以上的内容，我们对单测有了一个比较初步的了解。
* 但在实际项目中，我们通常会在 React 中来使用 Jest。而在 React 中书写单测，通常是基于 Reducer 的。
* 下面来写一个 React 中的单测，假设我们有一个列表数据获取逻辑，然后我们要对它进行一个验证。
* 首先是 Reducer. 会有一个 reducer.js 文件

```javascript
// 初始数据
const initialState = {
  listData: {
    data: {}
  }
}
// reducer 将 listData 保存
export default function ListReducer(state = initialState, action) {
  switch(action.type) {
    case: 'LIST_DATA':
      return Object.assign({}, state, {
        listData: action.data
      })
  }
}
```

* 然后编写相应的单测。reducer.test.js

```javascript
import ListReducer from './reducer'

// mock 数据
const initialState = {
  listData: {
    data: {}
  }
}

// action
const listData = {
  type: 'LIST_DATA',
  listData: {
    data: {
      name: 'kyrie',
      age: 21
    }
  }
}

// 处理后的数据
const listDataReducer = {
  listData: {
    data: {
      name: 'kyrie',
      age: 21
    }
  }
}

test('获取列表', () => {
  const state = ListReducer(initialState, listData)
  expect(state).toEqual(listDataReducer)
})
```

* 当然，这里的例子非常简单，运行 `npm run test` 也能轻易通过。但在实际项目里，Reducer 的处理可能会复杂的多，相应的书写也会更加复杂。这是值得注意的。

### 小结

* 有些时候，项目里没有单测也能基本良好运行，就像我从前做过的项目一样。但这未必是好事。因为单测带来的，其实更多的是对业务的思考和设计。假如我们决定要写单测，那么在写该模块时，就应提前想到多个可能的场景，从而避免未知的错误，同时自己也会对当前业务有着更好的理解。另一方面，就像我现在所做的，其实通过写单测，可以去熟悉相应的业务模块，这会比直接阅读业务代码会更熟悉的多。

### TODO

* 异步处理的单测方法。
