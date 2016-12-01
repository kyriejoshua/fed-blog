---
title: 如何让你的Sublime Text独具一格
date: 2016-05-03 16:03:09
tags: 编辑利器
---

<hr>

{% asset_img sublime.png text%}

### sublime 养成记

{% blockquote %}
作为大多数前端攻城狮的主力编辑器，怎么能不让它美一些呢。
打开偏好設置，參照以下配置，开启你神祕的sublime text 3之旅吧！
{% endblockquote %}

<!--more-->

```json
	{
		"auto_find_in_selection": true,    // 开启选中范围内搜索
		"bold_folder_labels": true,   // 侧边栏文件夹显示加粗
		"caret_style": "smooth",
		"color_scheme": "Packages/Colorsublime - Themes/Easyballs.tmTheme",
		"default_encoding": "UTF-8",
		"default_line_ending": "unix",   // 使用unix风格的换行符
		"draw_minimap_border": true,   // 右侧代码预览时给所在区域加上边框
		"ensure_newline_at_eof_on_save": true,   // 保证在文件保存时，在结尾插入一个换行符。这样git提交时不会产生额外的diff
		"fade_fold_buttons": true,   // 默认显示行号右侧的代码段闭合展开三角号
		"font_face": "Monaco",   // 个人最钟爱的字体
		"font_size": 19,
		"font_weight": 700,
		"highlight_line": true,   // 当前行高亮
		"highlight_modified_tabs": true,   // 高亮未保存文件
		"ignored_packages":
		[
			"Vintage"
		],
		"save_on_focus_lost": true,   // 窗口失焦立即保存文件
		"tab_size": 2,
		"theme": "Spacegray.sublime-theme",  //主题推荐，除了使用的以外，Material和Seti_UI 这两款都很美，比太空灰更美
		"translate_tabs_to_spaces": true,   // 将tabs转换为space
		"trim_automatic_white_space": true,   // 自动移除多余空格
		"trim_trailing_white_space_on_save": true // 保存时移除多余空格
	}
```


### 常用插件

* 插件安装包 [package control](https://packagecontrol.io/installation)
  * ConvertToUTF8: GBK编码兼容

  * JsFormat: javascript格式化，包括json.切换Syntax后按 Ctrl+Shift+A?格式化

  * ColorSublime:用来安装官网的所有主题。

  * Color Highlighter: 高亮CSS中的颜色，可以设置成用背景色或者边框提示颜色
    *	` { "ha_style": "filled", "icons": false }`

  * DocBlockr: 代码块注释
    * `/*`:回车创建一个代码块注释
    * `/**`:回车在自动查找函数中的形参等等。 

  * Git: 还没学会用。

  * Modific: 高亮文件上次提交后的改动，适合git和svn

  * BracketHighlighter 括号高亮

  * BracketGuard 高亮错误的括号

  * Better coffeescript

  * ColorPicker 拾色器 (这个可以用其他软件替代)

  * CSScomb: 给css的属性排序，默认按键是ctrl+shift+c，使用后能会留有空行，再和下面的格式化插件配合使用，效果最佳

  * CSS Format css格式化插件 // 先`cmd+shift+p` 然后选择选项，个人习惯选择 `Format CSS: Expanded`

  * CSS3 支持CSS3，语法高亮，自动补全

  * Ctags 跳进方法内部，不过配置有些麻烦

  * Jade

  * Javascript Next: 支持es6，还未使用

  * LiveStyle 支持实时调整CSS属性 需要文件路径 chrome也要安装插件 不常用

  * SCSS

  * SyncedSidebarBg 让侧边栏和中间背景色相同

  * typescript

  * Babel ES6/2015 和 React JSX上添加语法高亮

  * ES6语法检查 [eslint](http://javascript.ruanyifeng.com/tool/lint.html#toc3)
    *	首先是要系统全局安装eslint, 运行`npm install -g eslint`，`npm install -g babel-eslint` 
    *	下载插件 `sublimeLinter`
    *	下载 `sublimelinter-contrib-eslint`
    *	下载完成后修改Sublimelinter 配置，Preferences->Package Settings->SublimeLinter->Settings-User,
    *	debug: true 开启 debug 模式 paths: 根据具体环境，设置 ESLint 路径
    *	例如：

    ```json
    {
    "user": {
        "debug": true,
        ...
        "linters": {
            "eslint": {
                ...
                "excludes": ["*.html"]
            }
        },
        ...
        "paths": {
            ....
            "osx": [
                "/usr/local/node/v0.12.7/bin"
                // 如果用nvm装的会是这个
                "/Users/kyriejoshua/.nvm/v0.10.30/bin/"
            ],
            "windows": [
             "C:\\Users\\用户名\\AppData\\Roaming\\npm"
            ]
        } 
        ...
    }
    }
    ```
    *	然后在项目根目录下生成eslintrc.json文件
       * 运行`eslint --init`
    *	选择一些基本配置生成文件
    *	具体配置看[这里](https://github.com/y8n/ESLint-rules-docs-cn)
    *	'off' or 0 关闭规则
    *	'warn' or 1 将规则视为警告
    *	'error' or 2 将规则视为错误


### 受不了自帶的丑陋图标？——更换图标方法

<blockquote>
	– You got the replacement icon (whatever file type, not neccessarily icns) somewhere, open it with Preview.点击准备替换的图标。
	– Cmd + Option + 2 to open Preview’s Thumbnail pane.
	– Select the image in the Thumbnail pane and Cmd + C  复制选中图标
	– Use Cmd + I to open the Info panel for the App. 打开app的图标预览
	– You see the small icon at the top left of the Info panel. Click to select and Cmd + V 选中粘贴
	
	That’s it! It might take longer than your method, but it doesn’t require the icon to be with “.icns” extension.

</blockquote>

##### 参考

* [sublime中文文档](http://sublime-text.readthedocs.org/en/latest/index.html)
* [sublime text3配置](https://www.zybuluo.com/king/note/47271)

