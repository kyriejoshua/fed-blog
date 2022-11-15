## 个人博客源码部分

### Requirements

* **hexo v6.3.0:**
  * ~~hexo v5.4.0~~
  * ~~hexo v4.2.1:~~ hexo 4.x 版本不支持 node v8.x 以下版本，因为有正则表达式报错
  * ~~hexo v3.9.0~~ 多次构建后，豆瓣使用可能会不稳定，估计是频繁调用接口问题，太多次会无法调用接口。
    * 接口调用失败后，豆瓣读书通过手动添加 cookies 的方式可以调用。先访问豆瓣，再复制 Cookie, 放入 headers 中。电影还未尝试。
    * 豆瓣分页 30
* **node v13.12.0**
  * ~~node v8.9.4~~

### Table of Contents

* **source/** 下是源文件，用于生成博客的md文件等
  * **source/about** 在 v4.2.0+ 之后会渲染所有文件，所以更新了 **static** 文件夹来独立存放静态资源文件，防止被渲染
* **scaffolds/** 脚手架
* **_config.yml** 是有关博客的基本配置,如应用主题及目录标签等
* **themes/** 下是几个主题，目前使用的是 `minos`.现在作为一个子模块使用，推送到自己 `fork` 的项目里。样式有更新，且新增了打赏功能，引用一个库加入了豆瓣读书和豆瓣电影。

### Usage

* `hexo s` 或 `npm start` 启动服务
* `hexo clean` 或 `npm run clean` 清除 `public` 目录
* `hexo douban -b` 或 `npm run douban` 生成豆瓣阅读页面
* `hexo g` 或 `npm run generate` 生成 public 目录
* `hexo d` 或 `npm run deploy` 部署
* 一键部署：`npm run build` 或 `npm run publish`.
  * `npm run build` 串行运行了相关的部署脚本。
  * `npm run publish` 也可以执行部署，依次执行 `prepublish`、`publish`、`postpublish`.
    * ~~执行时理论上应当按顺序执行 `prepublish`、`prepare`、`prepublishOnly`、`publish`. 但中间两个没有执行，似乎是 npm 版本的问题~~。
  * 部署电影和书时可能会耗时较长-3mins 左右。电影页面已生成，但不提供入口。入口自寻。
  * 长时间不使用豆瓣功能，cookie 会失效，需要重新注入，在相应生成器里(book-generator)进行保存。

#### Others

* 图片最佳大小为 800 * 342.2/1200 * 520

#### Bugs to Fix

* 三层级的列表会导致排版问题: 目前通过加 `<br/>` 标签解决
* 有序列表含二级列表会导致排版问题: 解决办法同上
* 二级以上列表再添加代码片段会导致排版问题
