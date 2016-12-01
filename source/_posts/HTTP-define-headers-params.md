---
title: HTTP协议之自定义headers参数
date: 2016-10-17 19:58:04
tags: HTTP
---

<hr>

{% asset_img unphoto.jpeg  lake %}

<blockquote><br/>近期和我司服务端对接时发现藏在headers里的参数，并不是HTTP的response里的常规参数。几经折腾后发现是自定义的参数。供前端ajax调用时提取使用。

</blockquote>

<!--more-->

### Before

*  在工作时常常有获取列表的接口，就必然会涉及获取到的数组的长度，即页数。



*  讲道理，将返回的数组内容和总数量一起返回并不太合理，就像一本书不会在每一页上都标明总页数，而是在书的最开始或者末尾有说明。所以秉着内容和页数不应存放在一起的原则，服务端同事将列表的总页数放在了response的headers里。



*  所以问题是如何从response headers获取相应参数。

### 详情

*  查找了部分文档后找到了Access-Control-Expose-Headers这个参数。



*  *The **Access-Control-Expose-Headers** response header indicates which headers can be exposed as part of the response by listing their names.*



*  它表明了哪些参数是可以用名字展示在response的header里的——这里的展示应当理解为前端可以获取，而不是单纯的显示。



*  默认是展示6个参数：

   *  **Cache-Control**
   *  **Content-Language**
   *  **Content-Type**
   *  **Expires**
   *  **Last-Modified**
   *  **Pragma**


*  也可以展示其他参数。通过以下方式设置：
   *  `Access-Control-Expose-Headers: Content-Length`

*  甚至自定义参数：
   *  `Access-Control-Expose-Headers: X-Resource-Count, Content-Length`

*  这样当服务端传了`X-Resource-Count`时在前端就可以取到X-Rource-Count的值。

```javascript
1.在angular中获取
$http.get(`${url}/getLists/`)
.then((res) => {
  // 可以获取到
  console.log(res.headers('X-Resource-Count'));
});

2.在jquery中获取
$.ajax({
  url: `${url}/getLists`,
  type: 'GET',
  contentType: 'application/json;charset/utf-8',
})
.done((data, textStatus, jqXHR) => {
  console.log(jqXHR.getResponseHeader('X-Resource-Count'));
});

3.原生ajax
if (window.XMLHttpRequest) { // Mozilla, Safari. IE7+
  httpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) { // IE 6 and older
  httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
}
httpRequest.onreadystatechange = () => {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.statue === 200) {
	  // something...
    } else {
      // error
    }
  }
};
httpRequest.open('GET', `${url}/getLists`);
______________________________________________________________
function getHeaderCount() {
  console.log(this.getResponseHeader('X-Resource-Count'));
}
httpRequest.onload = getHeaderCount;
______________________________________________________________
httpRequest.send();
```

*  这样就可以愉快地使用X-Resource-Count了。

<blockquote><br/>参考：[Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers)

[Ajax](https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started)

</blockquote>

