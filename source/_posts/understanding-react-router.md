---
title: 浅谈 react-router 实现原理
date: 2019-01-03 21:59:22
tags: React-Router
categories: React
---

<hr>

![](/2019/01/03/understanding-react-router/unphoto.jpg)

从[上篇文章](/2018/07/29/understanding-history-in-react-router)可以知道，`react-router` 本质上，利用了 `history api` 的 `pushState`, `replaceState` 方法来控制路由地址，然后使用 `popstate`, `hashchange` 事件来监听变化，从而做出相应的视图变化。这篇文章要讲的，就是视图变化的逻辑这部分。
推荐：★★★★

<!-- more -->

## 索引

- [引子](#引子)
- [组件](#组件)
  - [Link](#Link)
  - [Router](#Router)
  - [Router](#Router)
  - [Route](#Route)
  - [Switch](#Switch)
  - [withRouter](#withRouter)
- [react-router与react-router-dom](#react-router与react-router-dom)
- [小结](#小结)
- [遗留的坑](#遗留的坑)
- [参考](#参考)

### 引子

* 如上所说，其实在 `history` 与 `react-router` 之间，核心就差了视图如何变化的逻辑部分。
* 在了解到内部原理之前，我理解的流程图是这样的。

{% asset_img react-router.png %}

* 接下来我们来慢慢找出这剩余的部分。然后来看看和最初的印象有什么不同。
* 注意：这里的所有代码均基于 [`react-router`](https://github.com/ReactTraining/react-router/tree/v4.2.2) 的 v4+ 版本。

### 组件

* 我最初的想法是查看调用栈来观察路由和视图的变化关系。于是写了一个组件，点击事件调用 `pushState`/`replaceState` 方法来手动更新浏览器地址，但是却发现，不会有什么变化。其实这符合预期，这个方法本身就只会更新地址，而不会更新页面，不会让页面重新加载。

* 因此，让我们还是从组件入手。

* 从[这里](https://github.com/ReactTraining/react-router/tree/v4.2.2/packages/react-router-dom/modules)可以看到有许多组件。我们着重分析其中的 `Link`、`Router`、`Route`、`Switch`. 剩余的也就顺理成章去理解了。

#### [Link](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router-dom/modules/Link.js)

* `Link` 是 `react-router-dom` 提供的一个组件。用来实现路由间的切换。至于 `react-router-dom` 和 `react-router` 的关系后文会说。

* 那为什么 `Link` 就可以轻松做到跳转呢。让我们一步步来看 `Link` 里都有什么。

* 打印出 `Link`，简化后，主要是以下的部分。

  ```javascript
  /**
   * The public API for rendering a history-aware <a>.
   */
  class Link extends React.Component {
    static defaultProps = {
      replace: false
    }

    // 参数都是必传的
    static contextTypes = {
      router: PropTypes.shape({
        history: PropTypes.shape({
          push: PropTypes.func.isRequired,
          replace: PropTypes.func.isRequired,
          createHref: PropTypes.func.isRequired
        }).isRequired
      }).isRequired
    }

    handleClick = (event) => {
      if (this.props.onClick)
        this.props.onClick(event)

      if (
        !event.defaultPrevented && // onClick prevented default
        event.button === 0 && // ignore right clicks
        !this.props.target && // let browser handle "target=_blank" etc.
        !isModifiedEvent(event) // ignore clicks with modifier keys
      ) {
        event.preventDefault()

        const { history } = this.context.router
        const { replace, to } = this.props

        if (replace) {
          history.replace(to)
        } else {
          history.push(to)
        }
      }
    }

    render() {
      const { replace, to, innerRef, ...props } = this.props // eslint-disable-line no-unused-vars

      const href = this.context.router.history.createHref(
        typeof to === 'string' ? { pathname: to } : to
      )

      return <a {...props} onClick={this.handleClick} href={href} ref={innerRef}/>
    }
  }
  ```

* 可以很明确的看到，`Link` 标签本质上返回的是 `a` 标签。只是对 `onClick` 方法做了处理。

* 而在 `click` 方法里，最主要的处理就是**禁用默认事件**，也就是阻止 `a` 标签默认的跳转 `href` 的行为。避免直接跳转页面。然后使用 `history` 的 `push`(`pushState`) 和 `replace`(`replaceState`) 方法进行跳转。

* **`push` 方法里除了核心的 `pushState` 逻辑，还有另一个核心操作 `setState`.** [详情可见](https://github.com/ReactTraining/history/blob/v4.6.0/modules/createBrowserHistory.js) 在它的逻辑里，它调用了之前注册的方法。后文会提到。

* 这里的 `history` 就是上篇文章分析的 `history`，只不过在 `react-router` 库里，它被当成 `props` 的部分，由最上层往下传递。至于为何这样做，是可以更好的管理 `history`, 和在组件里进行 `diff` 比对从而去做其他处理。上篇文末有说明。

* 然后观察传入给 `a` 的参数 `to`. 它接受 `String` 或者 `Object`. 通常我们会以 `String` 的形式传入。但最终它会被包装成类似 `{ pathname: to }` 这样的格式。

* 其实这个组件本质上做的事情，和我们在引子里理解的内容类似。基于 `history` 的操作，那么接收方是如何去根据变化而渲染组件的呢。来看看其他的重要组件。

* [**Link 文档**](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router-dom/docs/api/Link.md?1546863412144)

#### [Router](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/modules/Router.js)

* `Router` 是 `react-router` 里最常用的组件之一，它接收 `history` 和 `children` 两个参数。

* 这个组件属于较底层的组件，实际应用的时候可能会使用基于它扩展后的组件，来应对不同场景下的需求。例如在官方文档里，列举了以下几个具体的组件。
  * [`<BrowserRouter>`](../../../react-router-dom/docs/api/BrowserRouter.md)
  * [`<HashRouter>`](../../../react-router-dom/docs/api/HashRouter.md)
  * [`<MemoryRouter>`](./MemoryRouter.md)
  * [`<NativeRouter>`](../../../react-router-native/docs/api/NativeRouter.md)
  * [`<StaticRouter>`](./StaticRouter.md)
  * `BrowserRouter` 是在现代浏览器里使用较多的组件，它在支持 `HTML5` 的 `history API` 的地方使用。通过独立的包 `react-router-dom` 提供。其余组件做的事情类似，只是使用方式略有不同，这里不再赘述。
  * [**这里是具体的文档**](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/docs/api/Router.md)
<span></span>
<span></span>

* 通常情况下，`Router` 作为父组件，包裹着 `Route` 和 `Switch` 等组件。

* 观察它的源码。它本质上也是 `React` 组件。在渲染的时候，注册监听了事件。下文细说。

  ```javascript
  /**
   * The public API for putting history on context.
   */
  class Router extends React.Component {
    static propTypes = {
      history: PropTypes.object.isRequired,
      children: PropTypes.node
    }

    static contextTypes = {
      router: PropTypes.object
    }

    static childContextTypes = {
      router: PropTypes.object.isRequired
    }

    getChildContext() {
      return {
        router: {
          ...this.context.router,
          history: this.props.history,
          route: {
            location: this.props.history.location,
            match: this.state.match
          }
        }
      }
    }

    state = {
      match: this.computeMatch(this.props.history.location.pathname)
    }

    computeMatch(pathname) {
      return {
        path: '/',
        url: '/',
        params: {},
        isExact: pathname === '/'
      }
    }

    componentWillMount() {
      const { children, history } = this.props
      // Do this here so we can setState when a <Redirect> changes the
      // location in componentWillMount. This happens e.g. when doing
      // server rendering using a <StaticRouter>.
      this.unlisten = history.listen(() => {
        this.setState({
          match: this.computeMatch(history.location.pathname)
        })
      })
    }

    componentWillUnmount() {
      this.unlisten()
    }

    render() {
      const { children } = this.props
      return children ? React.Children.only(children) : null
    }
  }

  export default Router
  ```

* 在静态 `props` 里可以看到，`history` 是必须的。印证了我们的常规用法。生成 `history` 后再作为上下文传入组件内，向下传递给子组件。`<Router history={history}>`

* 然后在生命周期 `componentWillMount` 里，使用 `history.listen` 注册了 `setState` 事件。当路由变化时，会自动触发 `history` 内的 `setState` 事件，进而触发当前传入的更新 `state` 的事件。原理就是上文的 `Link` 的内部逻辑，加上之前分析的 `history` 的 `push` 方法里的逻辑和事件订阅发布逻辑。
  * 注意这里，使用箭头函数保证 `this` 的指向仍是 `Router`.
  * 当 `Link` 点击事件触发时，实际上调用的是当前的 `this.setState({ match: this.computeMatch(history.location.pathname) })` 方法。
  * 此时返回的 `match` 是形如 `{ path: '/', url: '/', params: {}, isExact: pathname === '/'}` 的对象。


* 这就一部分解释了为什么 `Link` 里，点击后的事件，会导致当前 `Router` 的 `state` 的变化，进而改变 `context.router` 里的内容。然后将此传递给子组件 `Route`.

* 然后它返回一个解绑函数。在组件卸载 `componentWillUnmount` 时调用 `unlisten` 卸载。

* *到这里，这就是动作变化引起视图变化的核心逻辑了。接下来是，视图如何根据传入的值匹配应当显示的组件。*

* [**context.router 的简单介绍**](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/docs/api/context.router.md)

#### [Route](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/modules/Route.js)

* 首先了解下基本的用法。`Route` 组件是允许传入几种不同类型的值的。

* [**文档**](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/docs/api/Route.md)

* **`component`**: 直接将组件传入。当路由匹配的时候才会渲染，将 `props` 作为参数传入，然后创建元素。
  * `<Route path='/' exact component={Main}/>`
  * 创建方式：`React.createElement(props)`

<span></span>

* **`render`**: 返回一个函数，可以直接是包装后的组件，或者直接是元素。直接调用。
  * `<Route path='/home' render={() => <Home/>} />`
  * 创建方式：`render(props)`

<span></span>

* **`children`**: 一个函数，和 `render` 类似。但它在任何情况下，只要传入值就会渲染。它接收的 `props` 和其他方式相同，除了在不匹配的情况下，`match` 的值为 `null` 这点不同。它的业务场景，可能是用于一些固定显示在页面的组件，然后通过 `match` 的值来控制样式。

* 以下是简化的 `Route` 源码。

  ```javascript
  import matchPath from './matchPath'

  /**
   * The public API for matching a single path and rendering.
   */
  class Route extends React.Component {
    static contextTypes = {
      router: PropTypes.shape({
        history: PropTypes.object.isRequired,
        route: PropTypes.object.isRequired,
        staticContext: PropTypes.object
      })
    }

    getChildContext() {
      return {
        router: {
          ...this.context.router,
          route: {
            location: this.props.location || this.context.router.route.location,
            match: this.state.match
          }
        }
      }
    }

    state = {
      match: this.computeMatch(this.props, this.context.router)
    }

    computeMatch({ computedMatch, location, path, strict, exact, sensitive }, router) {
      if (computedMatch)
        return computedMatch // <Switch> already computed the match for us

      const { route } = router
      const pathname = (location || route.location).pathname

      return path ? matchPath(pathname, { path, strict, exact, sensitive }) : route.match
    }

    componentWillReceiveProps(nextProps, nextContext) {
      this.setState({
        match: this.computeMatch(nextProps, nextContext.router)
      })
    }

    render() {
      const { match } = this.state
      const { children, component, render } = this.props
      const { history, route, staticContext } = this.context.router
      const location = this.props.location || route.location
      const props = { match, location, history, staticContext }

      return (
        component ? ( // component prop gets first priority, only called if there's a match
          match ? React.createElement(component, props) : null
        ) : render ? ( // render prop is next, only called if there's a match
          match ? render(props) : null
        ) : children ? ( // children come last, always called
          typeof children === 'function' ? (
            children(props)
          ) : !isEmptyChildren(children) ? (
            React.Children.only(children)
          ) : (
            null
          )
        ) : (
          null
        )
      )
    }
  }

  export default Route
  ```

* 在 `Route` 组件里，首先我们看到 `render` 里，由组件的内容类型来决定渲染是 `component` 或 `render` 或 `children`. 然后由 `this.state.match` 这个字段决定了当前的元素是否渲染。

* 接着在上述源码里，`this.state.macth` 字段是在 `componentWillReceiveProps` 和初始化里可以看到。而这个变量，由一个比较重要的函数 `computeMatch` 返回。它是用来对比当前路由是否匹配，依此来决定渲染组件或者不渲染。它的具体的值下文会讲到。

* `computeMatch` 接收 `nextProps` 和 `context.router` 作为参数。首先判断是否处于 `Switch` 组件中，如果在其中，则直接走 `Switch` 安排的逻辑，它有着自己的一套计算匹配逻辑。否则，则继续判断。

* 接下来的核心判断，是获取 `pathname`, 通过 `props.location` || `context.router.route.pathname` 获取。然后将其作为参数，传入另一个重要方法 `matchPath` 中，做计算匹配的逻辑。

* 当然，有一些参数作为辅助判断，例如 `exact` `sensitive` `strict`等。

* `matchPath` 是外部引入的，独立的一个文件包装的方法。可以直接看源码。

* [**`matchPath`源码**](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/modules/matchPath.js)和[**文档**](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/docs/api/matchPath.md)

  ```javascript
  import pathToRegexp from 'path-to-regexp'

  const patternCache = {}
  const cacheLimit = 10000
  let cacheCount = 0

  const compilePath = (pattern, options) => {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`
    const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {})

    if (cache[pattern])
      return cache[pattern]

    const keys = []
    const re = pathToRegexp(pattern, keys, options)
    const compiledPattern = { re, keys }

    if (cacheCount < cacheLimit) {
      cache[pattern] = compiledPattern
      cacheCount++
    }

    return compiledPattern
  }

  /**
   * Public API for matching a URL pathname to a path pattern.
   */
  const matchPath = (pathname, options = {}) => {
    if (typeof options === 'string')
      options = { path: options }

    const { path = '/', exact = false, strict = false, sensitive = false } = options
    const { re, keys } = compilePath(path, { end: exact, strict, sensitive })
    const match = re.exec(pathname)

    if (!match)
      return null

    const [ url, ...values ] = match
    const isExact = pathname === url

    if (exact && !isExact)
      return null

    return {
      path, // the path pattern used to match
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index]
        return memo
      }, {})
    }
  }

  export default matchPath
  ```

* **`matchPath` 通过返回一个对象，来确定路由是否匹配。(官方文档有关于这个对象的介绍[match](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/docs/api/match.md))如果匹配，则返回一个包含 `path`, `url`, `isExact`, `params` 等属性的对象。否则，则返回 `null`.**
* **判断的主要逻辑是通过正则。**
* 引入了外部的独立的库 [**`path-to-regexp`**](https://github.com/pillarjs/path-to-regexp) 来将地址转化成正则。
  * `compilePath` 方法里： `const re = pathToRegexp(pattern, keys, options)`
  * `const { re, keys } = compilePath(path, { end: exact, strict, sensitive })`
  * `const match = re.exec(pathname)`
  * **这里的返回对象，最终在 `Route` 组件的 `render` 中起到了决定性的作用。每一个 `Route` 都会根据这个 `match` 对象来判断，符合则渲染，不符合则返回 `null`.**

<span></span>
* 可以看到，除了上述常规判断以外，加了一层缓存逻辑。`cache[pattern]` 保存了上次的记录。而且属性名也很奇怪，类似 `truefalsefalse` 的形式。这里暂未理解。

#### [Switch](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/modules/Switch.js?1546508592999)

* 观察 `Switch` 的源码可以发现，它本质上也是调用了 `matchPath` 来判断匹配结果。
* [**这里是文档**](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/docs/api/Switch.md?1546863502437)

  ```javascript
  import matchPath from './matchPath'

  /**
   * The public API for rendering the first <Route> that matches.
   */
  class Switch extends React.Component {
    static contextTypes = {
      router: PropTypes.shape({
        route: PropTypes.object.isRequired
      }).isRequired
    }

    render() {
      const { route } = this.context.router
      const { children } = this.props
      const location = this.props.location || route.location

      let match, child
      React.Children.forEach(children, element => {
        if (!React.isValidElement(element)) return

        const { path: pathProp, exact, strict, sensitive, from } = element.props
        const path = pathProp || from

        if (match == null) {
          child = element
          match = path ? matchPath(location.pathname, { path, exact, strict, sensitive }) : route.match
        }
      })

      return match ? React.cloneElement(child, { location, computedMatch: match }) : null
    }
  }

  export default Switch
  ```

### [withRouter](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/modules/withRouter.js?1546862447071)

* `withRouter` 是一个高阶组件。个人理解，它比较像是 `react-redux` 的 `Provider` 组件。它将原生的组件传入，然后通过 `Route` 包装，沿用 `props` 当前的组件，返回这个包装后的组件。

  ```javascript
  import hoistStatics from 'hoist-non-react-statics'
  import Route from './Route'
  /**
  * A public higher-order component to access the imperative API
  */
  const withRouter = (Component) => {
    const C = (props) => {
      const { wrappedComponentRef, ...remainingProps } = props
      return (
        <Route render={routeComponentProps => (
          <Component {...remainingProps} {...routeComponentProps} ref={wrappedComponentRef}/>
        )}/>
      )
    }

    C.displayName = `withRouter(${Component.displayName || Component.name})`
    C.WrappedComponent = Component
    C.propTypes = {
      wrappedComponentRef: PropTypes.func
    }

    return hoistStatics(C, Component)
  }

  export default withRouter
  ```

* 目前在项目中我还没有用到它，等用到的时候，再来补充下具体的使用场景。
* [**这里是文档**](https://github.com/ReactTraining/react-router/blob/v4.2.2/packages/react-router/docs/api/withRouter.md?1546862742594)

#### `react-router`与`react-router-dom`

* 好了，现在来补充这两个库的不同。
* `react-router` 是一个底层的库，任何其他的基于 `React` 的路由库都基于它。但是在实际应用中，我们可能要对不同的场景做一些细分，以便更好地使用它们。
* 于是，就有了为现代浏览器提供的 `react-router-dom`. 观察代码可以发现，它的核心组件，例如 `Route`、`Switch`、`withRouter` 都是从 `react-router` 直接引入的。
* 除此之外，自然还有在 `React-Native` 中使用的 `react-router-native`, 以及结合 `redux` 使用的 `react-router-redux` 等等。

### 小结

* 在了解完这么多组件的内容和原理后，相信我们对于 `react-router` 的实现，有了一定的清晰思路了。我们会发现，最终总结的和最初理解的不一样。其实就是自己的理解在一开始是不完善的，甚至有些误解。这个时候，让我们再把流程图再重新梳理，画一遍。下面是简略的更新逻辑过程。

{% asset_img react-router-road.png %}

* 下面是一张调用栈的图，或许可以更直观地展示调用了哪些方法调用以及他们的执行顺序。

{% asset_img react-router-stack.png %}

### 遗漏的坑

* 到此，相关的主要逻辑就解释完毕了。
* 以下是遗留的几个待完成的 TODO. 可能会马上补上也可能需要点时间，但最终，我会补上的。
* `react-router` 或 `history` 在 `node` 中的应用。
* [**`path-to-regexp`**](https://github.com/pillarjs/path-to-regexp) 的原理及为何使用缓存。
* `popstate` 和 `hashchange` 最后到底在哪些地方进行了调用和应用。

### 参考

{% blockquote %}
[[译]简明React Router v4教程](https://juejin.im/post/5a7e9ee7f265da4e7832949c)
[前端路由实现及 react-router v4 源码分析](https://github.com/fi3ework/blog/issues/21)
{% endblockquote %}

<hr>
{% asset_img reward.jpeg Thanks %}

<!-- 1h + 1h + 0.8h + 1h + 1h + 0.8h + 0.6h + 0.2h + 0.5h-->
<!-- 6.4h -->
