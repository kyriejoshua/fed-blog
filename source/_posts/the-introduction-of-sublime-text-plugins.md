---
title: Sublime Text 插件鼓捣
date: 2017-10-07 20:52:57
tags: sublime
categories: Tools
---

<hr>

{% asset_img unphoto.jpg Sublime Text %}

{% blockquote %}
不久前，sublime text 官方推出了一次大更新。这次更新几乎时隔一年，而且有重大改动，虽然我早用 dev 版提前体验了新版本，但也借此机会再鼓捣了下自己的工具。
{% endblockquote %}

<!--more-->

## 索引

- [Sublime Text 插件](#插件)
- [Sublime Text 下载](#下载)

### 插件

#### 1. [Git](https://packagecontrol.io/packages/SublimeLinter)

* 在 sublime 内使用 git.
* 因为我个人是在终端使用 git. 所以日常 git 不会在这里提交。但有一个比较实用的功能是查看当前文件的修改历史。比在终端里用 `git log -- [file]` 查看会方便一些。
* 在命令面板输入 `git log current file` 可以查看当前文件修改历史，查看有谁改过当前这个文件和具体改动了什么。

#### 2. [Git blame](https://packagecontrol.io/packages/Git%20blame)

* 查看当前行的修改历史。比前一个插件更加具体，直接查看当前行的最近一次改动负责人和提交记录。
* git 插件也有该功能，但使用起来不如这个方便。

#### 3. [GitGutter](https://packagecontrol.io/packages/GitGutter)
##### 3.1 [Modific](https://packagecontrol.io/packages/Modific)

* 在行号前形象地显示当前的改动差异。
* 后者也是一个可以显示改动的插件——但是它还支持 SVN 等。可选其一使用。

#### 4. [SublimeLinter](https://packagecontrol.io/packages/SublimeLinter)、[SublimeLinter-contrib-eslint](https://packagecontrol.io/packages/SublimeLinter-contrib-eslint)
##### 4.1 [Babel](https://packagecontrol.io/packages/Babel)

* sublime 编辑器内可以配合 eslint 使用来检查代码规范或是代码风格。只是要两个插件配合使用。
* 两个插件下载完毕即可使用。
* 如果没有生效的话，可以打开 sublimelinter 的用户设置检查 node 的路径是否正确，或者是否安装了相应的版本。
* [sublimelinter](http://www.sublimelinter.com/en/latest/) 官网还有更多使用配置。
* 该插件对使用 jsx 语法的 js 文件支持不太友好，所以你可能还需要这一个插件 Babel 来解析文件。

#### 5. [React ES6 Snippets](https://packagecontrol.io/packages/React%20ES6%20Snippets)
##### 5.1 [React Snippets](https://packagecontrol.io/packages/ReactJS%20Snippets)

* 写 react 非常实用的 snippets.
* 如果还没有使用 ES6 的话，那就使用后者。
* 其他框架自然也有。[AngularJS](https://packagecontrol.io/packages/AngularJS)、[Vuejs Snippets](https://packagecontrol.io/packages/Vuejs%20Snippets)、[Vue Syntax Highlight](https://packagecontrol.io/packages/Vue%20Syntax%20Highlight)、[j​Query](https://packagecontrol.io/packages/jQuery).

#### 6. [DocBlockr](https://packagecontrol.io/packages/DocBlockr)

* 友好的注释插件。支持 Javascript, PHP, CoffeeScript, Actionscript, C & C++ 等。

#### 7. [cssDOC](https://packagecontrol.io/packages/cssDOC)

* 右键在 MDN 上查询属性相关信息。快捷方便。

#### 8. [SyncedSideBar](https://packagecontrol.io/packages/SyncedSideBar)

* 打开文件时侧边栏定位到当前文件。在查看文件时会十分方便。

#### 9. [BracketHighlighter](https://packagecontrol.io/packages/BracketHighlighter)
##### 9.1 [BracketGuard](https://packagecontrol.io/packages/BracketGuard)

* 高亮括号对应项。
* 后者高亮使用错误的括号。

#### 10. [Material Theme](https://packagecontrol.io/packages/Material Theme)、[DA UI](https://packagecontrol.io/packages/DA%20UI)

* 最后推荐两款清爽的浅色主题。以下是效果图。

{% asset_img material.png Material Theme %}
<br/>
{% asset_img da.png DA UI Theme %}

* 清爽干净的 UI,是不是对最新版 sublime 已经跃跃欲试了呢。

### 下载

#### [Sublime Text](https://www.sublimetext.com/3) 在此。
##### 嫌 sublime 万年不更的小伙伴可以下载 [dev 版](https://www.sublimetext.com/3dev) ，其实暗地里啊，它更新地比 vsc 还勤呢。

### 题外话

* 在这个 vsc 分了半边天的代码工具里，我还是对 sublime 情有独钟。甚至我对 vim 也有着自己的偏爱。即便 vsc 或者 webstorm 方便到了令人发指的地步，我也希望还有人能坚守 sublime 等轻量级编辑器的阵地。因为我喜欢这个鼓捣的过程，喜欢把自己需要的东西一步一步手动加上去的过程，在这个过程中，会更加理解自己需要什么，不需要什么，对那些新增的插件的下载和使用也会有新的理解。而且我也相信有许多程序员和我有着相同的癖好。

* 偶尔我也会试用 vsc，但确实用不习惯。在丝滑流畅这一点上，它和 sublime 比还有一定的差距。而它相较于 sublime 的优势在我使用时却没有明显体会。类似直接查看函数的定义的功能，我反而认为自己去寻找可以更了解项目的整体结构。最终还是一句话，自己使用起来最舒服的工具就是最适合自己的工具。
