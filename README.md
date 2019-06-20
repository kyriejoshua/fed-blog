## 个人博客源码部分

### Requirements

* hexo v3.7.1
* node v8.9.4
* ~~旧版本 0.10.30 (与Hexo版本同步，现已更新)~~

### Table of Contents

* **source/** 下是源文件，用于生成博客的md文件等
* **scaffolds/** 脚手架
* **_config.yml** 是有关博客的基本配置,如应用主题及目录标签等
* **themes/** 下是几个主题，目前使用的是 `minos`.现在作为一个子模块使用，推送到自己 fork 的项目里。样式有更新，且新增了打赏功能，引用一个库加入了豆瓣读书和豆瓣电影。

### Usage

* `hexo s` 或 `npm start` 启动服务
* `hexo clean` 或 `npm run clean` 清除 `public` 目录
* `hexo douban -b` 或 `npm run douban` 生成豆瓣阅读页面
* `hexo g` 或 `npm run generate` 生成 public 目录
* `hexo d` 或 `npm run deploy` 部署
* 一键部署：`npm run build` 或 `npm run publish`.
  * `npm run build` 串行运行了相关的部署脚本。
  * `npm run publish` 执行时理论上应当按顺序执行 `prepublish`、`prepare`、`prepublishOnly`、`publish`. 但中间两个没有执行，不知是否是 npm 版本的问题。
  * 部署电影和书时可能会耗时较长-3mins 左右。电影页面已生成，但不提供入口。入口自寻。

#### Others

* 图片最佳大小为 800 * 342.2/1200 * 520

#### Bugs to Fix

* 三层级的列表会导致排版问题: 目前通过加 `<br/>` 标签解决
* 有序列表含二级列表会导致排版问题: 解决办法同上
* 二级以上列表再添加代码片段会导致排版问题
