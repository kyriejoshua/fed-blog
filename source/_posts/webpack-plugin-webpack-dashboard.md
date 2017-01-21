---
title: webpack实用插件安利之webpack-dashboard
date: 2016-09-23 16:48:45
tags: webpack
categories: Tools
---

<hr>

{% asset_img dash.png Dashboard %}

<blockquote>
	在github上explore的时候偶然发现这款插件，非常火爆，推出没多久就收货了几千stars。我在踩了几个坑后成功引入到公司的项目里。

</blockquote>

<!-- more -->

###  webpack-dashboard是什么

*  它是webpack的一个面板，显示webpack在编译时的各种配置和提示信息。


*  在wd(webpack-dashboard这里简称为wd)引入之前，我们的命令行是这样显示的。

  {% asset_img webpack.png webpack %}

*  而使用了wd之后，就有了封面的效果。显示上不仅酷炫了很多，各种配置信息，文件大小，占用空间，语法检查也一目了然。
*  它的使用也非常简单，虽然我在引入时踩了一个不大不小的坑。在这里我要引以为戒。
*  以我的webpack.config.js为例，这是未加wd之前的js。



```javascript
var webpack = require('webpack');
var path = require('path');
var root_path = path.resolve(__dirname);
var build_path = path.resolve(root_path, 'build');

module.exports = {
  entry: {
  'page/homepage/index': './src/page/homepage/index.js'
  },
  output:{
    path: build_path,
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' }, // ExtractTextPlugin.extract('style-loader', 'css-loader')},
      { test: /\.less$/, loader: 'style!css!less', exclude: /node_modules/ }, // ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')},
      { test: /\.(png|jpg)$/, loader: 'url?limit=8192&name=img/[name].[ext]' },
      { test: /\.js$/, loaders: ['babel?presets[]=es2015'], exclude: /node_modules/ }
    ]
  }
};
```



*  我运行`webpack-dev-server --inline --devtool eval`来进行webpack-dev-server的实时编译。
*  得到的效果如下，即和第二张图类似。



  {%  asset_img old-webpack2.png old-webpack2 %}

<br>

  {%  asset_img old-webpack3.png old-webpack3 %}

<br>

  {%  asset_img old-webpack.png old-webpack %}

<br>

*  (请自动忽略那些低级报错)
*  虽然有log,但这些列表琳琅满目，让人无所适从。密密麻麻的给人里压迫感，使人窒息。
*  下面来试试wd。


### webpack-dashboard使用

*  **install** : 在项目目录下`npm install webpack-dashboard --save-dev`

*  这里主要说明的是配合webback-dev-server使用的方式。

   *  首先，引入dashboard和插件。

   ```javascript
   var Dashboard = require('webpack-dashboard');
   var DashboardPlugin = require('webpack-dashboard/plugin');
   var dashboard = new Dashboard();
   ```

   <hr>

   *  其次，在配置部分加入实例化的插件。

   ```javascript
   new DashboardPlugin(dashboard, setData);
   ```

   <hr>

   * 然后，更新webpack-dev-server的配置。

   ```javascript
   new devServer{
     publicPath: setting.output.publicPath, // 输出路径
     inline: true,
     port: 2333, // 端口设置
     quite: true // 必要参数
   }
   ```

   *  最后，运行命令就可以看见炫酷的效果了。

   ```javascript
   package.json里配置
   "scripts": {
     "start": "webpack-dev-server"
   }
   再运行`npm start`即可。
   ```

   ​

*  Q&A

   * 补充下我运行时发现的一些问题 。
   * 首次运行时有报错,如下。

   {% asset_img dashboard-wrong.png dashboard-wrong %}

   *   找了很久，才意识到这是语法错误。它使用了ES6规范。而我当前的node版本是0.10.30,对ES6的支持很差。当我切换到***0.12.x***的时候，编译就成功了。最终我选择了***0.12.10***。

   *   `npm start`时quiet配置会不生效，导致出现的dashboard面板上有重复的log信息。**解决办法是运行时添加参数`--quiet`**

*  最后再来看看配置文件和效果图。

```javascript
var webpack = require('webpack');
var path = require('path');
var root_path = path.resolve(__dirname);
var build_path = path.resolve(root_path, 'build');
// dashboard
var Dashboard = require('webpack-dashboard');
var DashboardPlugin = require('webpack-dashboard/plugin');
var dashboard = new Dashboard();

module.exports = {
  entry: {
    'page/homepage/index': 	'./src/page/homepage/index.js'
  },
  output:{
    path: build_path,
    filename: '[name].js'
  },
  // webpack-dev-server
  devServer: {
    inline: true,
    port: 2333,
    quite: true // Add quite option for webpack dashboard
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' }, // ExtractTextPlugin.extract('style-loader', 'css-loader')},
      { test: /\.less$/, loader: 'style!css!less', exclude: /node_modules/ }, // ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')},
      { test: /\.(png|jpg)$/, loader: 'url?limit=8192&name=img/[name].[ext]' },
      { test: /\.js$/, loaders: ['babel?presets[]=es2015'], exclude: /node_modules/ }
    ]
  },
  plugins: [
    new DashboardPlugin(dashboard.setData)
  ]
  };

package.json
...
  "scripts": {
    "start": "webpack-dev-server --quiet --content-base src/",
  }
...
```

<hr>

{% asset_img webpack-dashboard.png webpack-dashboard %}

## Draft for Now

<div class="page-reward"><a href="javascript:;" class="page-reward-btn tooltip-top"><div class="tooltip tooltip-east"><span class="tooltip-item">赏</span><span class="tooltip-content"><span class="tooltip-text"><span class="tooltip-inner"><div class="reward-box"></div></span></span></span></div></a></div>

{% asset_img reward.jpeg Thanks %}
