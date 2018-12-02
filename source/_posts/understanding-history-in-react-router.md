---
title: 理解 react-router 中的 history
date: 2018-07-29 21:47:38
tags: React-Router
categories: React
---

<hr>

![](/jo.github.io/2018/07/29/understanding-history-in-react-router/unphoto.jpg)

<!-- 实际时间: 2018-08-29 21:47:38 -->

对 `react-router` 的分析，目前准备主要集中在三点：
a. `history` 的分析。
b. `react-router` 原理分析。
c. `react-router` 内部匹配原理。
这篇文章准备着重理解 `history`.
推荐：★★★☆

<!-- more -->

## 索引

- [引子](#引子)
- [history核心](#history核心)
- [走进createBrowserHistory](#走进createBrowserHistory)
- [history在react-router中](#history在react-router中)
- [小结](#小结)
- [坑](#坑)
- [参考](#参考)

### 引子

* 一段显而易见出现在各大 react v16+ 项目中的代码是这样的:

  ```javascript
  import React, {Component} from 'react'
  import { render } from 'react-dom'
  import AppRouter from './routes/'
  import { createBrowserHistory } from 'history'
  const history = createBrowserHistory()

  const App = () => (
    <AppRouter history={history} />
  )

  render(<App/>, document.body.querySelector('#app'))
  ```

* 在 `react` v16+ 版本里，通常 `react-router` 也升级到了 4 以上。
* 而 `react-router` v4+ 通常是配合 `history` 使用的。
* 下面就先从 `history` 开始，让我们一步一步走近 `react-router` 的神秘世界。

### history核心

* [*history源码*](https://github.com/ReactTraining/history)
* `history` v4.6+ 在内部主要导出了三个方法:
  * `createBrowserHistory`, `createHashHistory`, `createMemoryHistory`.
  * 它们分别有着自己的作用:
    * `createBrowserHistory` 是为现代主流且支持 HTML5 history 浏览器提供的 API.
    * `createHashHistory` 是为不支持 `history` 功能的浏览器提供的 API.
    * `createMemoryHistory` 则是为没有 DOM 环境例如 `node` 或 `React-Native` 或测试提供的 API.


  * 我们就先从最接地气的 `createBrowserHistory` 也就是我们上文中使用的方法开始看起。

### 走进createBrowserHistory

* 话不多说，直接走进[*createBrowserHistory源码*](https://github.com/ReactTraining/history/blob/v4.6.0/modules/createBrowserHistory.js)

  ```javascsript
  /**
   * Creates a history object that uses the HTML5 history API including
   * pushState, replaceState, and the popstate event.
   */
  ```
* 在方法开始的注释里，它说明了是基于 H5 的 `history` 创建对象，对象内包括了一些常用的方法譬如
  * `pushState`,`replaceState`,`popstate` 等

#### ***`history` 对象***

* 那么它具体返回了什么内容呢，下面就是它目前所有的方法和属性:

  ```javascript
    const globalHistory = window.history;
    const history = {
      length: globalHistory.length, // (number) The number of entries in the history stack
      action: "POP", // (string) The current action (`PUSH`, `REPLACE`, or `POP`)
      location: initialLocation, // (object) The current location. May have the following properties.
      createHref,
      push, // (function) Pushes a new entry onto the history stack
      replace, // (function) Replaces the current entry on the history stack
      go, // (function) Moves the pointer in the history stack by `n` entries
      goBack, // (function) Equivalent to `go(-1)`
      goForward, // (function) Equivalent to `go(1)`
      block, // (function) Prevents navigation
      listen
    }
  ```

* `globalHistory.length` 显而易见是当前存的历史栈的数量。
* `createHref` 根据根路径创建新路径，在根路径上添加原地址所带的 `search`, `pathname`, `path` 参数, 推测作用是将路径简化。
* `location` 当前的 `location`, 可能含有以下几个属性。
  * `path` - (string) 当前 `url` 的路径 `path`.
  * `search` - (string) 当前 `url` 的查询参数 `query string`.
  * `hash` - (string) 当前 `url` 的哈希值 `hash`.
  * `state` - - (object) 存储栈的内容。仅存在浏览器历史和内存历史中。
* `block` 阻止浏览器的默认导航。用于在用户离开页面前弹窗提示用户相应内容。[the history docs](https://github.com/ReactTraining/history#blocking-transitions)
* 其中，`go`/`goBack`/`goForward` 是对原生 `history.go` 的简单封装。
* 剩下的方法相对复杂些，因此在介绍 `push`, `replace` 等方法之前，先来了解下 `transitionManager`. 因为下面的很多实现，都用到了这个对象所提供的方法。

#### ***[`transitionManager`](https://github.com/ReactTraining/history/blob/v4.6.0/modules/createTransitionManager.js?1543756692194) 方法***

* 首先看下该对象返回了哪些方法：
  ```javascript
  const transitionManager = {
    setPrompt,
    confirmTransitionTo,
    appendListener,
    notifyListeners
  }
  ```
* 在后续 `popstate` 相关方法中，它就应用了 `appendListener` 和与之有关的 `notifyListeners` 方法，我们就先从这些方法看起。
* 它们的设计体现了常见的订阅-发布模式，前者负责实现订阅事件逻辑，后者负责最终发布逻辑。

  ```javascript
    let listeners = [];
    /**
     * [description 订阅事件]
     * @param  {Function} fn [description]
     * @return {Function}      [description]
     */
    const appendListener = fn => {
      let isActive = true;
      // 订阅事件，做了函数柯里化处理，它实际上相当于运行了 `fn.apply(this, ...args)`
      const listener = (...args) => {
        if (isActive) fn(...args);
      };
      // 将监听函数一一保存
      listeners.push(listener);
      return () => {
        isActive = false;
        listeners = listeners.filter(item => item !== listener);
      };
    };
    /**
     * [发布逻辑]
     * @param  {[type]} ..args [description]
     */
    const notifyListeners = (..args) => {
      listeners.forEach(listener => listener(..args))
    }
  ```

* 介绍了上面两个方法的定义，先别急。后续再介绍它们的具体应用。
* 然后来看看另一个使用的较多的方法 `confirmTransitionTo`.

  ```javascript
    const confirmTransitionTo = (
      location,
      action,
      getUserConfirmation,
      callback
    ) => {
      if (prompt != null) {
        const result =
          typeof prompt === "function" ? prompt(location, action) : prompt;
        if (typeof result === "string") {
          if (typeof getUserConfirmation === "function") {
            getUserConfirmation(result, callback);
          } else {
            callback(true);
          }
        } else {
          // Return false from a transition hook to cancel the transition.
          // 如果已经在执行，则暂时停止执行
          callback(result !== false);
        }
      } else {
        callback(true);
      }
    };
  ```

* 实际上执行的就是从外部传进来的 `callback` 方法，只是多了几层判断来做校验，而且传入了布尔值来控制是否需要真的执行回调函数。

#### ***`transitionManager` 调用***

* 再然后我们来看看上述方法`appendListener`, `notifyListeners` 的具体应用。前者体现在了 `popstate` 事件的订阅中。
* 那么就先简单谈谈 [**`popstate`**](https://developer.mozilla.org/zh-CN/docs/Web/Events/popstate) 事件。
  * 当做出浏览器动作时，会触发 `popstate` 事件, 也就是说，`popstate` 本身并不是像 `pushState` 或 `replaceState` 一样是 `history` 的方法。
  * 不能使用 `history.popState` 这样的方式来调用。
  * 而且，直接调用 `history.pushState` 或 `history.replaceState` 不会触发 `popstate` 事件。


* 在事件监听方法 `listen` 中涉及了 `popstate` 的使用，在源码中可以看到以下两个方法 `listen` 和 `checkDOMListeners`.
* 它们就是上述订阅事件的具体调用方。

  ```javascript
    // 首先自然是初始化
    const transitionManager = createTransitionManager();
    const PopStateEvent = "popstate";
    const HashChangeEvent = "hashchange";

    // 当 URL 的片段标识符更改时，将触发 hashchange 事件（跟在 # 后面的部分，包括 # 符号）
    // https://developer.mozilla.org/zh-CN/docs/Web/Events/hashchange
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onhashchange
    const checkDOMListeners = delta => {
      listenerCount += delta;
      if (listenerCount === 1) {
        // 其实也是最常见最简单的订阅事件
        window.addEventListener(PopStateEvent, handlePopState);
        if (needsHashChangeListener)
          window.addEventListener(HashChangeEvent, handleHashChange);
      } else if (listenerCount === 0) {
        window.removeEventListener(PopStateEvent, handlePopState);
        if (needsHashChangeListener)
          window.removeEventListener(HashChangeEvent, handleHashChange);
      }
    };

    /**
     * [订阅事件的具体调用方]
     * @param  {Function} listener [description]
     * @return {Function}          [description]
     */
    const listen = listener => {
      // 返回一个解绑函数
      const unlisten = transitionManager.appendListener(listener);
      checkDOMListeners(1);
      // 返回的函数负责取消
      return () => {
        checkDOMListeners(-1);
        unlisten();
      };
    };
  ```
* 简言之，调用 `listen` 就是给 `window` 绑定了相应方法，再次调用之前 `listen` 返回的函数则是取消。
* 然后来看看发布事件的具体调用方。

  ```javascript
  // 在该方法中最终发布
  const setState = nextState => {
    Object.assign(history, nextState);
    history.length = globalHistory.length;
    // 执行所有的监听函数
    transitionManager.notifyListeners(history.location, history.action);
  };
  ```

* 下面的方法则应用了 `confirmTransitionTo`.
* `push`, `replace`  是原生方法的扩展，它们都用到了上述方法，都负责实现跳转，因此内部有较多逻辑相同。
* 后面会以 `push` 为例, 它其实就是对原生的 `history.pushState` 的强化。
* 这里先从原生的 `history.pushState` 开始了解。
* [**`history.pushState`**](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API) 接收三个参数，第一个为状态对象，第二个为标题，第三个为 Url.
  * 状态对象：一个可序列化的对象，且序列化后小于 640k. 否则该方法会抛出异常。（暂时不知这对象可以拿来做什么用，或许 `react-router` 用来标识页面的变化，以此渲染组件）
  * 标题(目前被忽略)：给页面添加标题。目前使用空字符串作为参数是安全的，未来则是不安全的。Firefox 目前还未实现它。
  * URL(可选)：新的历史 URL 记录。直接调用并不会加载它，但在其他情况下，重新打开浏览器或者刷新时会加载新页面。
  * 一个正常的调用是 `history.pushState({ foo: 'bar'}, 'page1', 'bar.html')`.
  * 调用后浏览器的 url 会立即更新，但页面并不会重新加载。例如 www.google.com 变更为 www.google.com/bar.html. 但页面不会刷新。
  * 注意，此时并不会调用 `popstate` 事件。只有在上述操作后，访问了其他页面，然后点击返回，或者调用 `history.go(-1)/history.back()` 时，`popstate` 会被触发。
  * 让我们在代码中更直观的看吧。

  ```javascript
  // 定义一个 popstate 事件
  window.onpopstate = function(event) {
    console.info(event.state)
  }
  let page1 = { page: 'page1' }
  let page2 = { page: 'page2' }
  history.pushState(page1, 'page1', 'page1.html')
  // 页面地址由 www.google.com => www.google.com/page1.html
  // 但不会刷新或重新渲染
  history.pushState(page2, 'page2', 'page2.html')
  // 页面地址由 www.google.com/page2.html => www.google.com/page2.html
  // 但不会刷新或重新渲染
  // 此时执行
  history.back() // history.go(-1)
  // 会触发 popstate 事件, 打印出 page1 对象
  // { page: 'page1' }
  ```

* 介绍完 `pushState` 后，看看 `history` 中是怎样实现它的。

  ```javascript
    const push = (path, state) => {
      const action = "PUSH";
      const location = createLocation(path, state, createKey(), history.location);
      // 过渡方法的应用
      transitionManager.confirmTransitionTo(
        location,
        action,
        getUserConfirmation,
        ok => {
           // 布尔值，用于判断是否需要执行
          if (!ok) return;
          const href = createHref(location);
          const { key, state } = location;
          // 在支持 history 的地方则使用 history.pushState 方法实现
          if (canUseHistory) {
            globalHistory.pushState({ key, state }, null, href);
          } else {
            window.location.href = href;
          }
        }
      );
    };
  ```

* `pushState` 和 `push` 方法讲完，`replaceState` 和 `replace` 也就很好理解了。
* [**`replaceState`**](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API) 只是把推进栈的方式改为替换栈的行为。它接收的参数与 `pushState` 完全相同。只是调用后方法执行的效果不同。

### history在react-router中

* 这篇文章快完成的时候，我才发现 `react-router` 仓库里是有 `history` 的介绍的。此时我一脸茫然。这里面内容虽然不多，却非常值得参考。这里做部分翻译和理解，当作对上文的补充。
* [原地址](https://raw.githubusercontent.com/ReactTraining/react-router/master/packages/react-router/docs/api/history.md)

##### ***`history is mutable`***

* 在原文档中，说明了 `history` 对象是可变的。因此建议在 `react-router` 中获取 [`location`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/location.md) 时可以使用 [`Route`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Route.md) 的 `props` 的方式来替代 `history.location` 的方式。这样的方式会确保你的流程处于 `React` 的生命周期中。例如：

  ```jsx
  class Comp extends React.Component {
    componentWillReceiveProps(nextProps) {
      // 正确的打开方式
      const locationChanged = nextProps.location !== this.props.location

      // 错误的打开方式，因为 history 是可变的，所以这里总是不等的 // will *always* be false because history is mutable.
      const locationChanged = nextProps.history.location !== this.props.history.location
    }
  }

  <Route component={Comp}/>
  ```

* 更多内容请查看[the history documentation](https://github.com/ReactTraining/history#properties).

### 小结

* 一句话形容 `history` 这个库。它是一个对 HTML5 原生 `history` 的拓展，它对外输出三个方法，用以在支持原生 api 的环境和不兼容的环境，还有 node 环境中调用。而该方法返回的就是一个增强的 `history` api.
* 写这篇文章的时候，第一次有感受到技术栈拓展的无穷。从最初想分析 `react-router`，到发现它依赖的主要的库 `history`. 再进行细化，到 `history` 主要提供的对象方法。里面涉及的发布订阅设计模式 ，思路，以及具体的实现使用了柯里化方式。一步一步探究下去可以发现很多有趣的地方。似乎又唤起往日热情。
* 下一篇文章将会继续介绍 `react-router`.

### 坑

* 下面两个方法返回的内容和 `createBrowserHistory` 基本一致，只是具体的实现有部分差别。有时间补上。
* `createHashHistory`
* `createMemoryHistory`

### 参考

{% blockquote %}
[react-router 的实现原理](http://zhenhua-lee.github.io/react/history.html)
[react-router 源代码学习笔记
](https://juejin.im/entry/5accc0b4f265da23a1423cba)
[Javascript设计模式之发布-订阅模式](https://juejin.im/post/5a9108b6f265da4e7527b1a4)
{% endblockquote %}

<hr>
{% asset_img reward.jpeg Thanks %}

<!-- 4h + 2h + 0.5h -->
