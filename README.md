## 个人博客源码部分

### Requirements

* node -v 6.6.0
* 旧版本 0.10.30 (与Hexo版本同步，现已更新)

### Table of Contents

* **source/** 下是源文件，用于生成博客的md文件等
* **scaffolds/** 脚手架
* **_config.yml** 是有关博客的基本配置,如应用主题及目录标签等
* **themes/** 下是几个主题，目前使用的是 `minos`.现在作为一个子模块使用，推送到自己 fork 的项目里。样式有更新，且新增了打赏功能，引用一个库加入了豆瓣读书和豆瓣电影。

### Usage

* `hexo s` 启动服务
* `hexo clean` 清除 `public` 目录
* `hexo douban -b` 生成豆瓣阅读页面
* `hexo g` 生成 public 目录
* `hexo d` 部署

#### Others

* 图片最佳大小为 800 * 342.2/1200 * 520

#### Bugs to Fix

* 三层级的列表会导致排版问题: 目前通过加 `<br/>` 标签解决
* 有序列表含二级列表会导致排版问题: 解决办法同上
* 二级以上列表再添加代码片段会导致排版问题
