---
title: 聊聊你所不知道的 JSON
date: 2019-11-26 20:48:38
tags: JSON
categories: JavaScript
---
<hr>

![](/2019/11/26/learning-about-json/unphoto.jpeg)
JSON 很常用，但它的某些属性，并不常用，却挺好用的。
推荐：★★★

<!--more-->

* [JSON](#JSON)
* [语法](#语法)
* [解析与序列化](#解析与序列化)
* [应用场景](#应用场景)
* [小结&延伸](#小结&延伸)

### JSON

JSON 是前端中非常常见的数据格式。现在常用来定义配置文件，或者与后端交互。它是 javascript 的子集。

与 Javascript 不同之处在于

* 它的语法里只有三种格式，简单值，对象，数组。
* 没有声明变量。
* 简单值里的字符串，和对象中的所有属性名必须以双引号包裹。

#### 简单值

* 对应 js 中的数字，字符串，布尔值，`null`, 但不包括 `undefined`.
* 字符串需要用双引号包裹：`"hello"`
* 数字：`5`

#### 对象

* 几乎和 js 中的对象是一样的。只是它不需要声明变量。
* `{ "name": "bob" }`

#### 数组

* `[1, 2, null, "hello"]` 和 js 没有差别。同样不需要声明变量。

### 解析与序列化

#### JSON.stringify()

* 这个是非常常见的方法，传递数据的时候常常需要用到，它的作用是将 js 变量进行序列化。

  ```javascript
  const params = {
    name: 'bob',
    phone: 123123
  }

  const data = JSON.stringify(params)
  ```

* 我们通常只用到第一个参数。实际上 `JSON.stringify` 方法接收三个参数。

##### 过滤器

* 第二个参数用于过滤，接收数组或函数的形式。
* 当参数是数组时，会过滤掉其他的属性， 只取到数组内属性所对应的内容。如下：

  ```javascript
  const book = {
    title: 'Professional javascript',
    authors: ['Nico'],
    edition: 3,
    year: 2011
  }

  const bookCopy = JSON.stringify(book, ['edition', authors])
  console.info(bookCopy)
  // output "{"title": 'Professional javascript',"authors":["Nico"],"edition":3, "year": 2011}"
  ```

* 而如果参数是函数，那么就可以直接改变对象中的属性值。
* 函数接受 key, value 两个参数，对应属性名和属性值。
* 可以据此进行值的操作，例如过滤值或者更新值。

  ```javascript
  /**
   * [replacer description]
   * @param  {String} key   [键]
   * @param  {[type]} value [值]
   * @return {[type]}       [description]
   */
  function replacer(key, value) {
    if (key === 'title' || key === 'authors') {
      return ''
    }
    return value
  }

  const bookCopy2 = JSON.stringify(book, replacer)
  console.info(bookCopy2)
  // output { "edition": 3, "year": 2011 }
  ```

* 当然要对其他格式的值调用序列化，并传入第二个参数也没有问题。只是没有效果罢了。会如实返回。
  * `JSON.stringify(1, ["name"])`
  * `JSON.stringify("hello", ["name"])`

##### 字符串缩进

* 序列化的第三个参数，则是对应着缩进数。
* 通常我们以 2 格或四格为缩进。那么代码便是这样的。
  * `JSON.stringify(book, null, 2)`
  * `JSON.stringify(book, null, 4)`
* 传入更大的值也不是不可以，但最终它都会转换为 10.
  * `JSON.stringify(book, null, 200)` 和 `JSON.stringify(book, null, 10)` 效果是一样的。
* 有意思的是，它还接受字符串作为参数，字符串的长度对应着缩进数。例如可以这样
  * `JSON.stringify(book, null, 'aaaa')`
  * 这样：`JSON.stringify(book, null, '--')`
  * 甚至这样也没问题：`JSON.stringify(book, null, '长日')`
  * 而且输出时是换行显示的。在调试时非常方便。
  * 以下分别是字符串缩进设置为 10 和字符串的效果。

  ```json
  "{
          "title": "Professional javascript",
          "authors": [
                    "Nico"
          ],
          "edition": 3,
          "year": 2011
  }"
  "{
  --"title": "Professional javascript",
  --"authors": [
  ----"Nico"
  --],
  --"edition": 3,
  --"year": 2011
  }"
  "{
  长日"title": "Professional javascript",
  长日"authors": [
  长日长日"Nico"
  长日],
  长日"edition": 3,
  长日"year": 2011
  }"
  ```

##### toJSON

* 作为对象的方法存在， 自定义 json 的返回值。优先级比第二个参数高。
* 如下，只取出 `title` 属性.

  ```javascript
  const bookToJSON = {
    title: "Professional javascript",
    authors: ["Nico"],
    edition: 3,
    year: 2011,
    toJSON: function () {
      return this.title
    }
  }
  JSON.stringify(bookToJSON)
  // output "Professional javascript"
  ```

#### JSON.parse()

* 解析方法用来还原序列化后的对象字符串。
* 除了常用的第一个参数外，同样有一个类似的转换器参数。
* 但只接收函数形式，和上文提到的函数过滤器，形参是一样的。
* 它可以用来做如下的操作。

  ```javascript
  const book = {
    title: 'Professional javascript',
    authors: ['Nico'],
    releaseDate: new Date(2019, 11, 25)
  }

  const bookCopy3 = JSON.stringify(book)
  console.info(bookCopy3)
  // output "{"authors":["Nico"],"edition":3}"
  ```

* 平平无奇，除了日期看起来是字符串了。
* 这时候可以应用 `JSON.parse` 的转换器方法了。把日期字符串转换回日期对象。

  ```javascript
  /**
   * [reviver description]
   * @param  {String} key   [键]
   * @param  {[type]} value [值]
   * @return {[type]}       [description]
   */
  function reviver(key, value) {
    if (key === 'releaseDate') {
      return new Date(value)
    }
    return value
  }
  // 转换回日期对象
  console.info(JSON.parse(bookCopy3, reviver))
  ```

### 应用场景

* 上述介绍的方法属性，有的适合调试，有的适合操作数据。
* `JSON.stringify` 字符串缩进的能力对日志调试时有很好的帮助，让日志更加直观。
* 过滤器则可以应用在实际业务中。有如下场景：
  * 搜索页面，可以传入许多参数。
  * 后端接收参数，只接收 `null` 和相应的数据格式，否则会报错。
  * 而前端的数据有时是 `''`, 有时是 `undefined`. 需统一处理成 `null`.
* 如果对象属性不涉及多层，可以用函数过滤器的方式实现。

  ```javascript
  function replacer(key, value) {
    if (value === '' || value === undefined) {
      return null;
    }
    return value
  }
  const newData = JSON.stringify(data, replacer)
  // 新数据中会转化空数据为 null
  ```

* 过滤器类似的应用还有，如果想从对象里取出某些属性值，这时数组过滤器可以实现。

  ```javascript
  /**
   * [pickPropsFromObjByArray 取出某些属性，这里为了表明功能，刻意取得比较长的名字]
   * @param  {Object} obj   [description]
   * @param  {Array}  props [description]
   * @return {[type]}       [description]
   */
  function pickPropsFromObjByArray(obj = {}, props = []) {
    return JSON.parse(JSON.stringify(obj, [...props]))
  }

  const book = {
    title: 'Professional javascript',
    authors: ['Nico'],
    edition: 3,
    year: 2011
  }
  pickPropsFromObjByArray(book, ['authors', 'edition'])
  // output {authors: ["Nico"], edition: 3}
  ```

* 如果用过 `lodash`, 这个方法是不是很熟悉。
* 像极了 `_.pick` 方法。

### 小结&延伸

* JSON 自带的方法其实还有多种玩法，只是我们平时不常用。
* 了解上述方法以后，对日常调试和开发，是有一定的帮助的。
* 其他延伸：
  * 如何手动实现 `JSON.stringify`
  * 如何用 `JSON.stringify` 实现深拷贝

<!--2.5h-->
