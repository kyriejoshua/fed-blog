---
title: 升级 MacOs Mojave 后的兼容问题解决
date: 2018-11-23 17:13:31
tags: compatibility
categories: macos
---

<hr>

![](/jo.github.io/2018/11/23/the-compatibility-issues-in-macos-mojave/unphoto.jpg)

升级 MacOs Mojave 后不免会遇到兼容性问题，这里列举几个自己遇到的，后面列出了解决方案。
推荐：★★☆

<!-- more -->

## 索引

- [问题概览](#问题概览)
- [小结](#小结)
- [参考](#参考)

### 问题概览

1. [终端启动报错](#终端启动报错)
2. [xcode运行报错](#xcode运行报错)
3. [vim报错](#vim报错)

### 终端启动报错

#### 问题描述

* 打开终端时，直接报错 `manpath: error: unable to read SDK settings for '/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk'`

#### 解决方案

* 升级 xcode 和 commandline tools.
* 在应用商店里升级 xcode 后，运行 `xcode-select --install`. 再重启终端即可。

### xcode运行报错

#### 问题描述

* 打开 xcode 跑项目时，之前可以跑的项目无法运行。

#### 解决方案

* 打开 File => Project Setting, 将里面的 Build System 的 New Build System 选项改为 Legacy Build System. 升级前就是这个选项 Legacy Build System.

### vim报错

#### 问题描述

* 在运行 `git commit --amend` 等不直接使用 vim 的命令时，报错。

```shell
Vim: Caught deadly signal SEGV
Error detected while processing function 70_PollServerReady[7]..70_Pyeval:Vim: Finished.

line 4:
Exception MemoryError: MemoryError() in <module 'threading' from '/System/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7/threading.pyc'> ignored
```

#### 解决方案

##### vim 直接报错

* 重新下载 vim.
  * 运行 `brew install vim --with-lua --with-override-system-vi`
* 重启 shell.
* 如果是 vim 直接打开的报错。那么以上步骤可以解决问题。

##### vim 其他报错

* 如果是在运行其他命令时出现该报错。则很可能是 YouCompleteMe 插件的问题。
* 首先继续执行上述重新下载 vim 的步骤。
* 然后进入对应目录下。
  *  `cd ~/.vim/bundle/YouCompleteMe`
* 更新代码插件的代码。
  * `git pull`
* **更新子模块的代码。这步很重要，不能遗忘。**
  *  `git submodule update --init --recursive`.
* 更新后需要重新编译插件，在当前目录下执行编译。
  * `python install.py`
* 如果不编译，会出现这样的报错。
  * `The ycmd server SHUT DOWN (restart with ':YcmRestartServer'). YCM core library too old; PLEASE RECOMPILE by running the install.py script. See the documentation for more details.`
* 问题解决。
* 如果报错依然存在，试试在 `~/.vimrc` 文件中先将 YouCompleteMe 插件注释，再取消注释后重启。

### 小结

* 以上是目前在升级系统后遇到的兼容问题，都得到了解决。后续再遇到问题，再进行补充。

### 参考

{% blockquote %}
[Update MacOS to Mojave, then vim get error with powerline](https://github.com/powerline/powerline/issues/1947)
[更新 macOS Mojave 后 vim 打不开](https://ltaoo.github.io/2018/10/22/%E6%9B%B4%E6%96%B0%20macOS%20Mojave%20%E5%90%8E%20vim%20%E6%89%93%E4%B8%8D%E5%BC%80/)
{% endblockquote %}


<!-- 4h -->
