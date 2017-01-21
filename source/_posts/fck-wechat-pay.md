---
title: 微信支付开发日志
date: 2016-12-22 11:55:48
tags: wepay
categories: Wechat
---

<hr>

{% asset_img unphoto.jpg wx pay %}

<blockquote>
曾经有一项需求，是从移动端的H5页面请求微信支付功能。微信的文档写地较为混乱，在这里写个防坑指南。

</blockquote>

<!--more-->

### 支付的坑

1.微信支付的文档不止一个。

* 在[官方的文档](http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html)里，有一段简单的关于微信支付的说明。调用`wx.chooseWXPay`方法启用。但是在这个文档之下，有另一个开发文档[微信支付开发文档](https://pay.weixin.qq.com/wiki/doc/api/index.html)

* 这个文档里也有一个支付调用的方法`weixinJSBridge`，但是只能在微信浏览器里使用，非常不方便。本人测试从未成功过，所以建议放弃。

2.`wx.chooseWXPay`方法的传入参数和签名

* 该方法发起请求时是没有`appId`参数的，但是在生成`paySign`签名的时候，需要有`appId`和它的值。这里的I是大写的i。

* 生成`paySign`的时候的`timeStamp`是大写的，和传入的参数不一样，传入的是小写。

3.服务端的工作？！

* 由于微信文档里没有说明哪些是前端工作哪些是后端，所以在一开始开发时我做了很多服务端做的事。比如生成`signature`, `paySign`.两者不一样。

* 生成签名的工作前端也是可以做的，但是要发起很多异步请求，处理非常多的回调，简直是回调地狱，而且不安全。最后服务端的伙伴处理了第一个签名。

* 注意两个`access_token`的不同。

###  微信公众号的准备工作

1.微信公众号开通微信支付功能。

* [微信公众平台](mp.weixin.qq.com) 微信支付-开发配置里配置支付授权目录。
  * 正式授权目录可以添加多个，测试时只能添加一个。
  * 不允许添加端口。只支持默认80端口。
  * 目录即为调用微信支付空间的页面所在的目录。
  * 将个人的微信号加到支付的白名单里，只有白名单里的用户才可以支付，但没想到付的是真钱。

* 同一个页面里，选择开发者配置，找到接口权限表。
  * 网页授权用户基本信息。
  * 这个`url`是用户回调的`url`,即开启微信支付控件页面的`url`,这个值即是`redirect_url`的值。
  * 要记得`encodeUrl`转码。

* 进入公众号设置，功能设置
  * 对`js`安全域名做设置。
  * 这个值只能设置一个且似乎改动次数有限制。所以要小心改动。
  * 上线前记得切换。

* 开发者中心里的配置项。
  * 获取`appId`, `secret`等相关信息。
  * 还有`mch_id`和`key`。
  * 这些数据都不推荐写在前端页面里。

### 使用步骤

1. 打开微信页面，从服务端的回调`url`里获取`access_token`, `openId`. 须服务端通过`code`验证等，然后返回。

2. 获取`wx.config`配置需要的`signature`, 传递随机数`nonceStr`，时间戳`timestamp`等参数给服务端生成签名。

3. `wx.config`接口注入权限验证配置——通过`signature`等验证后。

4. 通过`openId`获取`prepay_id`。

5. 前端生成另一个签名`paySign`, 然后调用`wx.ready`里`wx.chooseWXPay`的方法调起支付。

### Show Your the Code

```javascript
// ES6、jquery结合的写法.

class WxpayCtrl {
  constructor() {
    this.access_token = this.getUrlParams().access_token;
    this.openId = this.getUrlParams().openId;
    this.appId = 'skidfoislkdrehjkgrg';
    this.key = 'sdkjgfgkgkhjishiduh';
  }

  /**
   * [getUrlParams 获取url的参数 querystring]
   * @return {Object} [一个url参数键值配对的对象]
   */
  getUrlParams() {
    const url = window.location.search;
    const queryString = new Object();
    if (url.indexOf('?') !== -1) {
      let str = url.substr(1);
      let strs = str.split('&');
      for (let i = 0; i < strs.length; i++) {
        queryString[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
      }
    }
    return queryString;
  }

  /**
   * [createTimestamp 时间戳]
   * @return {String} [description]
   */
  createTimestamp () {
    return parseInt(new Date().getTime() / 1000) + '';
  }

  /**
   * [createNonceStr 随机字符串]
   * @return {String} [description]
   */
  createNonceStr() {
    return Math.random().toString(36).substr(2, 15);
  }

  /**
   * [getSignature 获取授权签名]
   * @return {String} [description]
   */
  getSignature() {
    const promise = new Promise((resolve, reject) => {
      const data = {
        nonceStr: this.createNonceStr(),
        timestamp: this.createTimestamp(),
        url: window.location.href.split('#')[0],
        access_token: this.accessToken
      };
      $.ajax({
        url: `${url}/wechat/getSignature`,
        type: 'POST',
        data: JSON.stringify(data)
      })
      .done((res) => {
        resolve(res);
      })
      .fail((err) => {
        reject(err.message);
      });
    });
    return promise;
  }

  /**
   * [getPrepayId 用openId获取prepay_id， 和服务端协调后决定queryString]
   * @param  {Number} cash [消费金额]
   * @return {String}      [description]
   */
  getPrepayId (cash=100) {
    const promise = new Promise((resolve, reject) => {
      const data = {
        amount: cash,
        openId: this.openId,
        type: 'JSAPI',
        nonceStr: this.createNonceStr()
      };
      $.ajax({
        url: `${url}/wechat/getPrepayId`,
        type: 'POST',
        data: JSON.stringify(data)
      })
      .done((res) => {
        resolve(res.content);
      })
      .fail((err) => {
        reject(err.message);
      });
    });
    return promise;
  }

  /**
   * [weiPay 微信支付，验证加最终支付]
   * @param  {String} prepay_id [description]
   */
  weiPay(prepay_id) {

    // 随机生成随机数，在不同地方调用的时候是不一样的，尤其注意！！！
    const nonceStr = this.createNonceStr();
    const stringA = `appId=${this.appId}&nonceStr=${nonceStr}&package=prepay_id=${prepay_id}&signType=MD5&timeStamp=${this.createTimestamp()}`;
    const stringSignTemp = `${stringA}&key=${this.key}`;
    const sign = md5(stringSignTemp).toUpperCase();
    wx.chooseWXPay({
      timestamp: this.createTimestamp(),
      nonceStr:  nonceStr,
      package: `prepay_id=${prepay_id}`,
      paySign: sign,
      signType: 'MD5',
      success: (res) => {
        if (res.errMsg === 'chooseWXPay:ok'){
          window.location.href = 'success.html';
        }
      },
      fail: () => {
        window.alert('支付失败！');
        window.location.href = 'fail.html';
      },
      cancel: () => {
        window.location.href = 'cancel.html';
      }
    });
  }

  /**
   * [weixinPay 调起微信支付]
   * @return {[type]} [description]
   */
  weixinPay(cash) {
    this.getSignature()
    .then((signature) => {

      /**
       * [appId 微信支付的相关配置,通过config接口注入权限验证配置]
       */
      wx.config({

        // debug: true, // 该选项仅用于调试
        appId: this.appId,
        timestamp: this.createTimestamp(),
        nonceStr: this.createNonceStr(),
        signature: signature,
        jsApiList: ['chooseWXPay']
      });
      wx.ready(() => {
        this.getPrepayId(cash)
        .then((prepay_id) => {
          this.weiPay(prepay_id);
        })
        .catch((err) => {
          window.alert(err);
        });
      });
    })
    .catch((err) => {
      window.alert(err);
    });
  }
}
```
* 虽然这里有很多回调，代码也略凌乱，但它work了！
* 当然有更好的方案，但紧急需求要求下这是较快的实现方式了。再次对接可让生成签名的工作移交服务端！
* PS：经过这次对接微信支付文档后，对微信的开发失去了信心。然后对微信推出的小程序也坚持保守态度。

<blockquote>
参考：
*  [接入微信支付流程清晰版](http://www.cnblogs.com/sunshq/p/5035163.html)

</blockquote>