---
title: 我的 git 工作流
date: 2017-07-07 18:58:44
tags: Git
categories: Git
---

<hr>

![](/2017/07/07/my-git-workflow/unphoto.jpg)

这篇文章的契机是曾经有个同事问我为什么要在终端里使用 git, 当时我愣了会，因为从没有人问我这个问题，我也没有为这问题好好总结过。虽然其实有很多显而易见的好处，但我还未好好总结一番。既然自己平时在工作中使用 git 的地方非常多，也有着一套标准和工作方式在执行，那我希望通过这次整理把这流程体系更完善的加以说明。既规范化、提高工作效率，也可留作记录。

<!--more-->

## 基本流程

* 首先是最基本的操作，从一次工作的开始到结束。这是一个比较基础的流程。
* `Working Directory`(工作区) => `Staging Area`(暂存区) => `Git Repository`(git 仓库)

    ```bash
    git checkout -b feature-new
    git status
    git add .
    git commit [-m 'commit message']
    git checkout develop|master
    git merge feature-new
    ```

  * 从当前分支切出一个新分支，在该分支下进行开发。
  * 在工作区内修改文件，当任务完成时，添加所有改动文件到暂存区，然后提交，注明提交信息。
  * 提交完成后，切回到原始分支，然后 merge 刚刚完成的功能分支。


* 而在这过程中，有许多地方可以改善，或者根据实际应用场景，有很多部分可以扩展。
* 这里以三种状态为界限展开。

### Working Directory and Staging Area

* 工作区是自己开发时的部分。通常当一个新需求降临时，我们从 develop|master 切出分支，即自动停留在这阶段。
* 当需求开始开发，改动了部分代码而没有完成任务，这时我使用 `git add .` 来将代码保存到暂存区。
* `git add .`的适用场景还包括但不限于以下：
  * 睡午觉。
  * 泡咖啡。
  * 吃晚饭。
* 简言之，是工作因故暂时停止而任务又没有完成时，适合使用该命令。

### Git Repository

* 当一个需求或任务完成时，我们需要将改动提交上去。
* 最常见的是，当一项任务完成时，我们先把所有改动放到暂存区，然后运行 `git commit -m 'feat: 完成xx功能'` 来将这次改动提交到仓库。必要时再将分支 push 到远程。


<hr/>

* 以上是对基础使用的扩展总结。但，如果只谈这些这篇文章就毫无价值了。以下是一些进阶使用方式——毕竟任何事都不会只有基础那么简单。这些使用对我工作的效率是有极大帮助的。

## 进阶使用

### Working Directory and Staging Area

#### `git status`优化

* 个人而言，在未开发完需求时，最常见的使用 git 时机是查看当前的改动状态，有多少文件修改，有多少文件已经放在暂存区。
* 这时通过`git status`来查看文件状态。

  {% asset_img gitStatus.png git status %}

* 不过，正因为频繁使用。完全可以简化查看内容。
* `git status -sb(git status -short -branch)`查看分支情况并简化信息。

  {% asset_img gitStatus2.png git status short %}

* 简便多了。


#### `git diff`优化

* 一个常见的场景是需要查看当前代码的改动部分——我想大部分人都不会刻意去记住自己究竟改了哪些代码。
* 运行`git diff`查看当前改动的文件:

  {% asset_img gitDiff.png git status short %}

* 这里我用[diff-so-fancy](https://github.com/so-fancy/diff-so-fancy)优化排版了diff 的查看。
* 简单直接对吧。
* 如果文件多也不怕，可直接查看单个文件。

  {% asset_img gitDiffFile.png git diff file %}

#### `git stash`和`git stash apply`

* 这是个可能有些人不熟悉的命令，但实际上很有用。
* 想象一下这个场景，你在自己分支上改了部分代码，突然某个环境有个严重问题要你切换到 master 或某个分支马上查看，这时工作没完成并不适合提交，放在暂存区的话不方便切换分支。`git stash`在这里就很有必要了。
* `git stash`保存当前工作进度，代码改动。然后你可以尽情地切换分支，在别的分支上修复完问题后再回来，使用`git stash apply`恢复即可。
* 改动了部分代码：

  {% asset_img gitStash.png git status -sb %}

* 保存代码改动：

  {% asset_img gitStash2.png git stash %}

* 当在其他分支完成后再回到当前分支恢复：

  {% asset_img gitStashApply.png git stash apply %}

#### `git checkout .`撤销修改

* 有时候会遇到这样一个情况，午睡时或喝咖啡或其他小伙伴过来故意动手动脚开玩笑的时候，不小心按到键盘上的某些键，而且该死，正好打在了编辑器上。我们当然不会傻到一个个去找出来然后动手删掉。
* 这时只要用`git checkout .`来取消所有修改。
* `git checkout file`——或者发现只有一个文件改动时。

### Git Repository

#### `git commit`优化: 使用 commit message 规范提交

* 如果你临时起意想要创建一个项目用来随意把玩，那自然随意提交即可。但只要项目是多人维护，多人开发的，或者有回顾自己以往的改动记录的需求的，commit message 就显得很有必要了。
* 我参考阮一峰老师的如下规范来编写 commit message.

  {% asset_img gitCommitMessage.png git commit message %}

* 例如刚才的改动，使用`git commit -m 'feat: 完成 demo4'`来提交。

  {% asset_img gitCommit.png git commit -m 'feat: demo4' %}

* 这里我写错了，少写了*完成*两字，不过没关系，下一节有说明。

* 如果严格遵守规范，那么回顾过往的提交记录时，结果将是一目了然的。

  {% asset_img gitCommitMessageLog.png git log --oneline %}

* 而即便没有以上较麻烦的规则，严格遵守自己的规则也是必要的，这使得你能够清楚直接的了解自己过去、或者别人过去在这个项目里面做了什么。

  {% asset_img gitCommitMessageLog2.png git log --oneline %}

#### `git commit`补充

* 正常的提交像上面按规则使用`git commit`即可。但如果突然发现自己的提交信息有误，或者遗漏了重要的信息。没关系，仍然可以修改刚才的提交——**只要你还未 push 到远程**！
* `git commit --amend`命令可以将当前的改动补充到前一次提交中。
* 刚才我提交过快，把`feat: 完成 demo4`写成了`feat: demo4`, 现在我改回来。

  {% asset_img gitCommitAmend.png git commit --amend %}

* 这点在补充完善 commit message 时非常方便。***但也需要非常注意，这只适用于还未 push 时，否则会引起一些小麻烦。***

#### `git rebase`合并提交

* 很多时候，一个需求的完成需要数天时间，迫于各种原因，期间会提交数次。但总的来说，我们只是完成了某个需求。所以并不需要中间的或者前几次提交，这时候合并提交就显得有必要了。
* `git rebase -i HEAD~n`可以合并前几次提交。
* 合并前：

  {% asset_img gitRebase.png git log --pretty=oneline  %}

* 现在我们将最近两次提交合并`git rebase -i HEAD~2`:
* 这里清楚显示了各命令用法，我们使用`squash`来合并，把第二个 pick 改为 squash.

  {% asset_img gitRebase2.png git rebase -i HEAD~2  %}

* 可以再次编辑 commit message, 我们精简一下，写在一起。

  {% asset_img gitRebase3.png git rebase -i HEAD~2  %}

* 完成后可见提示。

  {% asset_img gitRebase4.png git rebase -i HEAD~2  %}

* 这时再查看记录：

  {% asset_img gitRebase5.png git log --oneline  %}
  {% asset_img gitRebase6.png git log %}

* 两条 commit 已经合为一条。
* ***和`git commit --amend`类似，因为涉及到修改 commit 历史，所以千万不要在`git push`后尝试哦！***

#### `git log`优化

* `git log --oneline`以一行的形式快速查看提交记录，这个可见刚才的提交记录。
* `git log -p`查看提交记录同时也查看具体改动的代码部分——这在 code review 时非常方便。
* `git log -p file`查看单个文件提交记录同时也查看具体改动的代码部分——这在找错时非常方便，再也不用到处找人询问是哪个家伙改了 XX 文件的代码了。

  {% asset_img gitLogPFile.png git log -p %}

* `git log --stat`查看提交记录的时候显示文件改动信息——也很适合 review 或排查错误.

  {% asset_img gitLogStat.png git log -stat %}

* `git log --auther=zhengyuan zhu`查看某个家伙的提交记录——我没改这部分代码啊，看看那个家伙做了什么(这家伙究竟有没有好好工作)。
* `git shortlog`简化版提交记录。
* `git shortlog -s -n`查看所有人提交次数并排序——或许这样看更加简洁方便。

  {% asset_img gitShortlog.png git shortlog -s -n %}

* 很高兴看到在这个项目里我贡献的部分较多。

#### 其他

* `git pull --rebase`可以简洁 pull 过程——适合洁癖者——我是很反感在查看 log 时看到一堆 merge 记录和情况。即有时如果远程仓库和本地仓库代码不一致时，`git pull` 会自动进行一次合并，这条记录突兀地存在于 commit history 里，我觉得毫无必要。
* `git pull --rebase`过程中可能会遇到冲突，解决后用`git rebase --continue`来继续。或者觉得这次不稳，可以用`git rebase --abort`来取消。
* 如图所示的`f6c5d08`和`6cbd73f`提交就可以通过`git pull --rebase`避免。

  {% asset_img gitPullRebase.png git pull --rebase %}

### 小结

* 这里罗列了我常用的 git, 还有部分因篇幅原因不能再一一列举。可能更适合再写一篇来总结。相比之下，我觉得 GUI 很难做到像这样随心随欲地做到自己想用 git 所做的事。而这些完全可以使用一行命令搞定的事，我也不高兴去将手从键盘区移开然后去挪动笨重的鼠标去一个个点击。

* 希望大家都可以学好 git, 善待 git, 然后在 CLI 里尽情使用 git 吧.

<hr>
{% asset_img reward.jpeg Thanks %}
