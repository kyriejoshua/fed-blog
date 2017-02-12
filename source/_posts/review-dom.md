---
title: DOM 重要知识点回顾
date: 2017-02-12 18:16:27
tags: DOM
categories: DOM	
---

<hr>

{% asset_img unphoto.jpg DOM %}

<blockquote>
  回顾部分重要的 DOM 知识点。

</blockquote>

<!--more-->

## DOM

* 元素的增删改查。
* 获取或设置元素的属性。

### DHTML

* 动态HTML。
* 一系列实现网页动态效果的技术统称。
* 区别:
   * HTML：超文本标记语言，标签名固定。
   * XHTML：更严格的HTML语言标准。
   * XML: 可扩展的标记语言，标签名可自定义，语法和HTML完全相同。

### JS(ECMAScript、DOM、BOM)

* ECMAScript(核心语法)。
* 文档对象模型。
* 浏览器对象模型。

### DHTML: 7大内置对象

 1. window: 指代当前浏览器打开窗口。
 2. document: 指代当前页面的HTML文档。
 3. navigator: 封装了浏览器软件的版本信息和部分设置。
 4. history: 封装当前窗口成功浏览过的网址的历史记录栈。
 5. location: 指代当前窗口中地址栏。
 6. screen: 指代当前显示器。
 7. event: 指代事件对象。

### DOM

* 网页中一切内容都是节点(Node)对象。
* 所有节点对象以树形结构组织在一起(Dom Tree)。
* 增删查改。

#### DOM TREE

* 网页加载时生成的文档模型。
* Document: Dom Tree根节点, 网页加载完成自动生成。
* 继承自 HTML Document 的原型，Document 的原型中提供了 document 对象可用的 API.

#### 节点对象

* 元素节点对象：指代 HTML 文档中每个元素。
* 文本节点对象：指代 HTML 文档中的文本内容。

#### 节点对象：所有节点对象都继承自一个父对象：Node.prototype.

* Body 对象：`body -> HTMLBodyElement.prototype -> HTMLElement.prototype -> Element.prototype -> Node.prototype -> 所有结节点共有属性`.
* document 对象：`document -> HTMLDocument.prototype -> Document.prototype -> Node.prototype`.
* nodeType:
   * 元素节点(1)。
   * 文本节点(3)。
* nodeName(返回全大写形式的标签名):
   * 元素节点(标签名)。
   * 文本节点(#text)。
* nodeValue:
   * 文本节点(文本内容)。
   * 元素节点(null)。

#### 节点关系

* 父子关系:
  * node.parentNode: 获得 node 对象的父节点对象。
  * node.childNode: 获得 node 对象的所有子节点对象。
  * node.firstChild: 获得 node 对象下第一个子节点对象。
  * node.lastChild: 获得 node 对象下最后一个子节点对象。
  * 返回 NodeList 类型的对象。
  * NodeList 中的节点对象都是基于 Dom 树**动态**查询。
  * Dom 树的变化随时反映在 NodeList 中。
  * 遍历所有子节点：
  ```javascript
  for (var i = 0; i < node.childNodes.length; i++) {
    console.log(node.childNodes[i]);
  }

  // 每遍历一个元素，for 循环就会重新查找 childNodes 结果

  // 优化如下
  for (var i = 0, len = node.childNodes.length; i < len; i++) {
    console.log(node.childNodes[i]);
  }
  ````
  <br/>
* 兄弟关系
  * node.previousSibling: 获得平级对象的前一个节点对象。
  * node.nextSibling: 获得平级对象的后一个节点对象。

### 查找元素

* id: `var elem = document.getElementById('id')`.
* TagName:
   * `var elems = element.getElementsByTagName('tagname')`.
   * `elems`是一个动态集合——HTMLCollection类型的对象。
   * 随着页面 Dom 的改变实时改变。
* name:
   * `var elem = document.getElementsByName('')`.
   * 直接获得表单元素: `var form = document.form['id']`.(存疑)
   * `elems = form['name']`.
   * 返回**对象**或者 **HTMLCollection**.
* class(HTML5):
   * `var elems = node.getElementsByClassName('class')`.
* 选择器查找: Selector API
   * 没有兼容性问题。
   * 原生API，执行效率高。
   * 返回值：包含全功能，全属性的元素对象集合。
   * `var elem = element.querySelector('selector')`.
   * `var elems = element.querySelectorAll('selectors')`.

#### 读写元素对象内容属性

*  操作元素的内容：开始标签和结束标签之间的内容。
  * `elem.innerHTML`: 开始标签和结束标签的 HTML 原文。
  * 批量替换或删除一个元素下所有子节点的最快速高效的办法。
  * 注意点：
    * 替换内容不要包含事件处理程序。
    * 不是所有元素都支持:
      * table 极其子元素，除了 td 外都不支持。
      * html/head/style.

  * `elem.textContent`: DOM 标准。
  * 存在兼容性问题：
    * IE8: elem.innerText. firefox 不支持。


*  性能问题：
   * 每次设置 innterHTML 时，会临时创建解释器对象。频繁设置会导致内存浪费，效率差。
   ```javascript
   for (var i = 0; i < values.length; i++) {
     ul.innerHTML += '<li>' + values[i] + '</li>'
   }
   // 会创建多个解释器对象

   var lis = [];
   for (var i = 0; i < values.length; i++) {
     lis.push('<li>' + values[i] + '</li>');
   }
   ul.innerHTML = '<li>' + lis.join('</li><li>') + '</li>';
   ```

#### 读写元素属性

 1. 通过 HTMLElement 类型提供的标准属性: HTML DOM.
   * `elem.[attr]`
 <br/>
 2. 通过 get/setAttribute 函数——核心DOM.
   * `elem.getAttribute('attr')`.
   * `elem.setAttribute('attr')`.
   * 获取或设置所有属性类型都是字符串。
   * 可读写 HTML 元素中自定义属性。
   * attribute: 指 HTML 标签中属性或自定义属性。
   * property: 指内存中对象的属性。

* 前两种方法不可通用。

#### 读写内联样式

* 返回一个 CSSStyleDeclaration.
* CSS 中的属性都是 style 对象的子属性。
* 所有 CSS 紫属性都返回带单位的字符串。
* 例如：`console.log(elem.style.width); // '100px'`
* 子属性的命名规则，去横线，改驼峰。
* 修改属性：
   * `elem.setAttribute('style', 'style string')`.
   * `elem.style.cssText = 'style string'`.
* 移除属性：
   * `elem.style.removeProperty('attr')`.
* 大量修改样式建议如下：
   1. CSS 中为元素的不同状态定义样式类
   2. JS 中控制对应的样式类改变

### 遍历 DOM TREE

* 遍历：以任意元素对象开始，以深度优先的原则，获取所有子对象。
* 递归：函数内调用自己
```javascript
 var blank = [];
 function getChildren(parent) {
   console.log(blank.join('') + '|-' + (parent.nodeType != 3 ? parent.nodeName : parent.nodeValue));
   if (parent.childNodes) {
     blank.push('\t');
     for (var i = 0, len = parent.childNodes.length; i < len; i++) {
       getChildren(parent.childNodes[i]);
     }
     blank.pop();
   }
 }
 getChildren(document);
```

#### 递归遍历

* 手写遍历元素树：仅包含元素节点的树结构

| tree  | 节点数             | 元素树                     |
| ----- | --------------- | ----------------------- |
| 父子节点  | ---             | ---                     |
| 父节点   | parentNode      | parentElementNode       |
| 子节点   | childNode       | childElementNode(IE8支持) |
| 首末节点  | ---             | ---                     |
| 首个子节点 | firstChild      | firstElementNode        |
| 最后子节点 | lastChild       | lastElementNode         |
| 兄弟节点  | ---             | ---                     |
| 前一个   | previousSibling | previousElementSibling  |
| 后一个   | nextSibling     | nextElementSibling      |

#### DOM 2级遍历API

 1. NodeIterator 迭代器：
   *  一个集合中每次金宝村一个对象的游标
   *  游标通过前后移动在集合中遍历每个元素
   * 迭代器
   ```javascript
   /**
    * [iterator 迭代器]
    * @param {Object} parentNode [开始遍历的父节点对象]
    * @param {String?} nodeType [选择节点的类别(NodeFilter.SHOW_ALL|NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT)]
    * @param {Function} filterFun [筛选器函数对象]
    * @param {Boolean} boolean []
    * @type {[type]}
    */
   var iterator = document.createNodeIterator(parentNode, nodeType, filerFun, boolean);

   // 调用 nextNode 方法
   iterator.nextNode();

   // 待完善
   ```
 <br/>
 2. TreeWalker: 用法和迭代器完全一样
   * 新增了部分API，所有如下：`firstChild`、`lastChild`、`previousNode`、`nextNode`、`previousSibling`、`nextSibling`、`parentNode`.

### 操作节点

#### 创建、删除节点对象

* 核心 DOM.
* 创建：`var newElem = document.createElement('tagName');`
```javascript
 var newElem = document.createElement('tagName');
 // var a = document.createElement('a');
```
* 在 DOM 树中添加：
```javascript
 parent.appendChild(newTag);
 parent.insertBefore(newTag);
 parent.replaceChild(newTag);
 ...
```
* HTML DOM: 部分常用元素对象可以直接生成。
```javascript
 // 创建新对象的同事插入 tr 到 table, i 为新行位置的索引
 // HTMLTableElement:
 var newTr = table.insertRow([i]);

 // HTMLTableRowElement:
 var newTd = tr.insertCell(i);

 // HTMLSelectElement: onchange(),sel.selectedIndex
 var sel = document.getElementById('#select'); // ? 这步存疑
 var opt = sel.add(new Option('innterHTML', 'value'));
 // 创建一个新的空对象。
 // 将第一个参数设置为 opt.innerHTML 属性
 // 将第二个参数设置为 opt.value
 // 将 opt 对象添加到 sel 中
 sel.remove(); // 移除

```
* 性能：频繁添加节点会反复解析 DOM 树，导致效率低下。
* 文档片段：内存中临时保存多个 DOM 节点对象的空间。
```javascript
 // 向文档片段中临时存入节点对象
 var tempFrag = document.createDocumentFragment();
```
* 文档片段接入 DOM 树中时，不会在页面显示。

## BOM

### WINDOW

* 在浏览器中代替 global 对象的全局对象。
* 全局作用域。
* 修改或设置浏览器窗口的相关属性。

#### 打开新链接的方式

 1. 在当前窗口内替换当前页：
 ```html
 <a href="url"></a>
 ```
 ```javascript
 var newWin = [window.]open('url', 'self');
 ```
 2. 打开新窗口，可重复打开:
 ```html
 <a href="" target="_blank"></a>
 ```
 ```javascript
 var newWin = [window.]open('url'[, 'blank'] ); // 默认是 blank
 ```
 3. 打开新窗口，不可重复打开
 ```javascript
 var newWin = [window.]open('url'[, 'blank']);
 ```

#### 窗口定位、移动

* window.innerHeight/width: 浏览器窗口可见区域的大小。
* window.outerHeight/width: 浏览器窗口完整大小。
* window.moveTo(浏览器窗口左上角 x 坐标，浏览器 左上角 y 坐标).
* window.moveBy(x 坐标的变化量，y 坐标的变化量).
* 在打开窗口时制定窗口大小和位置：
```javascript
 /**
  * [open]
  * @param  {String} strUrl    [链接]
  * @param  {String} strName   [名字]
  * @param  {String} config ['attr=value, attr=value' 键值对的方式保存]
  */
 open('url', 'name'[, 'config']);

 // 例如：
 window.open('www.google.com', 'google', 'resizable=no, scrollbars=yes,status=no');
 // config 可以写：
 // height/width: 窗口文档显示区大小
 // top/left: 窗口左上角 x 坐标，y 坐标
 // resizable: 是否允许调整窗口大小
 // location: 是否允许修改地址栏
```

#### 对话框

* `alert('warning');`
* `var input = prompt('tips');`
* `var bool = confirm('tips'); // 含两个按钮`

#### 定时器

* 周期性定时器：反复执行。
```javascript
 // 定义任务函数。
 // 全局变量保存定时器的 id.
 // 启动定时器。
 /**
  * [setInterval 周期性定时器]
  * @param {Function} function [须调用的函数]
  * @param {Number} time     [间隔时间]
  */
 var timer = setInterval(fun, time);

 // 例如：
 // 定义它：
 var timer = setInterval(function(){
  console.log(new Date());
 }, 3000);

 // 清空它：
 clearInterval(timer);
```
* 一次性定时器：执行一次任务后便自动退出。
```javascript
 // 定义任务函数。
 // 定义全局变量，保存定时器 id.
 // 启动定时器。
 /**
  * [setTimeout 一次性定时器]
  * @param {Function} function [任务函数]
  * @param {Number} time     [延迟时长]
  */
  var timer = setTimeout(function() {
    console.log(new Date());
  }, 3000);

  // 清空它：
  cleatTimeout(timer);
```

#### NAVIGATOR: 封装浏览器软件版本信息的对象

* navigator: 检测插件。
* navigator: 检测 cookie 是否启用。
   * chrome -> 设置 -> 显示高级设置 -> 隐私 -> 内容设置 -> 禁用
* navigator.userAgent: 包含了浏览器名称和版本号。

#### LOCATION: 封装当前窗口打开的 url 信息的对象

* `window.location === document.location; // true`
* location.search: 获取 url 中查询字符串参数
* 在当前窗口内打开新 url:
```javascript
 location.href = 'url';
 window.location = 'url';
 location.assign(url);
```
* `location.replace('url')`: 禁止后退：

#### HISTORY: 当前窗口打开后的*历史记录栈*

```javascript
  // 前进
  history.go(1);

  // 刷新
  history.go(0);

  // 后退
  history.go(-1);
  history.go(-2);
```

#### SCREEN

* screen.width/height: 完整分辨率。
* screen.availWidth/availHeight: 除去任务栏后的剩余分辨率。
* window.innerWidth/innerHeight: 浏览器可视区域的大小，出去控制台等。
* window.outerWidth/outerHeight: 浏览器整体大小

### 事件：网页中，人为触发或自动触发的状态改变

* 事件处理程序：一个对象的特殊属性。
* 属性一般引用一个函数对象或 JS 程序块。
* 当事件发生时，自动执行绑定在属性上的程序。
* 例如：
```javascript
 window.onload = function() {};
 btn.onclick = function() {};
 txt.onfocus = function() {};
 select.onchange = function() {};

 // 其他
 div.onmouseover // 鼠标跨入边界执行
 div.onmousemove // 鼠标在范围内移动则执行
 div.onmouseout // 鼠标跨出边界执行
```

### 事件流：当事件出发时，内外层元素间的时间出发顺序

* DOM 标准事件流：由外向内捕获 -> 目标触发 -> 由内向外冒泡触发。
* IE8 事件流： 目标触发 -> 由内向外冒泡触发。没有捕获阶段。

#### 绑定事件处理程序

 1. HTML 中设置事件属性:
   * `<div onclick="javascript"></div> // this 必须从页面中传入`
 2. DOM0 级 API: JS 中设置对象的时间属性
   * `obj.onclick = function() {}; // this 指代正在调用时间处理程序的元素对象`
   * 存在以下两个问题：
     * 无法改变事件流中事件触发的顺序。
     * 同一对象的统一吹函数，同时绑定多个函数对象。
 3. DOM2 级标准 API:
   * `obj.addEventListener('click',function(){}[, boolean]); // 依次传入事件名，函数对象，是否在捕获阶段触发`
   * IE8 的处理：`obj.attchEvent('click', 'function() {}'); // 依次传入事件名，函数对象`

#### EVENT: 事件触发时自动创建，自动传入事件处理函数内(默认为第一个参数)

* 获取：`var event = window.event || arguments[0]; // 在函数内使用`
* 获得事件源(目标对象)：`var src = event.target || event.srcElement; // this 随着事件冒泡而变化`
* 取消冒泡：
   * `event.cancelBubble = true; // IE`
   * `event.stopPropagation(); // DOM`
   * 兼容写法：`if (e.stopPropagation) { e.stopPropagation(); } else {e.cancelBubble = true;}`
* 取消事件：取消事件的默认行为，停止继续执行
   * `if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }`
