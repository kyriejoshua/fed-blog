---
title: webpack小试牛刀
date: 2016-07-03 16:03:09
tags: tools
---

<hr>

{% asset_img unphoto.jpeg monica my baby %}

<blockquote>
近段时间公司要做一个h5的小项目。一开始我不知道从哪儿下手。在一位前辈的指导下，我用了webpack来打包整理项目。

经过不断的入坑尝试之后终于搭建起了一个小项目，虽然还有部分小坑，不过至少跑起来还可以，这里做一个简单总结。

</blockquote>

<!-- more -->

* webpack是近期比较火的一款模块加载器兼打包工具，能把各种资源，包括图片，js，样式等都作为模块来处理。[官网点这里](http://webpack.github.io/)

* 优势：
	* 资源管理功能强大
	* 以commonJS的形式来书写脚本，也兼容AMD/CMD
	* 模块化思想。可生成公共模块或者按需加载
	* 能替代部分gulp/grunt的工作
	* 支持开发过程中实时打包
	* 插件机制完善，扩展性强
	
	
* 安装：
	* `npm install webpack -g`
	* 或者一般把依赖写入package.json
	* 依次运行`npm init` `npm install webpack --save-dev`
	
* 目录结构
	```javascript
		build
		node_modules
		src
		-page
		 -home
		  -home.html
		  -home.less
		  -index.js
		  -img
		-img
		-common
		-index.js
		-index.html
		-all.less
		package.json
		webpack.config.js
		readme.md
	```
		
* src下是开发文件，用于开发环境
	* page下的是各个模块，每个模块内有自己的js、img、html、less
	* img存放公用的图片
	* common存放公用的js
* build下是src的文件编译好的文件，用于生产环境
	
* 项目设计思路
	* 这是个比较简单的项目，没有使用像angularjs，react这样的框架，只用了jQuery，最初的构想就是简单，上手快
	* 基于现在流行的模块化思想，将所有模块放在src下的page里，每个文件夹即一个模块，也就是一个页面
	* 一个common存放公用的方法和配置文件等
	* index.html是入口页面，all.less是共用的样式，每个页面(模块里)都自己独立的css样式，只是先在每个样式文件里先引入all.less
	
* 配置：
	* 通常项目下会配置一个webpack.config.js的文件，作用类似gulp中的gulpfile.js ，这是默认配置文件，当然也可以修改，这是我的配置

	```javascript
		var webpack = require('webpack');
		var fs = require('fs');
		var fse = require('fs-extra'); //引入nodejs相关
		fse.copySync('./src', './build');
		var dirnames = {};
		var dirs = fs.readdirSync('./src/page');
		// 判断是否是生产环境，不是的话则是开发环境，判断缘由是调试时的入口和要上线时是不一样的
		var isProduction = function() {
		  return process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development';
		};
		// 监听所有js文件变化
		dirs.forEach(function(ele, index){
		  var dir = './src/page/' + ele;
		  var status = fs.statSync(dir);
		  dirnames['page/index'] = ['./src/page/index.js'];
		  if (status.isDirectory()){
			 dirnames['page/' + ele + '/index'] = [];
		     dirnames['page/' + ele + '/index'].push(dir + '/index.js');
		  }
		  return dirnames;
		});
		// 修复低版本node编译时报错的问题
		var Promise = require('es6-promise').Promise;
		require('es6-promise').polyfill();
		// 将内部样式改为外部样式的插件，暂时不用
		// var ExtractTextPlugin = require("extract-text-webpack-plugin");
		var path = require('path')
		module.exports = {
		  entry: dirnames,
		  output:{
		    path: path.resolve(__dirname + '/build'),
		    filename: '[name].js'
		  },
		  module: {
		    loaders: [
		      { test: /\.css$/, loader: 'style!css', exclude:/node_modules/ }, // ExtractTextPlugin.extract('style-loader', 'css-loader')},
		      { test: /\.less$/, loader: 'style!css!less', exclude:/node_modules/ }, // ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')},
		      { test: /\.(png|jpg)$/, loader: 'url?limit=8192', exclude:/node_modules/ },
		      { test: /\.js$/, loader: 'babel', exclude:/node_modules/ },
		      { test: /\.json$/, loader: 'json-loader', exclude:/node_modules/ }
		    ]
		  },
		  resolve: {
		  	// 自动扩展文件后缀名，在文件中可以直接require模块而不写后缀名
		    extensions: ['', '.js', '.json'],
		    // 模块别名定义，方便直接引入文件
		    alias: {
		      // page: 'src/page',
		      page: path.resolve(__dirname, 'src/page'),
		      feed: path.resolve(__dirname, 'src/common/feed'),
		      config: path.resolve(_dirname, 'src/common/config')
		    }
		  },
		  plugins: [
		    new webpack.DefinePlugin({
		      'process.env' : {
		        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
		      }
		    }),
		    new webpack.optimize.CommonsChunkPlugin('vendors.js)
		  ],
		  externals: {
			'jquery': 'jQuery'	// 将jQuery赋值为jquery
		  }
		};
```
		
* 这个项目最初的考虑是利用模块化思想，将每个页面都分割成一个个模块，然后每个模块有着自己独立的js和img还有样式文件
	
* **entry**：入口可以是一个或多个资源合并而成。接受数组和对象，这里以对象的形式放入。然后这里因为加入了实时刷新的webpack-dev-server插件，所以加了生产环境还是线上环境的判断.webpack-dev-server下文详细述说

* **chunk**:被entry所依赖的额外的代码块，也可以包含一个或多个文件
	
* webpack的入口文件是多个的。这里引用了nodejs的方法，利用nodejs可以操控文件的优势，先复制不需要编译的文件，节约编译时间。然后找出所有index.js来编译并存放在各自的文件夹下。**这里要说明是一开始的思路可能没有考虑全面，用复制文件的方式来写会导致html无法随编译刷新，用html-webpack-plugin也无济于事，日后再解决** ——已解决，看最下。

	```javascript
		var dirnames = {};
		var dirs = fs.readdirSync('./src/page');
		// 监听所有js文件变化
		dirs.forEach(function(ele, index){
		  var dir = './src/page/' + ele;
		  var status = fs.statSync(dir);
		  dirnames['page/index'] = ['./src/page/index.js'];
		  if (status.isDirectory()){
			 dirnames['page/' + ele + '/index'] = [];
		     dirnames['page/' + ele + '/index'].push(dir + '/index.js');
		  }
		  return dirnames;
		});
		// 修复低版本node编译时报错的问题
		var Promise = require('es6-promise').Promise;
		require('es6-promise').polyfill();
		var path = require('path')
		module.exports = {
		  entry: dirnames,
		  ......
		}
	```


* **output**: 指输出到哪个目录下，我的项目里就是每个模块对应有着自己的index.js文件，path指的是生成文件的存放目录，filename文件赋值`[name].js`，会生成相应的文件名，最终存放在build/下
	
	
```javascript
	output:{
	    path: path.resolve(__dirname + '/build'),
	    filename: '[name].js'
	}
```


* **loaders**: 这是webpack比较重要的一部分，模块加载器，因为是小项目，在这里我使用的插件并不多，css文件用style-loader和css-loader来处理，less用less-loader来处理，图片用url-loader来处理，目前还支持es6，有babel-loader支持。其中`-loader`可以省略

* 所有加载器还是通过npm来下载。例如url-loader，通过`npm install url-loader --save-dev`下载，它会根据需要将样式中引用的图片转化为base64编码

* 再如less-loader,它会从右向左寻找文件并进行编译，最终将生成的css放在页面的style里

* 其中exclude参数表示需要排除的查找目录,include是包含的查找目录，让webpack只编译包含的目录或排除掉部分目录，可以大大加快它的编译速度


```javascript
	module: {
	    loaders: [
	      { test: /\.css$/, loader: 'style!css', exclude:/node_modules/ }, // ExtractTextPlugin.extract('style-loader', 'css-loader')},
	      { test: /\.less$/, loader: 'style!css!less', exclude:/node_modules/ }, // ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')},
	      { test: /\.(png|jpg)$/, loader: 'url?limit=8192', exclude:/node_modules/ },
	      { test: /\.js$/, loader: 'babel', exclude:/node_modules/ },
	      { test: /\.json$/, loader: 'json-loader', exclude:/node_modules/ }
	    ]
	  }
```

* **resolve**则看注释即可

* **definePlugin**插件，用于判断是生产环境还是线上环境，在部署时或者切换环境时非常有用

	```javascript
		new webpack.DefinePlugin({
		  'process.env' : {
		    'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'dev')
		  }
		})
	```
	
* **providePlugin**: 通常情况下我们都需要先require相关资源，并赋值给变量才可以使用，比如要在js顶部引入`var $ = require('jquery')`才可以使用$,而在每个页面都这样操作很繁琐。于是可以利用该插件一次定义，处处使用。无须再在页面顶部引入。

	```javascript
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery',
			'_': 'lodash'
		})
	```


* **alias**:别名(请求重定向)。定义别名可以方便文件快速查找并加快编译速度。文件查找的时间大大缩减。之前我是这么写的

	```javascript
		var feed = require('../../common/feed/index'); // 一个存放公用方法的文件,每个页面都写长长的这么一句
		然而现在是这样
		var feed = require('feed/index');
		或者它会去找该文件夹下面的index.js，所以可以更简单
		var feed = require('feed');
		不只是书写方便了，而且webpack的编译也更快了
	```


* **commonsChunk**:将公共模块提取出来,利用浏览器缓存机制提高页面加载效率。避免每个文件都引用一次，影响加载速度

	```javascript
		new webpack.optimize.CommonsChunkPlugin('vendors.js)
	```
	
* **uglifyjs**:将生产环境中的js代码进行压缩和混淆,缩小文件加快请求速度
	
	```javascript
		webpack.optimize.UglifyJsPlugin({minimize: true})
	```

	
* **externals**:为避免第三方库或框架被合成或打包成公共模块浪费资源。可以采用cdn引入的方式。这就需要进行一些设置
	
	* 首先在页面的html里引入cdn上的文件

	```javascript
    	<script src="https://code.jquery.com/jquery-1.11.1.min.js" integrity="sha256-VAvG3sHdS5LqTT+5A/aeq/bZGa/Uj04xKxY8KM/w9EE=" crossorigin="anonymous"></script>
    ```
	
* 然后在webpack.config.js里设置
	
	```javascript
		externals: {
			'jquery': 'jQuery'	// 将jQuery赋值为jquery
		}
	```
	
### 运行 webpack

* 可以直接运行`webpack`执行一次性编译，建议运行时加上以下参数
* `--display-error-details` 方便查看出错时的报错信息
* `--progess --color` 输出呈彩色，进度条显示编译进度
* `-p` 生产环境压缩代码

#### HTML页面引入

* 直接在html里加入 `<script type='text/javascript' src='index.js'>`即可

#### index.js

* HTML中不引入样式，是因为在这里就引入了。在页面顶部加上`require('../[name].less')`
* `[name]`指代当前less的文件名，我的做法是在每个less里引入一个公用的all.less,然后不同页面的js里引入各自的less，webpack会自动编译less并放在页面的style里
	*	其实还尝试过使用`ExtractTextPlugin.extract('style-loader', 'css-loader')}` 插件，将页面顶部的样式改为外部文件引入，但因为开始时设计的偏差，改动起来比较麻烦，最后作罢
	
* 这是个小项目，只引入了jquery和自己的公用的一个库 `reqiure('feed')`
* 通过process.env.NODE_ENV的值判断开发环境的接口，是引用测试的接口还是线上的接口，它的值不同时会引用不同的js文件
* 所以最终每个index.js的顶部会有这么几行
	
	```javascript
		require('./style.less');
		var feed = require('feed');
		var url = require('config/env/' + process.env.NODE_ENV);
		// 执行该页面的逻辑代码
		......
	```

#### 如何自动刷新 使用webpack-dev-server

* webpack-dev-server是一个静态轻量的express资源服务器，只用于开发环境
* 它的作用就是把编译后的静态文件全部保存在内存里，而不会写到文件目录内
* 安装:`npm install webpack-dev-server --save-dev`
* 这里采用了双服务器模式，一个后端服务器和一个资源服务器
* 运行 `NODE_ENV=local webpack-dev-server --inline --hot --devtool --content-base build/` 得到的entry应当是这样的

	```javascript
		entry:
		  {
		    'page/index': [
			'webpack-dev-server/client?http://localhost:8080',
			'webpack/hot/dev-server',
			'./src/page/index.js'
			]
		  }
	```

* **NODE_ENV** 作为环境变量，决定启用使用测试接口或是线上接口
* --hot 选项的工作其实就是把webpack/hot/dev-server加到了entry中，如果成功了，运行命令后的控制台里会有以下信息

	```javascript
		[HMR] Waiting for update signal from WDS...
		[WDS] Hot Module Replacement enabled.
	```
	
* 采用 --inline 模式，它的工作其实就是把`webpack-dev-server/client?http://localhost:8080`加到entry中 
* --content-base 把build/下的内容作为静态资源服务
* --devtool eval 配置devtool的值为eval，用于查看编译后的源代码，eval 不支持生产环境查看源代码，但编译速度快，另一个常用的值是source-map，支持生产环境，但相对慢
* 打开 `localhost:8080/webpack-dev-server/page/index.html`查看


#### package.json 配置


```javascript
	script: {
	  "dev": "rm -rf build && NODE_ENV=local webpack-dev-server --inline --hot --devtool eval --progress --colors --content-base build/",
   "web": "NODE_ENV=development webpack --progress --colors --display-error-details",
	}
```
	
* 运行`npm run dev` 开发环境下
* `npm run web` 测试环境下
	

#### 目前遗留问题

* hot热加载未生效
* *html文件更改无法刷新同步到页面*
	*  该问题已解决。出现问题的原因是加载在页面上的是编译好的build下面的文件，但html支持的监听刷新是开发文件，所以只要更改运行脚本即可——将build改为src，如下：
	*  `"dev": "rm -rf build && NODE_ENV=local webpack-dev-server --inline --hot --devtool eval --progress --colors --content-base src/"`
* 多页面项目没有很好的方案去构建自动化


### 小结

* 这是自己的第一个独立项目，绝大部分工作都是自己完成的，前辈指导了一部分，后来就全部自己做了。当然还是并不太成熟，遗留几个问题目前找不到解决办法。webpack给我的体会是编译速度非常快，或许也和现在项目中的依赖比较少有关。不管怎样，这个项目目前还会维护下去，会不定期更新，解决遗留问题。


