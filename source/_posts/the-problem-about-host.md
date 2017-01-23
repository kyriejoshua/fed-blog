---
title: 有关 getaddrinfo 报错的解决
date: 2017-01-23 18:45:40
tags: HTTP
categories: HTTP
---

<hr>

{% asset_img unphoto.jpg localhost %}

<blockquote>
  有关 getaddrinfo 报错的解决方式。

</blockquote>

<!--more-->

### 问题

* 近期在配置新项目环境的时候遇到了如下问题：

  ```javascript
  events.js:72
  	throw err;

  Error: getaddrinfo ENOTFOUND talk.bb
  	at errnoException (dns.js:37:11)
      at Object.onanswer [as oncomplete] (dns.js:124:16)
  ```


* 经提示后发现是host配置的问题。

* 因为项目的配置 gulpfile.coffee 文件里是这样的：

  ```javascript
  server.listen config.webpackDevPort, 'talk.bb', (err) ->
    if err?
      throw new gutil.PluginError('webpack-dev-server', err)
    gutil.log '[webpack-dev-server] is listening'
    cb()
  ```

* 这里的 talk.bb 实际上是替代了 localhost 作用，虽然目前在接手这项目的时候还不知它的作用，但就此去解决报错的方法就是在 host 文件下增加 talk.bb 配置。


### 解决

* 修改电脑的 host 配置，以管理员身份修改，运行 `sudo vim /etc/hosts`.可见文件如下：

  ```javascript
  127.0.0.1       localhost
  255.255.255.255 broadcasthost
  ::1             localhost
  ```

* 在其中增加 talk.bb  即可，如下：

  ```javascript
  127.0.0.1       talk.bb
  127.0.0.1       localhost
  255.255.255.255 broadcasthost
  ::1             localhost
  ```

<br>
* *不知这类的问题算不算是计算机基础问题，依然还有很长的路要走……*