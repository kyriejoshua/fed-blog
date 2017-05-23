---
title: 从 zsh 到 fish, 让你的 shell 更可爱更友好
date: 2017-05-21 14:01:17
tags: Shell
categories: Shell
---

<hr>

{%  asset_img unphoto.jpg terminal %}

<blockquote><br/>前阵子关注到阮老师更新了一篇博文，内容是介绍一个 shell —— fish.自己去尝试之后发现确实值得推荐，准备当做主力 shell 来替代原有的 zsh. 

</blockquote>

<!--more-->

## 索引

- [介绍](#介绍)
- [安装(想吃热豆腐的点这里)](#安装和使用)

### 介绍

### 为什么抛弃 zsh 投向 fish 的怀抱

* zsh 作为我的主力 shell 用了很久，而且没有什么做不到，那为什么我要抛弃呢。这并不是恋爱中的喜新厌旧。也并不是 zsh 不好，而是 fish 太好了。在简短的试用之后，我决定留下它。因为体验实在是太丝滑流畅了。

* 这里列几点最直观的感受。

#### 1. 自动补全和自动建议

*  zsh 固然有着强大的自动补全命令。不过和 fish 相比，就是小巫见大巫了。fish 的命令，除了在自动补全以外，还会标记命令的对错，输入命令的正确与否，通过颜色显示地一目了然。这里因为配色的关系，颜色对比可能不明显，但仍可以看到，红色清楚的标识了无效命令。

{% asset_img fish1@2x.png fish wrong command %}

* 下面这张图显示的是有效命令：

{% asset_img fish2@2x.png fish correct command %}

* 细心的朋友可能还发现了刚才图中灰色的完整命令。这属于 fish 的自动建议。下面这张图可能显示地更直观(点击查看大图)：

{% asset_img fish3@2x.png fish command %}

* 尽管 zsh 有着模糊匹配历史命令的功能，但显而易见，这里的 fish 在你输入第一个字母就知道你要做什么的体贴，让用户体验有了极大的提升。就像贴心的女友，知心的姐姐一样为你包办所有。

* 除此之外，fish 在匹配历史命令的同时，也能标识无效命令。红色醒目地标出：

{% asset_img fish4@2x.png fish wrong command %}

#### 2. 效率

* 使用终端 shell 的一大原因，就是效率高。有时有人问我，为什么明明有 git 图形化工具，却还要使用命令行。我想来想去，虽然图形化工具显示直观，但比起命令行，操作起来太慢，况且有许多命令并不支持。

* 那么既然使用 shell 本身就是为了提升效率，那怎么能忍受一个速度奇慢的 shell 呢。这里的两幅图清晰地说明了各自的效率：

{% asset_img fish5@2x.png fish %}

{% asset_img fish6@2x.png zsh %}

* 在两种 shell 下连续按下回车键，可以看到以上两个结果。前者是 fish, 后者是 zsh. 可以看到后者有明显的卡顿。也许正是因为 zsh 过于强大，功能过多，导致运行起来奇慢无比。最终让我无法忍受。

#### 小结

* 对我个人来说，以上两点足够我切换 zsh 到 fish 了。也许其他人有着自己的看法，但我目前还没有发现 fish 使我不爽的地方，因此近期会继续用下去。

### 安装和使用

#### 安装 [fish](https://github.com/fish-shell/fish-shell)

* 在 macOS 下，安装有多种方式，这里列出采用 homebrew 安装的方式，十分简便。

```shell
	$ brew install fish
```

* 安装成功后，输入 `fish` 后，就可以开启全新的奇妙历程了。

* 如果你已经迫不及待想要把他设为默认 shell 的话：

```shell
	chsh -s /usr/local/bin/fish
```

* 假如有提示说 fish 并不是标准 shell. 运行如下命令将 fish 加到系统的默认 shells 中。再运行上面的命令设置即可。

```shell
	echo /usr/local/bin/fish | sudo tee -a /etc/shells
```

* 设置完之后，重启你的 iterm/terminal, 就能看到全新的 fish shell 了！

#### 使用

* fish 的基本配置在 `~/.config/fish/config.fish` 文件里. 如果安装好 fish 后没有这个文件，可以新建一个。

* fish 支持通过 web 界面更改配置文件。运行 `fish_config` 可查看。

* 可以通过更改如下配置来设置 fish 的问候语，它会在每次进入时输出。

```shell
	set fish_greeting 'Talk is cheap. Show me the code.'
```

* zsh 有许多好用的 alias, fish 同样可以。最快捷的方式也是在配置文件里直接输入，以下是我的 git alias.

{% asset_img fish7@2x.png git alias %}

* 如果你和我一样是前端，那么很有可能也使用 nvm 来管理 node. fish 没有相关的工具，不过可以通过更改配置来使其生效。

```shell
	bass source ~/.nvm/nvm.sh
```

* 也许你在 zsh 中安装了 thefuck 插件，是的，在 fish 中也可以使用。

```shell
	eval(thefuck --alias | tr '\n' ';')
	alias fuck-it='export THEFUCK_REQUIRE_CONFITMATION=True; fuck; export THEFUCK_REQUIRE_CONFIRMATION=False'
```

* 也许你也装了 autojump 插件，是的，同样可以在这里使用。加入以下代码：

```shell
	begin
	  set --local AUTOJUMP_PATH $HOME/autojump/bin/autojump.fish
	  if test -e $AUTOJUMP_PATH
	    source $AUTOJUMP_PATH
	  end
	end
```

* 这里主要是核对 autojump.fish 这个文件。路径对即可生效。

* 如果以上两个插件还未安装的话，首先使用 homebrew 安装即可，`brew install thefuck`, `brew install autojump`.

#### 一些工具

##### [oh my fish](https://github.com/oh-my-fish/oh-my-fish)

* 和 zsh 有着 `oh my zsh` 一样，fish 也有 `oh my fish`. 可以在终端中输入如下命令安装：

```shell
	curl -L https://get.oh-my.fish | fish
```

* `oh my fish` 通过运行 `omf install [<name>/<url>]` 来安装插件。例如运行 `omf install ocean` 安装主题。
  * `omf list`: 列出当前安装的包。
  * `omf theme <theme>`: 列出所有主题/应用某个主题。
  * `omf remove <name>`: 移除某个包。

##### [fisherman](https://github.com/fisherman/fisherman)

* fish 还有一个管理插件的工具 fisherman. 直接在终端中运行如下命令安装：

```shell
	curl -Lo ~/.config/fish/functions/fisher.fish --create-dirs git.io/fisher
```

* `fisherman` 通过运行 `fisher <name>` 安装插件。例如运行 `fisher z`.
  * `fisher ls`: 查看当前插件。
  * `fisher ls-remote`: 查看所有插件。
  * `fisher rm <name>`: 移除插件。

### 总结

* 以上就是我使用 fish 的记录和基本教程。事实上还有很多地方可探索，不过到此为止日常使用是没有问题了。希望大家也可以在使用 fish 的过程中感到愉悦快乐！

<div class="page-reward"><a href="javascript:;" class="page-reward-btn tooltip-top"><div class="tooltip tooltip-east"><span class="tooltip-item">赏</span><span class="tooltip-content"><span class="tooltip-text"><span class="tooltip-inner"><div class="reward-box"></div></span></span></span></div></a></div>

{% asset_img reward.jpeg Thanks %}
