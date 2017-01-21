---
title: 个人git使用手册
date: 2016-03-03 19:03:09
tags: git
categories: Git
---

<hr>

{% asset_img unphoto.jpeg jake %}

### git安装

* 主要针对Mac环境下
* [安装说明](http://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)

<!--more-->

###	SSH

* 以下通常在测试时需要，因为需要连上主机 命令行里的输入方法（如果能在页面上做最好还是在网页上）
* 命令行里输入 `cat ~/.ssh/id_rsa.pub` 查看密钥、公钥方法
* 输入 `vim ~/.ssh/authorized_keys` 在内容里编辑，加上自己的公钥，这样可以方便以后每次测试或者做其他事时不再需要每次都输入密码（首先要输入密码进入 如`ssh root@10.0.0.246` 根据提示输入密码 ）
* 更详细的见以下链接
  * [`SSH使用说明`](https://help.github.com/articles/generating-ssh-keys/)

### 使用git

* 理解git的三种状态：已暂存、已修改、已提交 文件常常处于这三种状态之一
* 熟悉git的常用命令
* 如果提交文件时有需要编译的文件，就下载相应的编译 例如，在终端中输入：`npm intall -g coffee-script`
* 强烈推荐翻墙使用，下载更快，更方便
* git常用命令(自己不太熟的)：`git merge`-合并、`git revert`-回到某次提交的状态并产生一次新的提交、`git reset`-撤销某次提交 、、、、、、

git 遇到问题`error:bad line length character`
*  权限问题，或者修改Host

   ###查看历史提交记录

   *格式为作者，修改距离现在多久/提交时间：提交说名 -简短的哈希字串 展示分支合并、历史
   *`git log --pretty=format:"%an, %ar/%cd : %s -%h" --graph`
   *格式基本同上
   * `git log --pretty=format:"%h - %an, %ar/%cd : %s"`

### 撤销操作

#####	撤销
*  取消文件的暂存
   *`git reset HEAD <file>`来取消暂存
*  撤销对文件的修改 __！不推荐使用，不能还原__
*  `git checkout --<file>`

    #####补充提交
    *补充提交，会覆盖上次的提交，并不会产生一次新的提交
    *提交前用`git add <file>`加上补充的文件
    *`git commit --amend`

### 远程仓库
*	查看远程仓库
   *`git remote -v` 显示读写远程仓库使用的git保存的简写与其对应的URL
   *`git remote show origin` >查看远程仓库的更多信息
   *添加远程仓库
   * `git remote add <shortname><url>`例如：`git remote add pb http://www.google.com`
     *可以用pb来代替整个url 例如：`git fetch pb` 拉取远程仓库

##### 从远程仓库抓取和拉取
*	`git fetch [remote-name]` 并不会自动合并
   *`git pull` 会自动合并,相当于先执行`git fetch`再执行`git merge`

##### 推送到远程仓库
*  `git push [remote-name] [branch-name]

   #####远程仓库的移除和重命名
   *修改远程仓库的简写名
*  `git remote rename` 例如： `git remote rename pb paul` >将pb重命名为paul __!这个操作也会修改远程分支的名字__
    *移除远程仓库
   * `git remote rm`	例如：`git remote rm paul`

   ###打标签

   #####列出标签
*  git tag

    ###git别名

    *用于修改git操作的别名，使操作更方便
*  运行`git config --global alias.logpregra 'log --pretty=format:"%an, %ar/%cd : %s -%h" --graph'`
   * `git logpregra`就等价于 `git log --pretty=format:"%an, %ar/%cd : %s -%h" --graph`
     *常用的还有 `git config --glabal alias.ci commit`、`git config --global alias.co checkout`

##### 定义外部命令

*  替换外部命令而不是子命令时，在命令前面加一个__‘！’__号
   *`git config --global alias.visual '!gitk'`
   *定义`git visual`为gitk的别名

   ###分支简介

##### 查看分支

*	运行`git log --oneline --decorate --graph --all`	查看提交历史、各个分支的指向以及项目的分支分叉情况
   *在本机上已配置为`git logoneall`

##### 删除分支

*	`git branch -d [branch-name]`
   * 如`git branch -d watch-pro`

##### 合并分支

*	当有冲突存在时
   *其中之一方法利用图形化工具来解决冲突，运行`git mergetool` >git中默认的合并工具是opendiff

##### 分支管理

*	`git branch --merged` 查看哪些分支已经合并到当前分支
   *查看所有包含未合并工作的分支，
   *`git branch --no-merged`
   *使用`git branch -d`命令来删除未合并的工作时会失败，因为它还未合并
   *但如果确实想丢掉那些工作，可以用`-D`选项强制删除

### 远程分支

* 远程分支以 (remote)/(branch)形式命名
* 运行`git ls-remote (remote)` 来显式地获得远程引用的完整列表 >就是远程的所有分支,或者使用`git branch -a`来查看远程分支，似乎这个比前者更有效
* 更换远程分支的名字 `git clone -o booyah` 那么远程分支的名字就会是 booya/master
* 更新远程仓库到本地的命令 `git fetch teamone` 抓取远程仓库teamone有而本地没有的数据

* _假如刚刚克隆了一个仓库，想要获取一个远程分支，先在当前分支下pull，保证是最新的，然后运行`git checkout -b index-pro origin/index-pro`_
* _这样你就有一个同名分支index-pro和远程的分支index-pro同步了_

##### 推送
* 推送本地的分支到服务器上 `git push origin servefix`等同于 `git push origin servefix:servefix` 如果不想让远程的分支重名  可以这样`git push origin servefix:awesomebranch`

  ####如何避免每次输入密码
* 如果你正在使用 HTTPS URL 来推送，Git 服务器会询问用户名与密码。 默认情况下它会在终端中提示服务器是否允许你进行推送。
* 如果不想在每一次推送时都输入用户名与密码，你可以设置一个 “credential cache”。 最简单的方式就是将其保存在内存中几分钟，可以简单地运行 `git config --global credential.helper cache` 来设置它。

***
##### 跟踪分支（上游分支）：与远程分支有直接关系的本地分支
* 在远程跟踪分支之上建立本地的分支进行工作 `git checkout -b [branch] [remotename][branch]`
* 例如 `git checkout -b serverfix origin/serverfix`
* 可以用`--track`快捷方式
* 例如 `git checkout --track origin/serverfix`
* 设置本地分支与远程分支为不同的名字
* `git checkout -b sf origin/serverfix` 本地分支sf会从origin/serverfix拉取
* 设置本地已有的分支跟踪一个新的拉取下来的远程分支，或者修正正在跟踪的上游分支，可以使用`-u`和`--set-upstream-to`选项运行 `git branch`
* 例如 `git branch -u origin/serverfix`
* 查看设置的所有跟踪分支 运行`git branch -vv`

##### 上游快捷方式
* 当设置好跟踪分支后，可以通过 @{upstream} 或 @{u} 快捷方式来引用它。 所以在 master 分支时并且它正在跟踪 origin/master 时，如果愿意的话可以使用 `git merge @{u}` 来取代 `git merge origin/master`。

***
##### 删除远程分支
* 通常在通过远程分支做完所有工作了以后操作，一般这个删除只是删除了指向服务器的指针，并不会删除数据，服务器会保存一段时间的数据，直到垃圾回收运行，也容易恢复
* `git push origin --delete serverfix`

### git分支-变基

*	git中整合来自不同分支的修改主要有两种方法：`merge`和`rebase`
   *__变基即在新分支上引入补丁和修改，然后在原分支上再应用一次__
   * 运行`git checkout [branch-name]`
     *`git rebase master`
     *然后合并 `git checkout master`
     *`git merge [branch-name]`
     *变基使得提交历史更整洁

__*图例说明*__
***
![变基例子](http://git-scm.com/book/en/v2/book/03-git-branching/images/interesting-rebase-1.png)
*	将client的修改合并到主分支并发布，但暂时不合并server的修改
   *这时可以使用 `git rebase`命令的`--onto`选项，选中在client分支里但不在server分支里的修改，在master分支上重演
   *`git rebase --onto master server client`
   *取出client分支，找出处于client分支和server分支的共同祖先之后的修改，然后把它们在master分支上重演一遍。
   *然后可以快进合并master分支了
   *`git checkout master`
   *`git merge client`

![变基后合并](http://git-scm.com/book/en/v2/book/03-git-branching/images/interesting-rebase-3.png)

*	接下来再把server分支中的修改也整合进来，使用`git rebase [basebranch] [topicbranch]`
   *`git rebase master server`

![合并另一分支](http://git-scm.com/book/en/v2/book/03-git-branching/images/interesting-rebase-4.png)

*	然后再合并主分支master
   *`git checkout master`
   *`git merge server`

![效果图](http://git-scm.com/book/en/v2/book/03-git-branching/images/interesting-rebase-5.png)

##### 变基的风险(不太理解)
*	__不要对在仓库外有副本的分支执行变基__

*__图例说明__*
***
![3-36.克隆仓库并开始开发](http://git-scm.com/book/en/v2/book/03-git-branching/images/perils-of-rebasing-1.png)

* 接下来，有人向中央服务器提交了修改，其中包括合并。然后你抓取了远程分支的修改，将其合并到本地的开发分支，然后提交历史就会变成这样。

![3-37.抓取别人的提交，合并到自己的开发分支](http://git-scm.com/book/en/v2/book/03-git-branching/images/perils-of-rebasing-2.png)

*	刚才的那个人又把合并操作回滚，改用变基，然后又用`git push --force`命令覆盖了服务器上的提交历史。之后你再从服务器抓取更新，会发现多出来些新的提交。

![3-38.有人推送了经过变基的提交，并丢弃了你的本地开发所基于的一些提交](http://git-scm.com/book/en/v2/book/03-git-branching/images/perils-of-rebasing-3.png)

*	如果此时执行`git pull`,会合并来自两条提交历史的内容，生产成一个新的合并提交，如下图。

![3-39.你将相同的内容又合并了一次，生成了一次新的提交](http://git-scm.com/book/en/v2/book/03-git-branching/images/perils-of-rebasing-4.png)

*	如果现在执行`git log`命令，会发现有两个提交的作者，日期，日志是**一样**的。
   * 而且如果将这堆推送到服务器上，那么实际上是将那些已经被变基抛弃的提交又找回来。

***

##### 用变基解决变基
*  如果你拉取被覆盖过的更新并将你手头的工作基于此进行变基的话，一般情况下git都能成功分辨出哪些是你的修改，并把它们应用到新分支上。
   *如果遇到图3-38的情境，如果没有执行合并，而是执行`git rebase teamone/master`,git 会:

   *	*检查哪些提交是我们的分支上独有的（C2，C3，C4，C6，C7）*
      **检查其中哪些提交不是合并操作的结果（C2，C3，C4）*
      **检查哪些提交在对方覆盖更新时并没有被纳入目标分支（只有 C2 和 C3，因为 C4 其实就是 C4'）*
      **把查到的这些提交应用在 teamone/master 上面*
      *会得到下图的结果
      *![3-40.在一个被变基然后强制推送的分支上再次执行变基](http://git-scm.com/book/en/v2/book/03-git-branching/images/perils-of-rebasing-5.png)

   *要使得方案有效，需要对方变基时确保C4`和C4几乎是一样的。否则变基操作将无法识别，并新建另一个类似 C4 的补丁（而这个补丁很可能无法整洁的整合入历史，因为补丁中的修改已经存在于某个地方了）。
   *在本例中另一种简单的方法是使用 `git pull --rebase` 命令而不是直接 `git pull`。 又或者你可以自己手动完成这个过程，先 `git fetch`，再 `git rebase teamone/master`。
   *如果你习惯使用 `git pull` ，同时又希望默认使用选项 `--rebase`，你可以执行这条语句 `git config --global pull.rebase true` 来更改 `pull.rebase` 的默认配置。
   *__只要你把变基命令当作是在推送前清理提交使之整洁的工具，并且只在从未推送至共用仓库的提交上执行变基命令，你就不会有事。__
   *如果某些情形下决议要这么做，一定要通知每个人执行`git pull --rebase`命令，这样虽然不能避免伤痛，但能有所缓解。
   *	*__总的原则是：只对还没有推送或分享给别人的本地修改执行变基操作清理历史，从不对已推送至别处的提交执行变基操作，这样才能享受到两种方式带来的便利。__*

### 子模块！
* 新克隆一个项目时，会克隆相应的子模块，但是子模块内容为空。运行`git submodule init`初始化
* 再运行`git submodule update`同步
* 如果是在一个项目中新增子模块`git submodule add git@code.gomrwind:FrontEnd/ui.git`
* 假如成功了 运行`git status`会看到

```javascript
	new file: .gitmodules
	new file: ui
```

* 然后可以`cat .gitmodules`查看配置
* 应当如下

```javascript
	[submodule "src/ui"]
	path = src/ui
	url = git@code.gomrwind.com:FrontEnd/ui.git
	branch = master
```

* _要注意的是！如果之前有下过提示出错等，要更改.git中的config配置。还有.git下的modules下的相对应文件夹需要删除`rm -rf files`_
* [点这里学习](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E5%AD%90%E6%A8%A1%E5%9D%97)

```javascript
	如果在运行子模块的相关命令时出现以下问题：
	fatal: Needed a single revision
	Unable to find current revision in submodule path
	运行命令删除错误的文件，重新更新：
		* rm -rf [模块文件名]
		* git submodule update --init
```

```javascript
	如果在运行子模块相关命令时出现以下问题
	fatal: reference is not a tree: 16effe6cfd27ff78b04ff95e9103514e6dcf5cb3
	Unable to checkout '16effe6cfd27ff78b04ff95e9103514e6dcf5cb3' in submodule path 	'gezbox/lib/NotificationStyles'
	Failed to recurse into submodule path 'src/ui'
	切换分支到master,再拷贝一个分支作为对比，这是子模块有修改导致的。确认修改后再在那个分支上提交更新。
```

### 服务器上的git-协议（本地协议、HTTP协议、SSH协议、GIT协议）

##### 本地协议

* 最基本的协议
* 运行`git clone /opt/git/project.git`
* 或者执行`git clone file:///opt/git/project.git`
* 推荐使用前者
* 增加一个本地版本库到现有的git项目，执行`git remote add local_proj /opt/git/project.git`

##### HTTP协议



## 注意点！！！
* 新建一个项目时，要新建一个文件 .gitignore 里面设置哪些文件不随git提交
* 如果忘记了，在之后再添加时或再次修改时。 最好重新克隆到本地。然后依次运行`git rm --cached .` `git add .` `git commit -m ".gitignore is now working"`
* 先把所有文件从版本控制中删除，然后再重新加回来，提交上传后新的.gitignore就生效了
  * git rm --cached .`表示哪些文件不随git提交
* 如果有错误提示 `could not get git status --porcelain` 很有可能是因为忘记添加.gitignre。执行一遍上述操作
* `could not get git status --porcelain` 这样的错误提示，我的理解是上传的文件数量过多导致的。在.gitignore忘记加入时将node_modules等文件也上传，node_modules内容过多大概就导致了这个报错。甚至会导致无法使用`git commit`


