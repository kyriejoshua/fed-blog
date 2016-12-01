---
title: eslint有关import/prefer-default-export报错的解决
date: 2016-08-08 21:11:39
tags: eslint
---

<hr>

{% asset_img unphoto.jpeg miss hot %}

<blockquote>
	今天在配置eslint发现一个神奇的问题——采用airbnb风格的检查时有一个报错
	*`error Prefer default export    ......     import/prefer-default-export`*
		查了半天资料终于发现如何解决。
	
</blockquote>

<!-- more -->

### 解决

*	原来是这样

```javascript
export function runBlock($log) {
  $log.debug('runBlock end');
}
```

*	运行eslint检查的时候一直会报错 `error Prefer default export     ......    import/prefer-default-export`
*	查询了一些资料后发现是因为,这个单一接口并不是设置为默认的。需要添加参数`default`。
* 更改后如下

```javascript
export default function runBlock($log) {
  $log.debug('runBlock end');
}
```

*	具体原因有待详细追究。目前认为是当输出只有一个变量时，需要添加`default`。


> 参考
*	[es6...](http://exploringjs.com/es6/ch_modules.html)
*	[eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md)

