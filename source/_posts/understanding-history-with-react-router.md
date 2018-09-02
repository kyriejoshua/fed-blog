---
title: 理解 react-router 中的 history
date: 2018-07-29 21:47:38
tags: React-Router
categories: React
---

<hr>

![](/jo.github.io/2018/07/29/understanding-history-with-react-router/unphoto.jpg)

<!-- 实际时间: 2018-08-29 21:47:38 -->

对 `react-router` 的分析，目前准备主要集中在三点：
a. `history` 的分析
b. `react-router` 原理分析
c. `react-router` 内部匹配原理
这篇文章准备着重理解 `history`

<!-- more -->

## 索引

- [引子](#引子)
- [history核心](#history核心)
- [走进createBrowserHistory](#走进createBrowserHistory)
- [TODO](#TODO)

### 引子

* 一段显而易见出现在各大 react v16+ 项目中的代码是这样的

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

* 在 `react` v16+ 版本里，通常 `react-router` 也升级到了 4 以上
* 而 `react-router` v4+ 通常是配合 `history` 使用的
* 下面就先从 `history` 开始，让我们一步一步走近 `react-router` 的神秘世界

### history核心

* history v4.6+ 在内部主要导出了三个方法:
  * `createBrowserHistory`,`createHashHistory`,`createMemoryHistory`
  * 它们分别有着自己的作用:
    * `createBrowserHistory` 是为现代主流浏览器提供的 api
    * `createHashHistory` 是为不支持 `history` 功能的浏览器提供的 api
    * `createMemoryHistory` 则是为 `node` 环境提供的 api
  * 我们就先从最接地气的 `createBrowserHistory` 也就是我们上文中使用的方法开始看起

### 走进createBrowserHistory

* 话不多说，直接走进源码

  ```javascsript
  /**
   * Creates a history object that uses the HTML5 history API including
   * pushState, replaceState, and the popstate event.
   */
  ```
* 在它自己方法开始的注释里，它说明了是基于 H5 的 `history` 创建对象，对象内包括了一些常用的方法譬如
  * `pushState`,`replaceState`,`popstate` 等


* 那么它具体返回了什么对象呢，下面就是它目前所有的方法和属性

  ```javascript
    const globalHistory = window.history;
    const history = {
      length: globalHistory.length,
      action: "POP",
      location: initialLocation,
      createHref,
      push,
      replace,
      go,
      goBack,
      goForward,
      block,
      listen
    }
  ```
* `globalHistory.length` 显而易见是当前存的历史栈的数量
* `createHref` 根据根路径创建新路径，在根路径上添加原地址所带的 `search`, `pathname`, `path` 参数, 推测作用是将路径简化
* 其中，`go`,`goBack`,`goForward` 是对原生 `history.go` 的简单封装
* `push`, `replace` 方法则是原生方法的扩展，但相对逻辑较多，两者同样是跳转逻辑，而且内部有较多逻辑相同
* 这里以 `push` 为例, 它其实就是对原生的 `history.pushState` 做了判断和优化，具体的过渡实现则使用了 `transitionManager`(下文说明)

  ```javascript
    const push = (path, state) => {
      const action = "PUSH";
      const location = createLocation(path, state, createKey(), history.location);
      // 过渡内容
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

* 当做出浏览器动作时，会触发 `popstate` 事件, 也就是说，`popstate` 本身并不是像 `pushState` 或 `replaceState` 一样是 history 的方法
* 不能使用 `history.popState` 这样的方式来调用
* 而且，直接调用 `history.pushState` 或 `history.replaceState` 不会触发 popstate 事件
* 在事件监听方法 `listen` 中涉及了 `popstate` 的使用，在源码中可以看到以下两个方法
* `listen` 和 `checkDOMListeners`

  ```javascript
    const PopStateEvent = "popstate";
    const HashChangeEvent = "hashchange";
    const listen = listener => {
      const unlisten = transitionManager.appendListener(listener);
      checkDOMListeners(1);
      return () => {
        checkDOMListeners(-1);
        unlisten();
      };
    };
    const checkDOMListeners = delta => {
      listenerCount += delta;
      if (listenerCount === 1) {
        window.addEventListener(PopStateEvent, handlePopState);
        if (needsHashChangeListener)
          window.addEventListener(HashChangeEvent, handleHashChange);
      } else if (listenerCount === 0) {
        window.removeEventListener(PopStateEvent, handlePopState);
        if (needsHashChangeListener)
          window.removeEventListener(HashChangeEvent, handleHashChange);
      }
    };
  
  ```
* 因此，调用 `listen` 就是给 `window` 绑定了相应方法，再次调用之前 `listen` 返回的函数则是取消

* 以上几段代码中 `transitionManager` 对象出现了多次，在 `popstate` 相关方法中，它提供了 `appendListener` 方法
* 内部其实是和 `listen` 方法相似的绑定和解绑逻辑，调用是绑定箭头事件，返回一个解绑函数，该解绑函数再次调用的话就是解绑事件
* 其实这就是常见的订阅-发布模式，以下两个函数中，前者负责订阅事件，后者负责最终发布

  ```javascript
    let listeners = [];
    /**
     * [description 订阅事件]
     * @param  {Function} fn [description]
     * @return {Function}      [description]
     */
    const appendListener = fn => {
      let isActive = true;
      // 订阅事件，并做了函数柯里化处理，它实际上相当于运行了 `fn.apply(this, ...args)`
      const listener = (...args) => {
        if (isActive) fn(...args);
      };
      // 将监听函数一个个保存
      listeners.push(listener);
      return () => {
        isActive = false;
        listeners = listeners.filter(item => item !== listener);
      };
    };
    /**
     * [最终调用(发布)]
     * @param  {[type]} ..args [description]
     */
    const notifyListeners = (..args) => {
      listeners.forEach(listener => listener(..args))
    }
  ```

* 另一个使用的较多的方法 `confirmTransitionTo`

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
* 实际上执行的就是从外部传进来的 `callback` 方法，只是多了几层判断，而且传入了布尔值来控制是否需要真的执行回调函数

### 小结

* 写这篇文章的时候，第一次有感受到技术栈拓展的无穷。从最初想分析 `react-router`，到发现它依赖的主要的库 `history`. 再进行细化，到 `history` 主要提供的对象方法。里面涉及的发布订阅设计模式 ，思路，以及具体的实现使用了柯里化方式。一步一步探究下去可以发现很多有趣的地方。似乎又唤起往日热情。

### TODO

* 待完善
