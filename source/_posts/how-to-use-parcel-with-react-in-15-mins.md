---
title: 15 分钟快速上手 Parcel 中使用 React
date: 2018-01-07 13:29:00
tags: Parcel
categories: Tools
---

<hr/>

![](/jo.github.io/2018/01/07/how-to-use-parcel-with-react-in-15-mins/unphoto.jpeg)

最近准备新开一个 Threejs 学习的坑，因为重点在 Threejs 上，所以想构建一个简易方便的环境。于是我自然而然的想到了最近火热的 parcel 来替代以往的 webpack. 在我自己尝试了之后，这简直比我想象中的还要简单方便——当然是指搭建一个基本环境啦。

<!-- more -->

## 索引

- [确立技术栈](#技术栈)
- [安装依赖](#安装依赖)
- [快速上手](#快速上手)

### 技术栈

* parcel 支持 node v8.0.0 +. 所以我们使用 node v8.0.0
* 当然也少不了框架 react. 所以使用 react 16.0.0+.
* npm 使用有些显老了，不如试试 yarn.
* 至于 parcel, 当然也是与时俱进用最新的了。
* 所以最终确认下技术栈和版本。

```javascript
  node v8.0.0
  react v16.2.0
  yarn v1.3.2
  parcel v1.4.1
```

### 安装依赖

* `mkdir [your project]` —— 在一个合适的目录下新建个项目。
* `yarn init` 初始化新项目，一顿回车后即完成。
  * PS： 如果 node 版本不够的话，先升级 node, `nvm install v8.0.0` `nvm use v8.0.0`.
  * 然后升级 yarn. 卸载后重装。`npm uninstall -g yarn.` 再 `npm install -g yarn`.


* 接下来是安装一些 react 依赖。
  * `yarn add react@16.2.0`
  * `yarn add react-dom@16.2.0`
  * `yarn add prop-types`


* 当然也少不了 babel 来编译 es6, es7 等。
  * `yarn add babel-preset-env` 用于 es6.
  * `yarn add babel-preset-react` 用于 react.
  * `yarn add babel-preset-stage-0` 用于 es7.


* 接着就是重头啦。
  * `yarn add parcel-bundler@1.4.1`


* 这顿操作之后，依赖已经加载完毕。

### 快速上手

* 配置 .babelrc 文件来使用 babel。

```javascript
{
  "presets": ["env", "react", "stage-0"]
}
```

* 配置首页入口。

```html
<!DOCTYPE>
<html>
  <head></head>
  <body>
    <div id="app"></div>
    <script src="src/index.js"></script>
  </body>
</html>
```

* 配置 js 文件。使用 react.

```javascript
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Hello extends Component {
  static propTypes = {
    name: PropTypes.string
  }

  render() {
    return <div> hello { this.props.name }</div>
  }
}

const app = document.querySelector('#app')
ReactDOM.render(<Hello name='world'/>, app)
```

* 这样就已经接近完成。
* 剩下的，只要在 package 中加上 scripts.

```json
"scripts": {
  "start": "parcel index.html"
}
```

* 最终只要在项目下运行 `npm start`，再打开 `open http://localhost:1234`. 几乎是一眨眼的功夫，就可以看到 `hello world` 了。
* 是不是非常快捷而简单呢。

#### 项目地址: [threejs-learning](https://github.com/kyriejoshua/threejs-learning)
#### 附上官网链接: [Parcel](https://parceljs.org/)
