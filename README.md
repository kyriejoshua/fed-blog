## 个人博客源码部分

### Requirements

* node -v 0.10.30 (与Hexo版本同步，之后更新)

### Table of Contents

* **source/**下是源文件，用于生成博客的md文件等
* **scaffolds/** 脚手架
* **_config.yml** 是有关博客的基本配置,如应用主题及目录标签等
* **themes/** 下是几个主题，目前使用的是`minos`.且有部分自定义配置.修改部分未提交，但部署时是生效的。这个之后可能会考虑作为一个子模块使用。

### Usage

* `hexo s`启动服务
* `hexo clean`清除public文件夹
* `hexo d`部署