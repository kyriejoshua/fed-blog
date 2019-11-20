---
title: 「翻译」16 个理由说明为啥 Jira 工作流这么难用
date: 2019-10-25 14:28:27
tags: translate
---

<hr>

![](/2019/10/25/translate-jira-suck-article/unphoto.png)

> 呕心沥血翻译的国外小哥吐槽 jira。他从用户交互来体会，了解 jira 的同时理解为什么它这样难用。(提示：部分图片需要科学上网才能显示)
[原文链接](https://medium.com/@jtomaszewski/15-reasons-why-jira-and-confluence-suck-37507361cbdf)

以下是正文：

<!-- more -->

多年来，我一直是多个网页应用的开发者和使用者，同时参与了很多软件服务。

很多时候我使用像 Asana 或者 Trello 这样的工具来管理项目任务。

我最近被要求使用 Jira。我加入了一个组织的新项目组。他们用了很久的 Jira 了。

<!-- ![jira](https://miro.medium.com/max/2386/1*4XHSBOrTW6uUNLO4cXMBUQ.png) -->

我去，这次使用经历真是变成了冒险。

### 和 Jira 闲逛

第一周的时候，我感觉像是回到了 90 年代。每件事情开展的都如此之慢。这里面的 UI 是如此臃肿。这玩意问了我无数次毫无意义的“你确定吗”来确认。我感觉像是回到了 windows 95 的时代。（而且 windows 还比它更好）

第二周我经常问：“伙伴们，我们可以切换到 Asana 吗” 我和我的同事甚至接近创建了一个自由度很高的 Asana 面板，用它来创建任务，而不是 Jira.不幸的是，完全切换是不可能的。我们不得不用这个团队已经坚持了很久都在用的工具。

第三周和接下来的几个月，我意识到我别无选择。我不得不习惯它。像句老话说的，假如你不能改变它，那就适应它。那就意味着要习惯它来推动任何事，尤其是高效的项目管理和敏捷开发。

Jira 唯一鼓舞你的是花尽可能少的时间来使用它。我的很多同事仍然习惯在笔记本上来记录待办清单。他们觉得 Jira 太低效了，又花时间。奇怪的是，当我和其他人使用 Asana 和 Trello 时, 没人会用笔记本记录。他们觉得在应用里记录就足够直观了。

![Do you find this better than Jira? ](https://miro.medium.com/max/8512/0*4qHcFi97njD9c3LG)

有人会说，你根本就不会用 Jira. Jira 已经做了很多重要的升级了。我说少废话，我已经用了九个月了，我还是觉得它和我刚开始用它时一样难用。在这个时间里，Asana 和 ClickUp 已经可能更新了十个新特性了。

我很惊讶于这么流行又这么重要的项目组织工具，竟然这么糟糕。 Jira 应该是一个让你更简单的管理项目的网页应用。目前为止，它显然很失败。

我的有些朋友对我解释 jira 这么难用的反应是这样的：我理解你，它是可以再好用一点，但是其他工具的集成度和反馈都没有 jira 好。

这算个什么回答？ Asana 缺少反馈功能，那又怎样？你有没有考虑过 Jira 给项目带来的缺点？以现在的用户体验来说，它带来的是更糟的。让其他工具有这些功能而不牺牲可用性，只是时间问题。反而让你的组织使用 JIra 对项目和与你一起工作的人来说是种巨大缺陷。

我来给你一些例子来验证我的观点。

# Jira 交互
为了这篇文字，我注册了一个新的试用免费帐号，包括 Jira 和文档包。这样的用户场景，让我们想象我刚刚创建了一个新公司，然后我创建了一个新项目，它会作为项目管理中心，当作是接下来项目的首页。

在创建项目之后，我觉得创建我的第一个任务，在这里叫做 issue.


![Kanban board — first view you see after creating a project.](https://miro.medium.com/max/2874/1*YM8hYpABaCN_jnUa8KiAzQ.png)

### 1. 为啥会有 Issue Type 这玩意？

在 jira 里第一件你学到的事情，就是问题不只是问题。新的问题默认可以是故事，任务，缺陷，需求。或者是子任务，但是待会再说这个。

![](https://miro.medium.com/max/600/1*XFXViLMGYRat9gXp2ptDPQ.png)

为什么会有这些分类存在？它们之间的区别在定义（“它们的用途不同”）和实践（“故事的工作流与Bug的工作流”不同）中都有解释。

简要来说它们是同一回事，都是待办事项。

就这样，每次你创建一个问题，你需要去想它属于哪一类。是史诗？故事？还是任务？或者全都是？就像，我应该新建初次发布史诗，接着创建 Bootstrap 项目的故事，然后在它里面创建新建代码仓库的任务？

嗯…我就先建一个创建首页任务暂时，待会再写其他任务。

### 2. 怎样创建新问题？

在新建第一个问题之后，我马上就想新建另一个。可是，因为我已经有了一个问题，新建问题的占位符消失了。于是我开始找一个新建的按钮。

![You have 500 ms to find the “Add Issue” button. Start.](https://miro.medium.com/max/2878/1*MZX3q8RUz19olk9LZbyhww.png)

在哪呢？

我点了这个更多按钮，只看到了这些。

![I can create new boards, but not issues.](https://miro.medium.com/max/484/1*tiAxAJL5c7lGShCQcn5LTQ.png)

然后我点击添加项目在左侧的边栏，只看到这些：

![I can create shortcuts and pages, but not issues.](https://miro.medium.com/max/1306/1*cn1KQ7QiEopy0a4o3OCT5A.png)

噢，在这里！在远远的左侧，蓝色边栏里，这个一点也不属于我当前项目视图里的地方。真是 UI 设计师们有趣的决定。

![“Add issue” button found — on the far left of the screen as a tiny “plus” icon.](https://miro.medium.com/max/2854/1*DZrzoYvslgmW_kbPZvQeLA.png)

### 3. 任务可以创建子任务，但是任务不能是另一个任务的子任务。

我用 Jira 9 个月了，但是当我看到子标题的时候还是会忍不住笑。Jira 的问题可以是一个任务或者任务子任务。但是，已存在的任务不能是任务的子任务。你需要转化已存在的任务为子任务才能够如此操作。

我的场景：我已经创建了第二个任务，叫做 “Prepare Graphic Design” ，然后我想让他变成另一个 “Create landing page” 任务的子任务。

![I have created two tasks, but now I realized that one of them is actually a part of the another.](https://miro.medium.com/max/544/1*xMk-VUeam73yCZpgIdCtVA.png)

于是我进入 “Create landing page” 然后尝试添加子任务。

不幸的是，在输入完另一个项目的名字，它创建了一个新的子任务：

![By the way. What’s this “This board has been updated” alert about?](https://miro.medium.com/max/2478/1*qEwDEtHWePUUev8HKqbnBA.png)

这不是我想要的，还是移除吧。可是我在这子任务列表里的子任务元素旁边找不到任何移除按钮。为什么，我至今不知道。于是我点击子任务界面，看看也许这里有移除按钮。

![Looking for the “Remove issue” button. Attempt no 1.](https://miro.medium.com/max/2136/1*FTgo8waeeEjXoCtxTEM-bg.png)

我一定是眼瞎了。没有任何删除按钮，即使在点击主页的更多按钮之后。可能还有别的更多按钮？

![Looking for the “Remove issue” button. Attempt no 2.](https://miro.medium.com/max/794/1*79IbX9f4jziq-hKrKDDRFA.png)


还是没有。可能到父页面视图里，点击在子任务旁边的更多按钮，我就可以删除子任务了？

![](https://miro.medium.com/max/1318/1*W4nFJpVkSAOf_3s44ArhBw.png)

还没有！我期待着这里会有选择删除的选项，但这里唯一可能接近的就是批量操作按钮。于是我点了它。

然后页面重定向到了另一个完全不同的叫批量操作的页面。跳转花了 6 秒钟。可我只是想要删除我刚刚创建的子任务啊！此时我只希望它能记住我的最后视图，当我完成当前页面的操作的时候。

![“You do not have permission to delete the selected 1 issues.”](https://miro.medium.com/max/2784/1*S5GO6MRdOhQMsRCF9KVM6w.png)

有点奇怪，我是这个项目里唯一一个人，我创建了问题和项目，但我不能删除他们？为什么？我开始搜索。

![TL;DR: Deleting issues is prohibited because it would make restoring them impossible.](https://miro.medium.com/max/1550/1*z7RkcEssHo_TTm_ZOT8LHA.png)

好吧，这是个特性，不是 bug. 行，我知道了，这可能是保护性措施，防止用户删除任何问题。即使是几秒钟前创建的用户也不行？！

得了吧。这是像 Atlassian这样的大公司能想到的最好的办法吗？

为什么他们从没想过放一个归档按钮？几乎每一个网页集成工具现在都有方式来归档文件，图片和文字。这和删除差不多，但有个撤销功能。

不管怎样，我不会改变权限，我没时间做那个。有没有可能我让这个子任务跳过或这别的什么？

![](https://miro.medium.com/max/2110/1*bYxM5jX1JZDk18SoQxmMCQ.png)

没可能。我只能移开它。我把它重命名成归档的作为临时解决方案。

### 4. 让一个任务变成另一个任务的子任务

不管怎样，让我们回到 “Create landing page” 这个问题。我想让一个任务变成它的子任务。

我注意到界面上有个按钮可以让我连接问题。看来起不错，我想，可是它好像不是任务-子任务的连接。

![There are many options in the link dropdown, like “blocks” “clones” “duplicates”, but there is no option like “subtask of”.](https://miro.medium.com/max/1406/1*dInjKSx2V3vX75OwuStowQ.png)

**为什么任务都可以互相连接，那子任务还有什么存在的必要呢？** 子任务通常都会阻塞父任务，不是吗？

既然不能让已存在的任务和别的任务形成任务和子任务的关系，或许我可以把任务转化成子任务？查查看。

![There is a possibility to convert task into subtasks one by one and also by group as well.](https://miro.medium.com/max/1542/1*ZYUC1nx2H2KH-9oWZsvluA.png)

好吧，但是转化子任务的地方在哪里？是我在哪里错过了吗？

![Searching again in the three dots dropdown.](https://miro.medium.com/max/2134/1*Tk_fFADGifrjZ8sWnalZEw.png)

在点击更多按钮之后，我发现了转化为子任务的连接。点击它之后，页面加载了大概 5-10 秒，下面的页面出现了。

![Looks like I was about to reformat my OS. Why does it look like so complex? (All I wanted was to make a task a subtask.)](https://miro.medium.com/max/2368/1*i8Srog41d1GcjLuc-0mE0w.png)

![The multi-step form also shows this. Even though I had already shown my intention explicitly by clicking a “Convert to subtask” link. This select here doesn’t list any other options anyways. What’s the sense of showing it?](https://miro.medium.com/max/1012/1*y6Lt_uxVEyw1KlEGWXqBgw.png)

选择问题之后点击下一步，它让我接着进入下一步。
![Step that is not required, gives no information, and has no possible actions other than “Next”. Why bother showing it at all?](https://miro.medium.com/max/2118/1*at5Xddk-PkiNrwJ53X2LDg.png)

在点击下一个毫无意义的下一步之后，继续往前
![Three times I had already confirmed that I want to convert the task into a subtask. What does JIRA do? Asks you again! (Ordering a taxi would be easier.)](https://miro.medium.com/max/2508/1*XVcFfpUPI0-lZpjzVyWpCg.png)

在最后一次点击完成时，又来了一次 8 秒的页面跳转等待，我终于把一个任务转化为子任务。

![Yes! Task seems to be a subtask now. (However I don’t even see the parent task title, just an ID…)](https://miro.medium.com/max/2870/1*WwSyiUtw6EjcBYkyAXrngw.png)

不过，你注意到顶部的提示了吗？

![](https://miro.medium.com/max/2194/1*W7w3w7BcePUO7WYe-nSYDQ.png)

它说我现在在一个新的问题视图。一般这是个页面来通知用户新特性的。但我是个新用户，我不知道哪些功能是新的哪些是旧的。

而且，你发现了吗，它没有关闭按钮？！点击所有的连接加上刷新页面都不能隐藏它，我很确认。让我们往前看把，这个恼人的提示可能待会会消失。实际上并没有，我看了它九个月了。

### 5. 拆分任务成独立的发布

在意识到转化已存在的任务成子任务是这么复杂后，我就直接从任务视图里创建子任务。我还创建了一些其他任务，就像 “寻求反馈”，“搜索优化”，那应该在网站初次发布后做好。

现在，我想以某种方式组织一些其他问题到功能性发布或者别的，这样它们不会在我初次发布的时候影响到我。

我在看板里看到一个发布按钮，它让我来创建发布。

![Did you know… release needs a date? What if we don’t know when a release will be done? Don’t ask me.](https://miro.medium.com/max/1038/1*-jLhKHPwQnkk5C-LsDLVgQ.png)


我觉得创建两个新的发布，1.0 和 2.0. 不幸的是，在创建第一个发布之后，我不能再创建第二个了。

![“Release” button is now disabled.](https://miro.medium.com/max/638/1*IDC-_rI9EYba9nCmVa9epA.png)

在反馈之前，我注意到这里有个发布按钮连接在边栏。我点了它，却只看到一个 Jira 欢迎页面，就像这样

![Releases view that shows nothing, even though I had just created a release.](https://miro.medium.com/max/2862/1*hiXZs8-F7fUVS50lyM9LJA.png)

这让我提出了三个问题

1. 不能找到版本 —— 什么？什么版本？我甚至还没开始找特定版本。
2. 发布和版本是同一回事吗？那为什么你们不坚持用同一个命名？
3. 我已经创建的版本/发布在哪里？

在更新筛选的未发布到已发布条件后，我明白了发布已经存在了，它被标记为已发布。可我刚刚设置了它的发布日期在未来。搞什么？

![](https://miro.medium.com/max/2878/1*KAgMoOG0m-UQWFDYtooBsQ.png)

无语，为了改正我更新了它的状态。在那之后，在同一个视图内，我创建一个新版本 2.0.

![While creating a release in this view, you don’t have to set its’ dates. So are they required or not?](https://miro.medium.com/max/852/1*In8WJcWfvCKNJ4RcLSwvZw.png)

现在我的计划发布创建了，我决定回到看板然后分配已存在的问题到相应的发布里。

![Looking for “Release” in the issue’s sidebar. Found just “Fix Versions”. I guess that’s it?](https://miro.medium.com/max/2880/1*v4mNuXaPabH7a3XzIP8gCw.png)

（为啥每次我都要猜着去用呢？）

![Release (that is: Fix Version) assigned. Uff.](https://miro.medium.com/max/2138/1*1W__QJ1xleZbtSXzt6LuNg.png)

当来到问题视图的时候，第四次尝试分配了它们到一个特定版本之后，我感觉这是个乏味的任务。我想让它自动化一点。我可以选中多个然后一次性批量编辑吗？

我回到看板，因为我想看到有个什么批量操作的动作会在这里。不出意外的，它没出现。

![Looking for Bulk Edit on Kanban board. Without success.](https://miro.medium.com/max/2874/1*WKHELkwE6amhusaB005DFw.png)

它会在哪呢？我们搜索一下。（再次）

![Bulk actions are accessible only from a “search view”. Whatever that is.](https://miro.medium.com/max/1894/1*HQO2C2y-tr9DCUTDLL6oyA.png)

我咋搜索呢？ 我以为看板已经是个搜索视图了，它里面有搜索筛选条件。

我点了边栏上的搜索按钮。

![](https://miro.medium.com/max/142/1*bysDxZJ4JaBMswB05sX8mw.png")

打开了这玩意

![Unfortunately, no bulk actions here yet.](https://miro.medium.com/max/1206/1*tPLfv2xA5o4EQ-MTfb-MZg.png)

我点了问题的更多搜索。在十秒的网页加载之后，

![Advanced search view has appeared. Showing total 0 issues that were matching my search (even though I hadn’t search for anything yet), and a big field with some long, weird, programmatic query language.](https://miro.medium.com/max/2880/1*Ul8vwcCSmbOwTy6HO3fz0Q.png)

**🤦 ‍为啥你们要把不显示任何问题的视图作为默认视图呢？**

要改变当前状况，我只能点击所有问题。终于显示出来些东西了

![](https://miro.medium.com/max/2268/1*0lfX0KHUaIVuFTEgVszGiw.png)

但是批量操作按钮在哪儿？或许在这个筛选旁边的更多按钮里？

![](https://miro.medium.com/max/672/1*nkp_c9wtXXM95AGEn1sSNg.png)

并没有。或许它们在我点击搜索输入框旁边的“更多”按钮之后会出现

![](https://miro.medium.com/max/2044/1*x91yCy6J2gbSB5qoIyh8rQ.png)

也没有，它只是改变了输入框的样子。可能在顶部右边角落的另一个更多按钮里？

![](https://miro.medium.com/max/632/1*KP490tMTO4YLYrQXIwQy3w.png)

是的。在这里。但。。我不想改变所有的 16 个问题，我只想改变其中的一部分。怎么搞？

我改变了搜索条件来减少问题数，现在页面只显示几个主要的问题，我来批量操作它们。

![](https://miro.medium.com/max/2222/1*5TI6822calEzRapxi9bc5A.png)

幸运的是，在页面加载了 5 秒之后，jira 列出了所有问题，但这次，它有了选择框，我可以选择哪些是我想编辑的。（就不能在之前的视图里加上这操作吗？）

![Another list of issues, this time finally with checkboxes.](https://miro.medium.com/max/2256/1*mFyNYqoajd9vH_nkVNevxw.png)


对了，如果你想在选择问题之前预览，你猜怎么着，不行。如果你直接点问题，页面会离开视图，直接跳转。如果看板视图可以在对话框里预览问题，为啥不搞一个呢？

在选了三个问题，点了四次下一步按钮之后（每一步都有页面跳转），我最终看到了这个页面

![Operation complete. Congratulations! (They could have put some fireworks in here.)](https://miro.medium.com/max/1372/1*MVfcVK_J3_mFBGhOXjhQSw.png)

### 6. 只能浏览特定版本的问题

在拆分我的发布到两个独立的发布之后，我现在终于可以专注于 1.0 版本的问题。至少那是我希望的。我回到了看板视图。

![](https://miro.medium.com/max/2264/1*rblIqaR5RwwaTcBK98wWaA.png)

在我脑海里的第一个问题，我怎样才能过滤只显示 1.0 版的问题呢？

寻找筛选按钮……

1. 如果我点了右上角的发布按钮，只会显示一个下拉框，让我添加或者移除问题到一个已存在的版本。
(对了，从视图上来说很难说明它确切是什么。你不得不自己创建一个发布，观察它来学会使用它，或者从文档里学习。这个对话框并不是很清楚的说明它的作用。)

![](https://miro.medium.com/max/1190/1*siSE4-UNyGkOgwlepQMT_w.png)

2. 如果我点了右上角的三个点的更多按钮，我也不会看见任何筛选操作。替代的，我注意到两个链接叫做“面板设置”，“创建面板”，它们可能会帮助我。

面板设置，那是什么？我们试试看。

![“Board Settings” view](https://miro.medium.com/max/2202/1*_5zVt94IzCqE-qr3ZJ_zSg.png)

这看起来就是我需要的。可能看板就是设计成只显示看板问题，如果你要筛选，必须先编辑面板或者创建一个新的？（在问题视图想过滤问题的时候，不得不想到这些复杂的想法。）

但是那真的很奇怪。有多少应用是要新建视图仅仅是为了筛选它？（假如你想要过滤邮件，你会要新建一个邮件面板吗？不用的。）

不过，我还是从 1.0 版本创建了一个新面板。在创建之后，Jira 用下面这个对话框欢迎我

![Scrum or Kanban? That is the question.](https://miro.medium.com/max/1854/1*jVjK8TV0MU8jBHjW8idCLg.png)

假如我想在 sprint 里但又想使用一个看板视图会怎样？它们会互相排斥吗？经过深思熟虑，我决定通常更喜欢在 Sprint 和截止日期方面保持灵活性。我选择看板。

![What Board would you like to create, sir?](https://miro.medium.com/max/1884/1*1jmWtzwlk5tscgvpzGF1Sw.png)


我的第一想法是，想要一个已存在的筛选条件的看板，因为我要看一个带过滤条件的问题的搜索结果。可是，什么是已保存的筛选条件。对一个简单筛选来说听起来有点复杂。于是我选择了从已存在的项目导入（因为我确实想为现有项目创建面板）。

![Last step of creating the board](https://miro.medium.com/max/1848/1*VWHG1fB03VKWlzycYCQBow.png)

![Board created. Looks the same as my initial one.](https://miro.medium.com/max/2202/1*fEtRzhtz9uAqvayPbrZdOQ.png)

擦，我又创建了一个和先前一模一样的面板。😞

他们没有想到我要显示现有项目中的问题并同时过滤它们。 （这是谁的错？我还是Jira UI设计师？）

让我们回到面板设置。可能我可以自己创建搜索条件给这个已创建的面板。

![Board Settings -> General -> “Filter” section](https://miro.medium.com/max/844/1*QMKAUB_v7qka3k3spUbFEw.png)

不确定我是否都理解这些，但或许这就是过滤查询？我们来编辑它。

我被重定向到熟悉的高级搜索视图。

![“Filter for 1.0” Advanced search view](https://miro.medium.com/max/2742/1*M_WZpv3Z6xnZc8arqCz9YQ.png)


我已经熟悉过滤条件，因此很快设法添加了“修复版本”过滤条件。

![Filtering issues to the ones that belong to 1.0 Fix Version](https://miro.medium.com/max/1588/1*xsbiBmFqG9xmk1eGScJYzg.png)

在这之后，过滤条件旁边有一个保存按钮。我点了，神奇的是，Jira 重定向到我刚刚编辑的项目页面。噢，等一下，不是的。😐

![](https://miro.medium.com/max/2224/1*2efQK8idPJH57ld7PqoaJA.png)

它实际上只是显示了一条即时消息，说过滤条件保存好了。它是否已经保存成面板的过滤器了呢？🤔

回到我刚刚的位置然后确认我刚刚的操作是否真的生效了，我不得不做以下：

1. 点击左侧蓝色边栏的回到主页按钮，

![](https://miro.medium.com/max/646/1*Xm1GAl2QUIjv__lk2AarCg.png)

2. 点击项目（又一次的页面跳转）

![Do I want to show a project or a dashboard or Issues? Kanban board is all of that, lol. How do I get back? Can somebody help me?!](https://miro.medium.com/max/2292/1*UlqI99QMFS2H74JM7ZhkcQ.png)

3. 点击 “Indri Landing” 看板名。

![](https://miro.medium.com/max/2880/1*y_5UkDIzH5Uc_JjcfSoxpg.png)

在又一次的页面刷新后，我终于到了我想看到的页面——在特定版本里的已过滤的看板页面。我为我能做到而感到自豪。 😁

### 7. 在过滤好的面板里创建问题

我现在有一个专注在 1.0 发布的面板，让我们开始工作把 —— 移动一些子任务到处理中，然后开始处理它们。

但是…我的子任务呢？😮

在一个全局项目视图中我看到了任务和它们的子任务，但是现在我只看到主任务。

![](https://miro.medium.com/max/2864/1*zWRfaeXcqyZjjzoUoc8Vng.png)

看起来这个新创建的面板和之前创建的默认面板设置是不一样的。

在面板设置里找外加谷歌五分钟后，看起来这是不可能的了。jira，你真牛，你毁了我刚刚完成的面板。

在又谷歌了五分钟后。我知道了。这大概是即使我移动了任务到一个特定发布里，但是它们的子任务，没有随之移动，现在是不属于任何发布里，所以它们不显示了。

所以我不只要移动任务，还要移动它们的子任务到 1.0 发布版本。（很遗憾，Jira 没有建议我在该操作中也更改任务的子任务。）让我们这样做吧：

到高级搜索页面 -> 找到子任务 -> 批量操作 -> 编辑所有问题 -> 分配到 1.0 版本 -> 是的我确认 -> 等待操作… -> … -> 是的我知道 -> 回到项目 -> 回到 sprint -> 回到面板

我终于看到子任务了！

![](https://miro.medium.com/max/2876/1*4_wZDn5Yd4UeHrcNyC_UMg.png)
(They should [pay me](https://www.google.com/search?q=jira+administrator+jobs) for doing this Jira work.)

### 8. 在过滤好的面板里创建任务

在使用1.0版开发板时，我意识到我需要为发布1.0版做更多的事情。因此，我决定创建一个任务：

![](https://miro.medium.com/max/2876/1*q1WFvsglBKkbFQcG-GeWfQ.gif)

创建问题的结果是“问题当前不可见”警告。为什么？！嗯。也许有一个“修复版本”字段尚未填写（即使我在版本视图中），这就是为什么它没有出现的原因？

回到高级搜索视图，找到问题，是的，它确实没有修复版本。（即使我实在一个修复版本的面板里创建它的。）

Jira 为什么不允许你专门为当前面板创建问题，以及为什么无论你当前的问题视图显示了什么，它都会迫使你始终预填所有字段？别问我。

### 简要说明其他问题

我们可以继续下去，但是这篇文章已经花了太长时间。我将给您提供一些糟糕交互的最新示例，但这一次是简短的形式。这些例子将来自我的日常工作。

### 9. 创建问题很耗时

在我们的组织中，有多个项目和团队在一个Jira工作区上进行协作。因此，无论何时创建问题，我们都有义务填写：

* 修复版本（计划在哪个版本修复）
* 组件 (团队将会修复)
* 史诗 (新功能)

不幸的是，Jira 并不会帮助我们输入这些字段：

* 它从不会记住最后的值，也不会让我定义默认值，也不会让我定义一个模板或者别的什么。（那样的话我只要点一下就可以创建任务了）
* 有些需要我创建的字段，却藏在离新建问题对话框很远的地方。即使我可以隐藏它们，但不能改变它们出现的顺序。

结果就是：

* **Jira 应该是所有项目任务的中心，但事实上常常不是。**新建一个任务至少需要一分钟。因为我需要集中注意来填写那么多重要字段，每一次它都要求我 [切换上下文](https://personalmba.com/cognitive-switching-penalty/)。 很多时候，我们最终完全避免使用Jira，只是为了“节省我们的时间”，从而导致任务和知识由于无休止的Slack聊天而不是项目管理中心而白白浪费了。
* **问题常常白白浪费掉。**如果有人忘记填写这些字段中的至少一个，则很有可能我们面板的过滤器查询无法搜到问题，而且没人会发现。
* **大家都抗拒着用[替代](https://marketplace.visualstudio.com/items?itemName=Atlassian.atlascode)  的 [Jira  客户端](https://alternativeto.net/software/jira-client/) ,  可能因为这原生的实在是太糟了。**就比如我, 我正在用  [CLI 客户端](https://github.com/go-jira/jira)  来创建和浏览 Jira 问题. 我不得不花费很多小时来对它自定义，这样它就可以满足我的所有需求。幸运的是，现在创建任务只需单击两次 ENTER 并输入问题标题即可，就像从一开始就应该这样做一样。 （这个工具太可怕了，以至于我不得不求助于配置 CLI 客户端。你信吗？例如，你会使用 CLI 在 Slack 上聊天吗？当然不是。对于Jira来说，这听起来很合理。）

### 10. 分为新和旧视图

**从“旧问题”视图可以访问的某些功能，却在“新问题”视图不能访问，反之亦然。**他们发布了一个“新问题视图”，该视图缺乏旧视图中的重要功能。同时，它引入了新功能，仍然使用旧视图的客户又无法使用这些新功能。

比如:
* 你可以在新视图里浏览工作日志，但不能在旧视图里这样做。
* 你不能在旧视图里编辑问题的预估时间，但是在新视图里可以这么做。

结论: 我经常要在新旧视图中切换。（当然，这事情做起来不简单）加入你想要切换，你必须到你的账户设置里，并且重载你所有打开的问题视图。

### 11. 移动视图到另一个状态是非常麻烦的

当我切换问题的状态，比如从处理中到已解决，常常我还有义务要填写一些额外的字段，就像解决类型。这里有很多不同的值，比如结束，阻塞，跳过。你知道我们怎么点吗？在 99% 的情况下，只是“结束”。它被设置成了默认值吗？当然没有。它总是要你去点一下那额外的。（鼠标点击，因为键盘导航通常不起作用）

### 12. 不同的视图说明同一件事，总是不同的

看这里

![7 different Issue listing views, each looking completely different, often with different UI of pagination and filters.](https://miro.medium.com/max/2170/1*bfteF7CZFfUDK_aUlv9Ojw.gif)

老实讲，每次我打开 Jira 的视图，我真不知道它会展示出什么样子。

### 13. 邮件通知骚扰

Jira 会在任何问题的状态变更的时候都用邮件通知你。这很好。可是，在做诸如 jira 这样的仪表盘应用时，你会注意到 “某个东西更新” 的邮件会更新的非常频繁，数量众多，以至于邮件会非常大。于是你做了一个简单的处理，批量发送通知。（不要打扰我，五分钟左右，然后再一次性把所有变更在同一邮件里给我）

Atlassian 大概根本没想到过这一点。 (或者它们的系统太臃肿所以没办法去做这样的改变。) 因此, 你还是会收到上百封邮件通知。 (除非你完全关掉。但同时，这可能会让你的同事恼怒，因为你没有对他们做出的更新作出相应的回应。)

更糟的是，如果你用了 jira 的集成服务，很可能会导致 jira 发送更多的邮件。例如，我们用  [Aha! 集成服务](https://www.aha.io/product/integrations/jira) . 只要我创建了 jira 问题, Aha! 就会链接它到 Aha 的某项!.，然后就导致额外的邮件：“Aha! 集成服务改变了问题 XXX. 字段改变: Aha 集成链接到 YYYY.” 谢谢, 很高兴知道这些…

### 14. 无形的应用通知

有些人可能会更加烦恼于应用通知而不是邮件。

可是，有人想出了个点子，把通知藏在屏幕左下角。真谢谢你了，我一直都不知道直到有人告诉我，还是在我使用 jira 三个月后。

即使在那之后，我也很少观察到“你有新通知”的消息点。消息通知在屏幕的这么个位置，我不得不提醒自己通知在这里，让自己记住这个位置。（难道不应该是相反的吗——通知应该时刻提醒我？😉）

![](https://miro.medium.com/max/2874/1*gj1j7DMk__rTImg2JJOp4g.png)

### 15. 性能!!!
 Jira 最 [痛苦](https://www.collinsdictionary.com/dictionary/english/a-pain-in-the-arse)  就是它的性能. 几乎每一次点击都会带来长大十秒的页面刷新跳转。意味着，假如你要快速浏览一个问题列表，阅读其中的四个，然后编辑，你大概要等待页面加载 7 次。简单的操作就像“我的问题然后开始工作”通常要花费 1 到 2 分钟，然后让你完全失去对当前工作的专注。

### 16. 工作流也垃圾

它自己标榜自己是 “团队工作流软件”

![Confluence landing page telling a beautiful story about it.](https://miro.medium.com/max/2344/1*Z32zv3zguHj2eG4YIFdSYA.png)

TL;DR: 这是一个嵌套的文档目录，可以在线阅读和编辑。

**但是，你知道可以在Google文档，Microsoft Word Online，Dropbox Paper，Hackpad中做什么，但是在Confluence中不能做什么？同时阅读和编辑！**

如果你想要编辑，你必须要到一个独立的编辑页面。（再一次需要页面加载）然后等待 15 秒左右让它加载完毕。

从理论上讲，有可能同时在几个人中进行文档协作。但是实际上，在编辑过程中所做的任何更改都不会在“阅读模式”下显示，除非您真正单击“保存”。而且，当您这样做时，我敢打赌，首先你会看到一个巨大且令人困惑的警报“你确定要发布XXX所做的更改吗？”。这是因为，如果有人在你之前进行了某些更改，但尚未发布，则在发布自己的更改时也必须提交它们。 （即使有人只是意外更改了空白，也会显示该通知。）

我去! 我只想更新我自己的变更。抱歉了老兄，在工作流中你不能这么做。

你知道在一个公司里保持一个[优良的文档文化](https://jtom.me/talks/keep-everything-documented-and-public.pdf)  最大的问题是什么吗？
让大家懒于创建和更新文档，使得最终丢失文档或文档太老。

对人抱怨很容易，它也很少有生产力。使人们更有生产力的是用工具把工作做的更好。**一个好的文档工具应当使得阅读和编辑都尽可能的简单无缝。**

**工作流在这点上很失败。**

# 小结
我可以接着一直一直谈论 UI，但觉得我们应该已经够了。

你知道现在还有些工作专门聘请 “jira 管理员” 的岗位吗？在用了这么久之后，我不感到意外了。这个工具需要仅负责处理该工具的人员，因此其他人可以至少完成其假定的实际工作的一部分，而不必与 Jira 混在一起。

**为啥 jira 这么糟糕，却还这么流行？**

**为什么像 Atlassian 这么一个注重软件的公司会这么忽视它们的核心产品？**他们以这种方式冒险。如果 Jira 无法使用并且阻止人们做它应该做的主要事情（管理项目），那么竞争对手（例如 Asana，ClickUp 或其他东西）将利用它，构建一个不那么糟糕的工具，这只是一个时间问题来接管他们的顾客。

这就是为什么我写了这篇文章。

**告诫你远离 Jira 如果你可以的话。**

**告诫 Atlassian: 烦请你修好你的产品。**
—

对了，你在找帮你找到并修复问题的网页应用的交互设计吗？? 🙂 看我的  [主页](https://jtom.me/)  and  [发消息给我.](https://jtom.me/)  乐于帮助。
