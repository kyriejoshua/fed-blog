---
title: 单测入门笔记
date: 2018-06-29 10:02:28
tags: Unit-Testing
categories: Unit-Testing
---

<hr>

![](/2018/06/29/learning-unit-testing/unphoto.jpeg)

以前因为技术氛围和开发需求等种种原因限制，还没有写过单元测试。近期入职一家技术氛围较好，并且推崇单测的公司。所以也有必要了解和熟悉下单测(单元测试)。
推荐：★★★

<!-- more -->

## 索引

- [单测是什么](#单测是什么)
- [单测框架概览](#单测框架概览)
- [上手 Jest](#上手Jest)
- [断言](#断言)
- [使用匹配器](#使用匹配器)
- [测试异步代码](#测试异步代码)
  - [测试回调](#测试回调)
  - [测试Promise](#测试Promise)
  - [`.resolves/.rejects`](#resolves-rejects)
  - [async/await](#.resolves/.rejects)
- [在 React 中使用](#在React中使用)
- [小结](#小结)
- [Issues](#Issues)

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
  npm install babel-jest babel-core regenerator-runtime babel-preset-env babel-preset-react
  ```

* 然后添加一个 babel 配置文件 .babelrc.

  ```json
  {
    "presets": ["env", "react"]
  }
  ```

* 然后我们就可以使用 ES6 语法了。可以将原来的 `require` 改为 `import` 等。

### 断言

* 在上述的测试用例中，有一句断言 —— `expect(sum(1, 2)).toBe(2)`
* 实际上，在每个测试中，都至少有一句断言来判断执行结果是否与预期的一致。目前的断言库语义化都做的很好，如同上面这句话，很容易理解这是期望的结果和执行的结果的比较逻辑。
* 像常用的 Mocha 有着自己的断言库 Chai, 而 Jest 我目前还不确定是引用了什么断言库，看起来好像它本身就支持。
* 而断言的写法，也是以 `expect` 开头，然后以匹配器方法调用作为结果。包括下文提到的一些匹配器方法 `toEqual` 等等。

  ```javascript
  expect(func(..args)).toBe(res)
  expect(func(..args)).toEqual(obj)
  ```

### 使用匹配器

* 刚才我们使用 `expect(sum(1, 2))` 来输出期望的值，再用 `toBe` 方法来比较值是否相等。这里 `toBe` 就是相应的匹配器。
* `toBe` 内部使用 `Object.is` 方法来判断，该方法和全等(`===`)判断类似，但略有不同。例如 `Object.is` 会区分 -0 和 +0，但不会区分 `Number.NaN` 和 `NaN`.

  ```javascript
  Object.is(-0, 0) // false
  -0 === 0 // true
  Object.is(Number.NaN, NaN) // true
  Number.NaN === NaN // false
  ```

* `toBe` 方法通常可以用来比较数字，字符串等基本类型。但如果要比较对象等引用类型。可以使用 `toEqual`,它会递归比较对象中的值。下面来试着使用下 `toEqual` 方法。

  ```javascript
  test('比较对象相等', () => {
    const data = { a: 1, b: '2' }
    expect(data).toEqual({ a: 1, b: '2' })
  })
  ```

* 相应的，在各类型中还有对应的匹配器方法，例如使用 `toBeNull` 来匹配 `null`，使用 `toBeCloseTo` 来匹配浮点数，使用 `toMatch` 来匹配正则字符串，使用 `toContain` 来匹配数组是否包含某项等等。这些都可在 [Jest](http://jestjs.io/docs/zh-Hans/getting-started) 官网上找到。

### 测试异步代码

#### 测试回调

* 异步代码中常见的有测试回调，例如有 `fetchData` 的函数，传入 `callback` 回调函数。按照之前的理解，测试方式是这样的

  ```javascript
  function fetchData(callback) {
    const data = 'async data'
    callback(data)
  }
  // 有问题的写法
  test('测试回调', () => {
    function callback(data) {
      expect(callback(data)).toBe('async data')
    }
    fetchData(callback)
  })
  ```

* 由于 `fetchData` 的执行是异步的，所以当该测试执行完毕时，它还没有执行结束，也就无法测试。
* Jest 本身在测试回调函数时提供了一个参数用来标识内部函数是否执行行结束。

  ```javascript
  test('测试回调', (done) => {
    function callback(data) {
      expect(data).toBe('async data')
      done()
    }
    fetchData(callback)
  })
  ```

* 这样，当 `done` 函数执行结束时，测试才执行完毕。而如果 `done` 没有执行，那也意味着其中哪里出现了问题。

#### 测试Promise

* 同样的，这样测试 `Promise` 也无法生效，结果并不会报错。

  ```javascript
  function handleData(data) {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => resolve({ res: data.res + 1 }, 3000))
    })
  }
  // 错误示范
  test('测试 Promise 代码', () => {
    handleData({ res: 2 }).then((data) => {
      expect(data).toEqual({ res: 2 })
    })
  })
  ```

* 要测试 `Promise`, 只需要在 Jest 测试中返回一个 `Promise` 即可。

  ```javascript
  test('测试 Promise 代码', () => {
    return handleData({ res: 2 }).then((data) => {
      expect(data).toEqual({ res: 2 })
    })
  })
  ```

* 当然，`Promise` 还会有刻意测试错误的情况。于是我们想当然的又会觉得加上 `return` 就可以了。下面这段代码，我们来测试是否执行了 `reject` 方法，这时我们传入一个错误的参数再执行。

  ```javascript
  function handleDataReject(data) {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (Object.prototype.toString.call(data) !== '[object Object]') {
          reject('Type Error!!!')
        }
        resolve({ res: data.res + 1})
      }, 3000)
    })
  }
  test('测试 Promise reject 代码', () => {
    return handleDataReject('test rejected').catch((data) => {
      expect(data).toMatch('Type Error!!!')
    })
  })
  ```

* 这里确实执行通过了。但如果我们把一个正确的参数传进去，是否能验证错误的情况呢，答案是不会的。例如我们把刚刚的 **`test rejected`** 字符串改为 **`{ res: 1 }`** 作为参数传入的时候，其实也检测不出错误的执行。
* 因为在测试错误的情况的时候，`fulfilled` 状态也是不会在测试中被检出的。换句话说，当执行正确的时候，`Promise` 不会跑到 `catch` 后续这个函数中，也就会被检测通过。但这里我们需要测试的是异常的情况，所以必须还是需要补充上一句后续断言是否执行的语句 `expect.assertions(1)`。它并不会抛出测试的错误，但它会提示你有一句断言没有执行，这时候你就知道了，刚才那段对象作为参数执行的代码并没有走到 `catch` 函数中。

  ```javascript
  test('测试 Promise reject 代码', () => {
    expect.assertions(1)
    return handleDataReject('test rejected').catch((data) => {
      expect(data).toMatch('Type Error!!!')
    })
  })
  ```

#### `.resolves/.rejects`

* `.resolves/.rejects` 是对上述更简化的写法。

  ```javascript
  test('测试 resolves 代码', () => {
    expect.assertions(1)
    return expect(handleDataReject({ res: 1 })).resolves.toEqual({ res: 2 })
  })
  test('测试 rejects 代码', () => {
    expect.assertions(1)
    return expect(handleDataReject('test rejected')).rejects.toMatch('Type Error!!!')
  })
  ```

#### Async/Await

* 这里的用法其实与它们本身的用法类似。

  ```javascript
  test('测试 async 代码', async () => {
    expect.assertions(1)
    const data = await handleDataReject({ res: 1 })
    expect(data).toEqual({ res: 2 })
  })
  test('测试 async error 代码', async () => {
    expect.assertions(1)
    try {
      await handleDataReject('test rejected')
    } catch(e) {
      expect(e).toMatch('Type Error!!!')  
    }
  })
  ```

* 由于使用了同步写法，这时候不需要再 `return` 了。当然，我们还是可以使用 `.resolves/rejects` 来做一些写法上的优化。

  ```javascript
  test('测试 async 代码', async () => {
    expect.assertions(1)
    await expect(handleDataReject({ res: 1 })).resolves.toEqual({ res: 2 })
  })
  test('测试 async error 代码', async () => {
    expect.assertions(1)
    await expect(handleDataReject('test rejected')).rejects.toMatch('Type Error!!!')
  })
  ```

### 在React中使用

* 通过以上的内容，我们对单测有了一个比较初步的了解。
* 但在实际项目中，我们通常会在 React 中来使用 Jest。而在 React 中书写单测，自己接触较多的是基于 Reducer 的。
* 下面来写一个 React 中的单测，假设我们有一个列表数据获取逻辑(假设没有异步请求)，然后我们要对它进行一个验证。
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
          listStatus: 'success'
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
    },
    listStatus: 'success'
  }

  test('获取列表', () => {
    const state = ListReducer(initialState, listData)
    expect(state).toEqual(listDataReducer)
  })
  ```

* 当然，这里的例子非常简单，运行 `npm run test` 也能轻易通过。但在实际项目里，Reducer 的处理可能会复杂的多，相应的书写也会更加复杂。上述是一个单个的测试，真实项目中，或许是按模块来组织的。每个模块中有相应的多个 Reducer. 那就需要用到测试套件(test suite) —— `describe` 块，其中会含有多个测试用例(test case), 即 `it` 块。
* `describe` 函数的第一个参数是测试套件名，第二个是要执行的回调函数。
* `it` 函数同理，它作为独立的测试用例，是测试的最小单位。
* 于是整理后如下：

  ```javascript
  describe('获取列表模块测试', () => {
    it('获取列表', () => {
      const state = ListReducer(initialState, listData)
      expect(state).toEqual(listDataReducer)
    })
    it('获取列表失败', () => {
      // do sth
    })
    // 更多的测试用例
  })
  ```

* 整理后整个模块的内容都在 `describe` 套件内，组织起一个个测试用例。显而易见，这样更容易梳理和回顾。

### 小结

* 有些时候，项目里没有单测也能基本良好运行，就像我从前做过的项目一样。但这未必是好事。因为单测带来的，其实更多的是对业务的思考和设计。假如我们决定要写单测，那么在写该模块时，就应提前想到多个可能的场景，从而避免未知的错误，同时自己也会对当前业务有着更好的理解。另一方面，就像我现在所做的，其实通过写单测，可以去熟悉相应的业务模块的***所有场景***，这会比直接阅读业务代码会更熟悉的多。
* **上述代码对应的仓库 [unit-testing](https://github.com/kyriejoshua/unit-testing)**.

### [Issues](https://github.com/facebook/jest/issues)

#### 目前碰到的一些问题整理，基于 ^22.4.3.

1. 在运行 `npm run test` 时

  ```javascript
  import { Modal } from 'antd' // 这样引入时会报 CSS 相关的报错
  import Modal from 'antd/lib/modal' // 这样才不会报错
  import Modal from '../../../node_modules/antd/lib/modal' // 或者这样也不会报错
  ```

* 排查发现是 Jest 无法解析 CSS。搜索部分结果，有人给出了[方案](https://www.jianshu.com/p/bf8070c33824)，官方也提供了解决[方案](https://jestjs.io/docs/en/webpack)。目前发现可以解决。

##### TODO

* redux-mock-store 了解。

<hr>
{% asset_img reward.jpeg Thanks %}
