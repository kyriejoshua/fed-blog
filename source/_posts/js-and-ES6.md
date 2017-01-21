---
title: js诞生与ES6
date: 2016-06-20 16:03:09
tags: JavaScript
categories: JavaScript
---


### 1.`JavaScript`

<blockquote class="note">

JavaScript，一种直译式脚本语言，是一种动态类型、基于原型的语言，内置支持类别。它的解释器被称为JavaScript引擎，为浏览器的一部分，广泛用于客户端的脚本语言，最早是在HTML网页上使用，用来给HTML网页增加动态功能。然而现在JavaScript也可被用于网络服务器，如Node.js。

在1995年时，由网景公司的布兰登·艾克，在网景导航者浏览器上首次设计实现而成。因为网景公司与昇阳公司的营销合作，加上网景公司管理层希望它外观看起来像Java，因此取名为JavaScript。但实际上它的语义与Self及Scheme较为接近。

为了获取技术优势，微软推出了JScript，与JavaScript同样可在浏览器上运行。为了统一规格，1997年，在ECMA（欧洲计算机制造商协会）的协调下，由网景、昇阳、微软和Borland公司组成的工作组确定统一标准：ECMA-262。因为JavaScript兼容于ECMA标准，因此也称为ECMAScript。

</blockquote>

<!--more-->

### 2.`JavaScript` 定义

{% blockquote %}
一般来说，完整的JavaScript包括以下几个部分：

ECMAScript，描述了该语言的语法和基本对象
文档对象模型（DOM），描述处理网页内容的方法和接口
浏览器对象模型（BOM），描述与浏览器进行交互的方法和接口
它的基本特点如下：

是一种解释性脚本语言（代码不进行预编译）。
主要用来向HTML页面添加交互行为。
可以直接嵌入HTML页面，但写成单独的js文件有利于结构和行为的分离。
JavaScript常用来完成以下任务：

嵌入动态文本于HTML页面
对浏览器事件作出响应
读写HTML元素
在数据被提交到服务器之前验证数据
检测访客的浏览器信息
控制cookies，包括创建和修改等

{% endblockquote %}


### 3.`JavaScript` 起源

{% blockquote %}
它最初由网景公司的布兰登·艾克设计。JavaScript是甲骨文公司的注册商标。Ecma国际以JavaScript为基础制定了ECMAScript标准。JavaScript也可以用于其他场合，如服务器端编程。完整的JavaScript实现包含三个部分：`ECMAScript`，文档对象模型(`dom`)，浏览器对象模型(`bom`)。

Netscape在最初将其脚本语言命名为`LiveScript`，后来网景在与昇阳公司合作之后将其改名为JavaScript。JavaScript最初受`Java`启发而开始设计的，目的之一就是“看上去像`Java`”，因此语法上有类似之处，一些名称和命名规范也借自`Java`。但JavaScript的主要设计原则源自`Self`和`Scheme`。JavaScript与Java名称上的近似，是当时网景为了营销考虑与太阳微系统达成协议的结果。为了获取技术优势，微软推出了`JScript`来迎战JavaScript的脚本语言。为了互用性，Ecma国际（前身为欧洲计算机制造商协会）创建了ECMA-262标准（`ECMAScript`）。现在两者都属于`ECMAScript`的实现。尽管JavaScript作为给非程序人员的脚本语言，而非作为给程序人员的脚本语言来推广和宣传，但是JavaScript具有非常丰富的特性。

发展初期，JavaScript的标准并未确定，同期有网景的JavaScript，微软的JScript三足鼎立。1997年，在ECMA（欧洲计算机制造商协会）的协调下，由Netscape、Sun、微软、Borland组成的工作组确定统一标准：ECMA-262。
{% endblockquote %}

### 4.`ECMAScript` 与 `JavaScript`

{% blockquote %}
一个常见的问题是，ECMAScript和JavaScript到底是什么关系？

要讲清楚这个问题，需要回顾历史。1996年11月，JavaScript的创造者Netscape公司，决定将JavaScript提交给国际标准化组织ECMA，希望这种语言能够成为国际标准。次年，ECMA发布262号标准文件（ECMA-262）的第一版，规定了浏览器脚本语言的标准，并将这种语言称为ECMAScript，这个版本就是1.0版。

该标准从一开始就是针对JavaScript语言制定的，但是之所以不叫JavaScript，有两个原因。一是商标，Java是Sun公司的商标，根据授权协议，只有Netscape公司可以合法地使用JavaScript这个名字，且JavaScript本身也已经被Netscape公司注册为商标。二是想体现这门语言的制定者是ECMA，不是Netscape，这样有利于保证这门语言的开放性和中立性。

因此，ECMAScript和JavaScript的关系是，前者是后者的规格，后者是前者的一种实现（另外的ECMAScript方言还有Jscript和ActionScript）。在日常场合，这两个词是可以互换的。
{% endblockquote %}

### 5.`ECMAScript历史与ES6`

{% blockquote %}
ES6从开始制定到最后发布，整整用了15年。

前面提到，ECMAScript 1.0是1997年发布的，接下来的两年，连续发布了ECMAScript 2.0（1998年6月）和ECMAScript 3.0（1999年12月）。3.0版是一个巨大的成功，在业界得到广泛支持，成为通行标准，奠定了JavaScript语言的基本语法，以后的版本完全继承。直到今天，初学者一开始学习JavaScript，其实就是在学3.0版的语法。

2000年，ECMAScript 4.0开始酝酿。这个版本最后没有通过，但是它的大部分内容被ES6继承了。因此，ES6制定的起点其实是2000年。

为什么ES4没有通过呢？因为这个版本太激进了，对ES3做了彻底升级，导致标准委员会的一些成员不愿意接受。ECMA的第39号技术专家委员会（Technical Committee 39，简称TC39）负责制订ECMAScript标准，成员包括Microsoft、Mozilla、Google等大公司。

2007年10月，ECMAScript 4.0版草案发布，本来预计次年8月发布正式版本。但是，各方对于是否通过这个标准，发生了严重分歧。以Yahoo、Microsoft、Google为首的大公司，反对JavaScript的大幅升级，主张小幅改动；以JavaScript创造者Brendan Eich为首的Mozilla公司，则坚持当前的草案。

2008年7月，由于对于下一个版本应该包括哪些功能，各方分歧太大，争论过于激烈，ECMA开会决定，中止ECMAScript 4.0的开发，将其中涉及现有功能改善的一小部分，发布为ECMAScript 3.1，而将其他激进的设想扩大范围，放入以后的版本，由于会议的气氛，该版本的项目代号起名为Harmony（和谐）。会后不久，ECMAScript 3.1就改名为ECMAScript 5。

2009年12月，ECMAScript 5.0版正式发布。Harmony项目则一分为二，一些较为可行的设想定名为JavaScript.next继续开发，后来演变成ECMAScript 6；一些不是很成熟的设想，则被视为JavaScript.next.next，在更远的将来再考虑推出。TC39委员会的总体考虑是，ES5与ES3基本保持兼容，较大的语法修正和新功能加入，将由JavaScript.next完成。当时，JavaScript.next指的是ES6，第六版发布以后，就指ES7。TC39的判断是，ES5会在2013年的年中成为JavaScript开发的主流标准，并在此后五年中一直保持这个位置。

2011年6月，ECMAscript 5.1版发布，并且成为ISO国际标准（ISO/IEC 16262:2011）。

2013年3月，ECMAScript 6草案冻结，不再添加新功能。新的功能设想将被放到ECMAScript 7。

2013年12月，ECMAScript 6草案发布。然后是12个月的讨论期，听取各方反馈。

2015年6月，ECMAScript 6正式通过，成为国际标准。从2000年算起，这时已经过去了15年。
{% endblockquote %}

__我们最常写的原生js即是基于ES3和ES5。目前所有主流浏览器都支持ES3、ES6。各大浏览器也在不断更新， 支持ES6__。


### 6.`ECMAScript 7`

{% blockquote %}
2013年3月，ES6的草案封闭，不再接受新功能了。新的功能将被加入ES7。

任何人都可以向TC39提案，从提案到变成正式标准，需要经历五个阶段。每个阶段的变动都需要由TC39委员会批准。

Stage 0 - Strawman（展示阶段）
Stage 1 - Proposal（征求意见阶段）
Stage 2 - Draft（草案阶段）
Stage 3 - Candidate（候选人阶段）
Stage 4 - Finished（定案阶段）
一个提案只要能进入Stage 2，就差不多等于肯定会包括在ES7里面。
{% endblockquote %}

### 7.`Babel`转码器

Babel是一个广泛使用的ES6转码器，可以将ES6代码转为ES5代码，从而在现有环境执行。这意味着，你可以用ES6的方式编写程序，又不用担心现有环境是否支持。


