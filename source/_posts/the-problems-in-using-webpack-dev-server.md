---
title: webpack-dev-server 中代理(proxy)相关问题的解决及反思
date: 2017-03-07 17:14:53
tags: webpack
categories: Tools
---

<hr>

{% asset_img unphoto.jpg webpack-dev-server %}

{% blockquote %}
记一次工作中踩的坑。坑不大，但耗时非常长。
{% endblockquote %}

<!--more-->

### 问题

* 近期刚加入新公司，配置环境方面踩了非常多的坑。有的最后发现其实是非常简单的原因导致，有的到最后也没有找到原因。这里记录一个最近发生的，让自己头疼了很久的问题，最后的解决方式并不难，但解决的过程值得记录和反思。

* 新项目中使用了 gulp 来配置 webpack, 其中也包括了 webpack-dev-server. 问题便来自于这里。

* 首先来看看代码：

```coffeescript
# gulp 中一个很普通的 task, 使用 coffeescript 编写
gulp.task 'webpack-dev', (cb) ->
  webpackServer =
  	publicPath: '/'
    hot: true
    stats:
      colors: true
    proxy:
      '/api/':
      	target: 'http://localhost:8000'

```

* 这里使用了 webpack-dev-server 的 proxy 配置来代理请求，将原 `/api/`发起的请求发往 `localhost:8000`, 看起来似乎没有什么问题，实际上也并没有问题所在。

* 然而，因为某些未知 bug, 我不得不更改 proxy 的 target 对象。实际上，个人认为，前端在调试时，使用本地的后端服务并不恰当，最好是在 dev 环境上进行接口调试。dev 环境提供的服务至少稳定。

* 因为那该死的 bug, 和刚才说明的考虑，我将这个 target 指向了公司的 dev 站点。

* 改动很少，大致如下:

```coffeescript
gulp.task 'webpack-dev', (cb) ->
  # ...
  proxy:
    '/api/':
      target: 'http://chat.dev.cn'

```

* 本以为不会有任何问题，小小的改动怎会引起巨变。然而，坑就这样产生了。开发环境中的 xhr 请求无法请求到原来的接口。但在浏览器中直接打开 `http://chatops.dev.cn/api/user` 却能得到应有的结果。这让人烦躁，让我心慌。

### 解决过程

* 最初碰到这问题的时候，我一脸懵逼，第一反应是这属于 nodejs 相关的问题，但我对 nodejs 接触不多，想到要从一无所知的事物下手，心情更加烦躁。

* 待冷静下来后，首先想到的是跨域问题。既然 chrome log 里涉及到了 xhr, 那么从跨域的角度或许能找到线索。

* 不幸的是，我发现，这个代理请求是 nodejs  发出的，并不是浏览器发出，既然不是浏览器发起，那也没有跨域这一说。

* 随即我反应过来，既然是 webpack-dev-server 的问题，那么从官方文档查看或许会有进展。果然，文档中有如下说明并列举了使用方式。

  >### Proxying local virtual hosts
  >
  >It seems that `http-proxy-middleware` pre-resolves the local hostnames into `localhost`, you will need the following config to fix the proxy request:

* 我根据文档修改，于是得到如下结果：

```coffeescript
gulp.task 'webpack-dev', (cb) ->
  # ...
  proxy:
    '/api/':
      target:
        host: 'chat.dev.cn'
        protocol: 'http:'
        port: 80
      ignorePath: true
      changeOrigin: true
      secure: false

```

* 这时我怀着激动的心情重启服务，却得到了失望的结果——接口请求到了，返回的格式却是'text/html'. 一定是有哪里出了问题，但无从得知。心情更加烦躁。

* 从刚才 webpack-dev-server 的说明中，我又查阅了 http-proxy-middleware 的相关文档，里面有它自己相关的说明，但和 webpack 相关的仍然一无所获。

* 无奈之下，第一反应是回到万能的 google, 提取关键字 webpack-dev-server 和 proxy，几乎漫无目的搜索后，并没有发现有用的解决办法。

* 于是我又想到 github issues, 在 webpack-dev-server 开源项目中查找相关 issues, 的确有部分 proxy 的疑问在，但仍然没有可提取的信息。

* stackoverflow 上也是同样的结果。这几乎是我最绝望的时刻。

* 冷静下来，我开始反思，是不是一开始就走错了路。于是我回到了官方文档上，逐一试探。
  * 在尝试了 quiet 选项之后无效。
  * 将端口改为本地一样的 8000 也无效。
  * 我想，虽然不是跨域，但 origin 应当是更改的，changeOrigin 应保留。而 secure 在基础配置里也有，应当也不是。于是我再尝试修改 ignorePath 的值，重启之后，发现竟然成功了。
  * 最后的代码如下：


  ```coffeescript
  gulp.task 'webpack-dev-server', (cb) ->
    # ...
    proxy:
      '/api/':
        target:
          host: 'chat.dev.cn'
          protocol: 'http:'
          port: 80
        ingorePath: false # 默认即为 false,注释掉也可以
        changeOrigin: true
        secure: false
  ```

### 回顾与反思

* 这个问题，前前后后困扰了我近一个工作日的时间，跨度有好几天。每天都花费了一定的时间在上面，直至今天，用了近半天的时间才得以解决。

* 事实上，这个问题的本质我还是没有发现，我只是简单地让他生效，并不知其中的原因。等到发现根本原因，理解透彻之后，再回来更新这里。

* 在解决这个问题的过程中，我先后想到 nodejs, 跨域，官方文档，google, github issues, stackoverflow 到最后回到文档。仔细想想，其中有部分是可以避免的，比如在漫无目的的使用 google  时，搜索的效果其实并不好，提取关键字也不够到位。

* 而且在每个过程之间，都有一定的时间跨度，这是不足之处。因为在前一种方式尝试过后难以平复失败时的焦躁心情，不能冷静的思考其他可能，才浪费了许多时间。

* 另外，要拥有一种任何问题都可以搞定的心态，没有搞不定的问题，只有没有信心的人。问题总是可以解决的，只不过有的解决方式并不那么完美，但也许睡过一觉再醒来，再想想，就会发现新的角度。如果一个问题暂时无法解决，那就好好睡一觉，第二天继续干。
