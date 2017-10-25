---
title: 理解 React 组件的生命周期
date: 2017-08-30 17:03:30
tags: React
categories: React
---

<hr/>

![](/jo.github.io/2017/08/30/react-component-lifecycle/unphoto.jpg)

近期 React 可谓是站在了风口浪尖上。某些大厂们纷纷开始抛弃它转而使用其他框架。但实际上，React 只手遮天的势力难以一时磨灭，我们这些小厂里的前端其实不必太过担心。真到了 React 末日的时候，这个世界也一定发生了巨变。所以，在当下，我们还是专注于当前，使用好 React. 于是我在这里总结了这大半年使用 React 的体验，主要是组件的生命周期和它常见的应用场景。

<!--more-->

## 生命周期钩子方法

### 组件的挂载阶段

* [constructor](#constructor)
* [componentWillMount](#componentWillMount)
* [render](#render)
* [componentDidMount](#componentDidMount)
* [componentWillUnmount](#componentWillUnmount)

#### constructor

* **执行阶段**：在开始 `render` 之前。
* 在这里进行 `state` 的初始化工作。但不要使用 `setState`.
* 还可以做一些事件绑定的工作。
* **Note**:
  * 如果既不绑定事件也不初始化 `state`, 那么其实可以不使用 `consturctor`.
  * 在少数情况下，`constructor` 中的 `state` 可以使用 `props` 来替代，但如果要达到状态随 `props` 改变的效果，最好使用状态提升来实现，因为 `state` 并不会随着 `props` 的改变而改变。

```javascript
  constructor(props){
    super(props)
    this.state = {
      type: props.initialType
    }
  }
```

#### componentWillMount

* **执行阶段**: 组件将要挂载的阶段。在 `render` 前调用，只会调用一次。
* 这里可能可以添加一些接口请求数据的逻辑，但在这里进行 state 的更新是异步的，它并不会触发 `re-render` 也就是 `render` 重新渲染。通常情况下，更推荐使用 `constructor` 来处理请求.
* **Note**: 如果要避免一些副作用，更好的办法是将这里面的逻辑放在 `componentDidMount` 里来处理。

#### render

* 渲染挂载组件。这步一定会执行的。
* 在正常状态下，该方法会返回以下几种类型的值：
  * React element: 最常见的返回。即使用 `JSX` 创建的原生 `DOM` 或自定义的组件例如 `<MyComponent/>`.
  * Protal: 使用 `ReactDOM.createPortal` 方法创建的对象。
  * Boolean: `bool && <div/>`, 当 `bool` 为 `false` 的时候，不渲染。
  * String|Number: 文本节点。
  * null: 不渲染。
* **Note**:
  * 该方法是纯函数，不应有 `setState` 的操作。每次渲染只会输出同一个值。如果有对状态的变更，应该是放在 `componentDidMount` 里。
  * 该方法是可以返回数组的，这样就可以返回多个对象。

```javascript
  render() {
    return [
      <div key="A">First<div/>
      <div key="B">Second<div/>
      <div key="C">Third<div/>
    ]
  }
```

#### componentDidMount

* 组件挂载完毕时即调用。生命周期内只会调用一次。
* **应用场景**：通常可以将请求后端数据—— ajax/fetch 放在这里。此时界面上 `DOM` 已经存在。可以做有关 `DOM` 的操作。例如 `findDOMNode`.
* **Note**: 在这里调用 `setState` 会进行一次额外的 `rendering`,虽然这会导致两次的 `render`, 但用户不会察觉这过度的时间。可能要多加考虑的地方是这会导致一定的性能问题。

#### componentWillUnmount

* **执行阶段**：当组件卸载的时候的回调函数。
* **应用场景**: 适用于清除定时器，取消请求等逻辑。
* **Note**: 这个函数回调适合销毁那些在 `componentDidMount` 里创建的方法。

### 更新阶段

* [componentWillReceiveProps](#componentWillReceiveProps)
* [componentShouldUpdate](#componentShouldUpdate)
* [componentWillUpdate](#componentWillUpdate)
* [render](#render)
* [componentDidUpdate](#componentDidUpdate)

#### componentWillReceiveProps

* `componentWillReceiveProps(nextProps)`
* **Note**:
  * 每次接收到新的 `props` 调用。注意这里是接收到 `props` 就调用，但 `props` 的值不一定就和原来的值不一样，有可能还是相同的。在某些情况下，这会造成重复渲染。
  * 在组件完全挂载后才会调用。在完全挂载之前是不会调用的。
  * 可以在这里比较 `props` 和 `nextProps`, 然后更新 `state`, 但 `setState` 不会触发该方法。

#### shouldComponentUpdate

* `shouldComponentUpdate(nextProps, nextState)`
* 当每次 `props` 或 `state` 更新时调用。在首次 `render` 之后的每次 `render` 之前执行。
* **Note**:
  * 该方法的返回值将会影响 `componentWillUpdate`、`render`、`componentDidUpdate` 的执行。但在未来这一点有可能会改变。
  * 可以在这里可以进行一些值是否相等的判断，但最好不要将对象，数组等判断放在这里，因为这可能会引起性能问题。

#### componentWillUpdate

* `componentWillUpdate(nextProps, nextState)`
* `shouldComponentUpdate` 方法返回 `true` 之后执行。
* **Note**:
  * 在这里不能调用 `setState` 方法，也不能进行 `redux` 的 `action`, 因为他会重复调用该方法。
  * 如果需要在 `state` 更新后操作 `props`, 把这部分逻辑放在 `componentWillReceiveProps`.

#### render

* 渲染挂载组件。

#### componentDidUpdate

* `componentDidUpdate(prevProps, prevState)`
* 在初次 `render` 以后的每次渲染之后执行。执行逻辑和 `componentWillUpdate` 一样，当 `shouldComponentUpdate` 返回 `false` 时不会执行。
* **应用场景**：该方法总是在 `DOM` 存在后才会执行，所以可以在这里进行一些操作 `DOM` 的逻辑。也可以在这里发起一些网络请求，但前提 `props` 发生了更改，否则可能也会引起性能问题。

#### componentDidCatch (16版本引进)

* `componentDidCatch(err, info)`
* 捕捉异常。
* `try/catch` 固然很好，但它会立即捕获异常。在 `React` 中，有时我们虽然遇到错误，但不希望影响挂载或渲染过程。所以统一在这个回调里进行处理。对用户来说，业务仍然是正常的，错误维护了 `React` 的生态，并不会影响组件挂载。
* `React` 组件都必须是纯函数，并禁止修改其自身 props.

##### *PS: 截止 9 月份，`React` 宣布将会随着 16 版本更新，修改原有的 `license`， 将原专利许可和 BSD 协议改为 MIT 协议。算是给这场风波一个较为圆满的结果。*

{% blockquote %}
  1.[react](https://devhints.io/react)
  2.[reactchectsheet](https://reactcheatsheet.com/)
  3.[reactjs](https://reactjs.org/docs/react-component.html)
{% endblockquote %}
