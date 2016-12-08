---
title: /* @ngInject */介绍
date: 2016-08-18 19:49:24
tags: Angular 
---

<hr>

{% asset_img unphoto.jpeg Angular %}

<blockquote>
	angular的依赖注入是一个非常好的特性。但如果注入的很多也会比较麻烦。发现了一个可以自动创建注射器对象的方法。

</blockquote>

<!-- more -->

## /\* @ngInject \*/

*  由于项目使用脚手架构建的，使用了Gulp，所以可以用/* @ngInject */对需要自动依赖注入的function进行注释。避免了一个个输入的麻烦和意外的错误。
   *前提是在Gulp中使用了`ng-annotate`。
   *	可以避免代码中的依赖使用到任何不安全的写法.
   *	不推荐用`ng-min`.

   *只需在函数前添加即可

```javascript
  export class WindController {
    public sender: IOrderSender;
    public checkJavaRes: any;
    /* @ngInject */
    constructor (
      private $uibModal,
      private url
    ){
 		...
    }
  }
```

*  当它在[ng-annotate](https://github.com/olov/ng-annotate)(压缩注释工具?)下运行时，会输出依赖注入的数组.

```javascript
WindController.$inject = ['$uibModal', 'url']
```

*  这样原本在index.module.ts(统一写路由的地方)中需要依赖注入的地方就可以无需再输入

```javascript
 angular.module('wind', ['ngCookies',...])
 .controller('WindController', ['$scope', '$http', WindController])
 	...
 	更新后
 angular.module('wind', ['ngCookies',...])
 .controller('WindController', WindController)
```

*	假如不加入注释的话，使用后者的写法会报错
*	`Error: [$injector:strictdi] WindController is not using explicit annotation and cannot be invoked in strict mode`.必须要依赖注入。

<blockquote>
	参考:
	[angular中文规范](https://github.com/johnpapa/angular-styleguide/blob/master/a1/i18n/zh-CN.md)

</blockquote> 

