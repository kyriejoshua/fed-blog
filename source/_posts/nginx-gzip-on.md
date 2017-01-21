---
title: 前端性能加快之nginx开启gzip压缩
date: 2016-08-02 15:22:21
tags:	nginx
categories: Server
---

<hr>

{% asset_img unphoto.jpeg jake %}

<blockquote>
  近期发现公司内部网站加载特别慢，原因是我们将所有样式文件，外部引入的文件都分别合成成一个文件，这文件少则1M，多则3、4M。大的简直不敢想象。导致打开速度几十秒甚至一分钟。实在无奈，经前辈指点终于发现nginx有个好配置……

</blockquote>

<!-- more -->


### gzip

*	Gzip是若干种文件压缩程序的简称，通常指GNU计划的实现，此处的gzip代表GNU zip。也经常用来表示gzip这种文件格式。软件的作者是Jean-loup Gailly和Mark Adler。在1992年10月31日第一次公开发布，版本号0.1。
* [gzip](http://nginx.org/en/docs/http/ngx_http_gzip_module.html)
*	HTTP协议上的GZIP编码是一种用来改进web应用程序性能的技术。通常可以将纯文本内容压缩到原有大小的40%甚至更小。
* 减少文件大小，一是可以减少存储空间。二是通过网络传输文件时，可以减少传输时间。

###	USAGE

*	在nginx中使用gzip压缩很方便。只要将默认的注释除去，加上一些配置即可。
* `vim /etc/nginx/nginx.conf`

```javascript
gzip on;
gzip_min_length 1k;
gzip_http_version 1.1;
gzip_buffers 4 16k;
gzip_types text/plain application/x-javascript text/css text/javascript;
gzip_comp_level 2;
gzip_vary off;
gzip_disable "MSIE [1-6]."
```

1.	`gzip on` 开启gzip
2. `gzip_min_length` 当返回内容大于这个值时会进行压缩，以K为单位，如果值为0，所有页面都进行压缩，但没有必要。
3. `gzip_http_version` 识别http协议的版本。默认值为1.1，就是对HTTP/1.1协议的请求才会进行压缩。
4. `gzip_buffers` 设置系统获取几个单位的缓存用于存储gzip的压缩结果数据流。
5. `gzip_types` 设置需要压缩的MIME类型，非设置值不进行压缩。
	*	`text/html`默认已经压缩
	*	图片可不开启压缩，jpg/gif/png格式的图片本身就是压缩过的。
6.	`gzip_comp_level` 设置压缩等级，等级越低压缩速度越快文件压缩比越小，传输块但也比较耗费CPU。可设置为1-9，默认是4。
7. `gzip_vary` 判断HTTP是否支持压缩，如果不支持的就不压缩。
8. `gzip_disable` 禁用IE6的gzip，IE6支持不好，不过这年头用IE的人也不太想理会了……

PS：公司缺少运维，真心锻炼前端的全栈能力……

<blockquote>
	参考：[开启Nginx的Gzip压缩功能](https://www.insp.top/article/open-nginx-gzip-module)

</blockquote>






